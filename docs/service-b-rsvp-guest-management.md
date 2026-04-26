# Service B — RSVP & Guest Management

## Overview

Service B handles all guest-facing and organizer-facing flows around RSVPs, waitlist management, and event attendance. It consists of two primary API namespaces:

- `/api/rsvp` — direct RSVP operations (guest-facing by ID, organizer-facing by event)
- `/api/invite` — public invite-link flow (new guest self-registration)

---

## Architecture

```
Backend/
├── src/
│   ├── controllers/
│   │   ├── rsvpController.js       — RSVP CRUD, bulk ops, check-in toggle
│   │   └── inviteController.js     — Public invite-link event lookup + new RSVP creation
│   └── routes/
│       ├── rsvpRoutes.js           — /api/rsvp (mixed public/protected)
│       └── inviteRoutes.js         — /api/invite (fully public)
Frontend/
└── src/Modules/
    ├── rsvp/
    │   ├── components/             — EventDetails, PlusOne, RsvpStatus, LocationMap, SubmittedResponse, RsvpFormPanel, PublicRsvpSuccess
    │   ├── hooks/                  — useInvitation, usePublicEvent
    │   └── pages/                  — InvitationPage (personal invite), PublicEventPage (invite-link)
    └── invitations/
        ├── components/             — GuestBox, ManageAttendeesStats
        ├── hooks/                  — useWaitlist
        └── pages/                  — manageAttendees
```

---

## API Reference

### Public Routes (no auth)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/rsvp/:id` | Fetch a personal RSVP by its ID (for the invitation page) |
| `POST` | `/api/rsvp/:id/submit` | Guest submits or updates their RSVP response |
| `GET` | `/api/invite/:inviteCode` | Fetch event details by public invite code |
| `POST` | `/api/invite/:inviteCode` | New guest self-registers via the public invite link |

### Protected Routes (organizer — JWT required)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/rsvp/:id/checkedIn` | Get all checked-in guests for an event |
| `GET` | `/api/rsvp/:id/:status` | Get RSVPs filtered by status (ATTENDING, WAITLISTED, PENDING, DECLINED) |
| `PATCH` | `/api/rsvp/bulk-update` | Bulk update status for multiple RSVPs |
| `PATCH` | `/api/rsvp/:rsvpId/checkin` | Toggle check-in status for one guest |
| `PATCH` | `/api/rsvp/:rsvpId/status` | Update single RSVP status |
| `DELETE` | `/api/rsvp/delete/:rsvpId` | Delete an RSVP (triggers waitlist promotion) |

---

## Authentication Model

| Actor | Auth | How |
|-------|------|-----|
| Guest (personal invite) | None | RSVP ID in URL is the access token — it is unique and unguessable (nanoid 21 chars) |
| Guest (public invite link) | None | Invite code in URL; code validity checked against published events |
| Organizer | JWT cookie | `protect` middleware applied via `router.use(protect)` |

**Security note:** The personal RSVP ID is both the identifier and the authentication token for the guest flow. Treat it as a secret URL — do not expose it in analytics or logs.

---

## Data Model

### RSVP Schema (`models/RSVP.js`)

| Field | Type | Notes |
|-------|------|-------|
| `eventId` | ObjectId → Event | Required, indexed |
| `guestName` | String | Required |
| `guestEmail` | String | Required, lowercase, unique per event |
| `accessCode` | String | Unique nanoid(21), the secret URL token |
| `status` | Enum | PENDING / ATTENDING / WAITLISTED / DECLINED |
| `dietaryNotes` | String | Free text dietary requirements |
| `plusOne` | Embedded doc | `{ name, dietaryNotes }` — null if no plus-one |
| `waitlistPosition` | Number | Null unless status is WAITLISTED; lower = higher priority |
| `checkedIn` | Boolean | Set by organizer on event day |
| `checkedInAt` | Date | Timestamp of check-in (null if not checked in) |
| `lastModifiedAt` | Date | Auto-updated on every save |

### Plus-One Schema (embedded)

```js
{ name: String, dietaryNotes: String }
```

Plus-ones are embedded in the RSVP document — they are not separate RSVPs. This means:
- They count against capacity only if explicitly tracked (current implementation does not add +1 to count)
- Dietary notes for plus-ones are stored separately from the primary guest
- Removal happens by setting `rsvp.plusOne = null`

### Event Fields Relevant to RSVP Logic

| Field | Type | Effect |
|-------|------|--------|
| `capacity` | Number | Maximum confirmed ATTENDING count |
| `enableWaitlist` | Boolean | If true, guests join waitlist when event is full; otherwise 409 |
| `allowPlusOnes` | Boolean | If false, `plusOne` field is nulled before saving |
| `autoAccept` | Boolean | If true, RSVP goes directly to ATTENDING; otherwise PENDING |
| `inviteCode` | String | Hex token generated on publish; used by public invite link |
| `inviteLinkActive` | Boolean | False after revoke; `getEventByInviteCode` checks status=PUBLISHED |

---

## Waitlist Logic

### Guest submits going → event is full

```
confirmedCount = RSVP.count({ eventId, status: ATTENDING, _id: { $ne: thisRsvp } })

if confirmedCount >= event.capacity:
  if event.enableWaitlist:
    lastPosition = RSVP.findOne({ status: WAITLISTED }).sort(waitlistPosition: -1)
    rsvp.status = WAITLISTED
    rsvp.waitlistPosition = lastPosition + 1
  else:
    return 409 "event is at full capacity"
else:
  rsvp.status = autoAccept ? ATTENDING : PENDING
```

### Auto-promotion (server-side, triggered automatically)

When a guest cancels (changes to DECLINED), is deleted, or is bulk-moved to DECLINED, the server calls `promoteFromWaitlist(eventId)`:

```
event = Event.findById(eventId)
confirmedCount = RSVP.count({ eventId, status: ATTENDING })
if confirmedCount >= capacity → return (no space)
next = RSVP.findOne({ eventId, status: WAITLISTED }).sort(waitlistPosition: 1)
next.status = ATTENDING
next.waitlistPosition = null
next.save()
sendAcceptance(next, event)  // sends confirmation email
```

**This is fully server-side.** No client polling or websockets needed. The promotion fires fire-and-forget (`.catch` logged but not awaited). If the promotion email fails, the status change still persists.

---

## Invite Link Flow

1. Organizer publishes event → `generateInviteCode()` creates a hex code, sets `inviteLinkActive = true`
2. Frontend builds invite URL: `/event/:inviteCode` → renders `PublicEventPage`
3. `GET /api/invite/:inviteCode` → returns event (checks `status = PUBLISHED`)
4. Guest fills form, submits `POST /api/invite/:inviteCode`
5. Backend checks for duplicate email → 409 if already registered
6. Applies same capacity/waitlist logic as personal RSVP submit
7. Creates new RSVP document, sends confirmation email
8. Frontend shows `PublicRsvpSuccess` screen with status-specific messaging

**Organizer can revoke** the link at any time (`inviteLinkActive = false`), making the code non-functional.

---

## Dietary Notes Aggregation

Dietary notes appear in two places per RSVP:
- `rsvp.dietaryNotes` — primary guest
- `rsvp.plusOne.dietaryNotes` — plus-one (if present)

The analytics service aggregates both when building the dietary summary chart, flattening them into a single list of notes for the event.

---

## Check-In Flow

1. Event day → organizer opens Check-In page (`/dashboard/:id/checkin`)
2. Page fetches all ATTENDING RSVPs via `GET /api/rsvp/:id/ATTENDING`
3. Organizer toggles a guest → `PATCH /api/rsvp/:rsvpId/checkin`
4. Backend flips `checkedIn` boolean, sets/clears `checkedInAt`
5. UI updates optimistically (local state update without refetch)
6. Analytics reads `checkedIn` and `checkedInAt` to compute attendance rate and check-in timeline

---

## Frontend Hooks

### `useInvitation(id)` — `rsvp/hooks/useInvitation.js`
Manages personal RSVP page state: fetches invitation by RSVP ID, runs Formik submit to `POST /api/rsvp/:id/submit`. Returns form controls, status toggles, and submit state.

### `usePublicEvent(inviteCode)` — `rsvp/hooks/usePublicEvent.js`
Manages public invite page state: fetches event by invite code, runs Formik submit to `POST /api/invite/:inviteCode`. Returns the same shape as `useInvitation` minus the personal invite fields.

### `useWaitlist(id, status)` — `invitations/hooks/useWaitlist.js`
Manages organizer waitlist page: fetches guests by status (default WAITLISTED), fetches attending count, provides `handleMoveToConfirmed` (bulk PATCH → ATTENDING) and `handleDelete` (DELETE + promote). Returns recent activity log for the sidebar.

---

## Known Limitations

- **Plus-one capacity**: Plus-ones are stored in the RSVP but do not consume a separate capacity slot. A couple registers as 1 slot used. This could under-count physical attendance.
- **No real-time updates**: Waitlist promotion and check-in updates are not pushed to open browser sessions. Organizer must refresh to see changes made by other sessions.
- **Email failure is silent**: All notification sends are fire-and-forget; failures are logged but do not surface to the user or organizer.
- **No duplicate check on personal RSVP**: The personal RSVP submit (`POST /api/rsvp/:id/submit`) can be called by anyone who knows the RSVP ID. There is no additional ownership check beyond the ID itself.
