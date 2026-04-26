# Event Hub — User Manual

> This manual describes the features that exist in the current build. Features not yet implemented are explicitly noted rather than omitted silently.

---

## Getting Started

### Sign Up

1. Navigate to `/signup`.
2. You land on the **AuthPage** — a two-panel layout with a branded panel on the left and the form on the right.
3. Fill in the three fields:
   - **Username** — your display name
   - **Email** — used to log in
   - **Password** — minimum length enforced by Yup validation
4. Click **Sign Up**.
5. On success you are automatically logged in and redirected to **My Events**.

<!-- SCREENSHOT: signup-page.png -->

> **Validation:** The form uses Formik + Yup. Required fields show inline error messages on blur; the button is disabled while the request is in flight.

---

### Login

1. Navigate to `/login` (same AuthPage component, different form panel).
2. Enter your **Email** and **Password**.
3. Click **Log In**.
4. On success a JWT is stored in an httpOnly cookie and you are redirected to **My Events**.
5. Your session persists for 7 days or until you log out.

<!-- SCREENSHOT: login-page.png -->

> **Logging out:** Click your profile avatar in the sidebar → **Logout**. Your cookie is cleared and you are redirected to `/login`.

---

## Organizer Guide

### Creating an Event

The event creation flow is a 3-step wizard at `/events/create`. The same wizard is used for editing (`/events/:id/edit`), with all fields pre-filled.

---

#### Step 1 — Event Details

The left panel collects core event information; the right panel shows a live **Guest View Preview** of how invitees will see the event.

| Field | Notes |
|---|---|
| **Event Name** | Required |
| **Short Description** | One-line teaser shown on event cards |
| **Cover Image URL** | Paste an image URL; preview appears in the guest panel |
| **Date** | Date picker with calendar icon |
| **Start Time** | Time picker with clock icon |
| **Location** | Text address; map preview grid appears below the field |
| **Full Description** | Multi-line textarea; markdown not rendered |

Click **Next** to proceed (requires event name).

<!-- SCREENSHOT: create-event-step1.png -->

---

#### Step 2 — Capacity & Logic

Configure how the event accepts guests.

**Attendance Rules:**

| Control | Type | Effect |
|---|---|---|
| **Total Capacity** | Stepper (+ / −, min 1) | Maximum number of confirmed ATTENDING guests |
| **Enable Waitlist** | Toggle | When on: guests who arrive after capacity is reached join a waitlist and are promoted automatically when a spot opens |
| **Allow Plus-Ones** | Checkbox | When on: guests can register a plus-one (name + dietary notes) on their RSVP form |
| **Public Event** | Toggle | When on: the event appears on the public browsable homepage at `/` |

**RSVP Questions (optional):**

You can add custom fields to the guest RSVP form:
1. Click **Add Question**.
2. Enter the question text in the **Label** field.
3. Choose a **Field Type**: Text Input, Multiple Choice, or Yes/No.
4. Check **Required** if the guest must answer.
5. Click the trash icon to remove a question.

Click **Publish** (requires date, time, and capacity ≥ 1).

<!-- SCREENSHOT: create-event-step2.png -->

---

#### Step 3 — Invite Guests

This screen appears after publishing. Your event is now live.

**Invite Link card:**
- The full invite URL is shown in a read-only field (format: `https://yourdomain.com/event/{inviteCode}`).
- Click **Copy** — the button briefly shows "Copied!" to confirm.
- Quick-share buttons: **WhatsApp**, **Email**, **Slack** — each opens the respective app with the link pre-filled.

Click **Go to Dashboard** to proceed to your event's management page.

<!-- SCREENSHOT: create-event-step3.png -->

> **Note:** The "Final Adjustments" section on this screen (RSVP Deadline, Customize Theme, Registration Form) is a placeholder and not functional in this build.

---

### Managing Your Events

**My Events** (`/myevents`) is your event dashboard hub.

**Stats bar** (top of page):
- Active events count
- Total RSVPs this month
- Events in the next 7 days

**Filtering and searching:**

| Control | How to use |
|---|---|
| **Search bar** | Type to filter cards in real-time by title or description |
| **Sort** | Dropdown: Upcoming Date / Title A–Z / Most Attendees |
| **Date Range** | Set From and To dates; click Clear to reset |
| **Status tabs** | All Events · DRAFT · PUBLISHED · COMPLETED · CANCELLED |

**Event cards grid:**
Each card shows the cover image, event name, date, attendee count, and status badge. An **Add New Event** card is included in the grid for quick access.

**Event status lifecycle:**

```
DRAFT → PUBLISHED → COMPLETED
              ↓
           CANCELLED
```

- **DRAFT** — saved but not visible to guests; no invite link yet.
- **PUBLISHED** — invite link active; guests can RSVP.
- **COMPLETED** — marked complete by organizer; RSVPs locked.
- **CANCELLED** — event cancelled; displayed with cancelled badge.

<!-- SCREENSHOT: my-events.png -->

---

### Event Dashboard

Navigate to an event by clicking its card. The dashboard is at `/events/:id`.

**Event header:**
- Cover image banner (if set)
- Status badge: LIVE (published) · DRAFT · PAST (completed) · CANCELLED
- Title, date, time, location

**Action buttons (top right):**
- **Edit** — opens the creation wizard pre-filled
- **Share Invite** — copies invite link (visible when event is published and invite link is active)
- **Revoke Link** — disables the invite link (visible when active); guests who visit the old URL will see an error
- **More ···** menu:
  - Mark as Completed
  - Cancel Event
  - Delete Event
- **Delete** button (visible on COMPLETED or CANCELLED events)

**Stats cards:**

| Card | What it shows |
|---|---|
| Confirmed | Count of ATTENDING RSVPs + % of total RSVPs |
| Waitlisted | Count of WAITLISTED RSVPs + % of total RSVPs |
| Declined | Count of DECLINED RSVPs + % of total RSVPs |
| Total Capacity | Capacity number + progress bar showing % of capacity filled |

**Attendee table:**
- **Search** — by attendee name or email (real-time)
- **Filter** — dropdown: All Statuses / Confirmed / Waitlisted / Declined
- **Export** — downloads the guest list as CSV (see Exporting Data)
- Columns: Attendee (name + email with avatar), Status badge, Plus One name, Notes, Actions (···)
- Actions per row: Approve → ATTENDING · Decline → DECLINED · Remove (also promotes next waitlisted guest)
- **Pagination:** 10 rows per page; Previous / Next and page number buttons at the bottom

<!-- SCREENSHOT: event-dashboard.png -->

---

### Sharing Invitations

After publishing, your event has a unique public invite link. Guests who visit the link can RSVP without an account.

**From the creation wizard:** The invite link is shown on Step 3 with copy and social-share buttons.

**From the Event Dashboard:** Click **Share Invite** in the action buttons — this copies the URL to your clipboard.

**Revoking the link:**
Click **Revoke Link** on the dashboard. Guests who already submitted RSVPs are unaffected; new visitors to the link will see an error. You cannot re-activate a revoked link, but publishing the event again generates a new invite code.

<!-- SCREENSHOT: invite-link.png -->

> **Managing the waitlist:** Go to `/dashboard/:id` (linked from the sidebar as **Manage Attendees**). This page shows waitlisted guests with their position, and lets you manually move guests to Confirmed or remove them. Removing a confirmed guest triggers automatic promotion of the next waitlisted guest.

---

### Check-In Day

The check-in page is at `/checkin/:id`. It is accessible from the **SideNavigationBar** for PUBLISHED events.

**Page layout:**
- Event title and capacity shown at the top
- `LivePulse` indicator showing current checked-in count vs. attending guests
- Search bar — filter by guest name or email (client-side, instant)
- Filter tabs: **All** · **Pending** · **Checked In**
- Guest list — one row per ATTENDING guest

**Checking in a guest:**
1. Find the guest using search or scroll.
2. Click the check-in toggle button on their row.
3. The row updates immediately (optimistic update — no page reload needed).
4. The `checkedInAt` timestamp is recorded in the database.

**Undoing a check-in:**
Click the toggle button again on a checked-in guest. This clears both `checkedIn` and `checkedInAt`.

<!-- SCREENSHOT: checkin-page.png -->

> **Important:** Check-in state is session-local. If two organisers are checking in guests on separate devices simultaneously, each device shows only its own session's toggles. Refresh the page to pull in changes from other sessions.

---

### Analytics & Reports

The analytics page is at `/events/:id/analytics`. It is available from the sidebar or EventDashboard.

**All data is computed from a single API call** (`GET /api/analytics/events/:id`) after the page loads.

**Charts and what they show:**

| Component | What it shows |
|---|---|
| **AnalyticsHeader** | Event title, date, and cover image |
| **AnalyticsSummaryCards** | Six metric cards: Total RSVPs, Confirmed, Waitlisted, Declined, Check-Ins, No-Shows |
| **ConversionFunnel** | Stacked funnel: Total RSVPs → Confirmed → Checked In |
| **AttendanceDonut** | SVG ring showing attendance rate (`checkIns / confirmed × 100%`) |
| **RSVPTimeline** | Bar chart of RSVPs received per day over the 14 days before the event |
| **CheckInTimeline** | Bar chart of check-ins bucketed by hour of day |
| **LastMinuteChart** | Bar chart of RSVP changes in the 24 hours before the event (12 × 2-hour bins) |
| **DietarySummary** | Bar chart of dietary categories derived from guest notes (vegetarian, vegan, gluten-free, nut allergy, halal, kosher, dairy-free, other) |
| **RSVPBreakdown** | Proportional bar showing ATTENDING / DECLINED / WAITLISTED / PENDING split |

<!-- SCREENSHOT: analytics.png -->

> **Note:** Check-in timeline and attendance rate cards show zeros until check-ins have been recorded. Run analytics after the event for the most complete picture.

---

### Exporting Data

**CSV Export:**
1. On the **EventDashboard**, click the **Export** button above the attendee table.
2. The browser downloads a `.csv` file named `{event_title}_attendees.csv`.

**Columns included:**

| Column | Content |
|---|---|
| Name | Guest's full name |
| Email | Guest's email address |
| Status | ATTENDING / DECLINED / WAITLISTED / PENDING |
| Plus One | Plus-one's name (blank if none) |
| Checked In | true / false |
| Notes | Additional notes from the RSVP |

> **Not included in CSV:** Dietary notes, waitlist position, check-in timestamp.
> **PDF export:** Not available in this build.
> **Dietary summary export:** Dietary data is visible in the Analytics page charts but cannot be downloaded as a file.

---

### Sending Emails

Event Hub sends emails automatically at the following moments:

| Trigger | Email sent | Who receives it |
|---|---|---|
| Guest submits RSVP (any method) | RSVP confirmation with event details and a link to modify their response | Guest |
| Guest is promoted from waitlist to ATTENDING | Acceptance confirmation with event details | Guest |
| Organizer marks event as Completed | Thank-you email | Checked-in guests |

> **Manual emails:** There is no UI to send one-off invite emails or reminders to individual guests or bulk groups. This feature is planned but not implemented in this build.

> **Email failures are silent:** If an email fails to deliver (SMTP error, invalid address), the RSVP or status change still takes effect. Delivery failures are logged server-side but not surfaced to the organizer in the UI.

---

## Guest Guide

### Responding to an Invitation

Guests receive an invite link in one of two forms:

**Public invite link** (`/event/:inviteCode`):
The organizer shares a single URL with everyone. Any guest who visits the link and does not already have an RSVP can register.

**Personal invite link** (`/invitation/:accessCode`):
If the organizer creates RSVPs manually or if the system generates individual links, each guest gets a unique URL that shows their own current RSVP.

---

**Submitting an RSVP via the public link:**

1. Open the link shared by the organizer.
2. The **PublicEventPage** loads showing event details: title, date, time, location, description, and a Leaflet map (if location coordinates are set).
3. Fill in the RSVP form:
   - **Your Name** — required
   - **Your Email** — required; used to identify you (one RSVP per email per event)
   - **Will you attend?** — Attend / Decline toggle
   - **Dietary Notes** — optional free-text field
   - **Plus-One** (if the organizer enabled it): toggle to add a plus-one, then enter their name and optional dietary notes
4. Click **Submit RSVP**.
5. You land on the **PublicRsvpSuccess** screen with a status-specific message:
   - Confirmed → "You're on the list!"
   - Waitlisted → "You're on the waitlist" with your position
   - Declined → confirmation of your decline

<!-- SCREENSHOT: rsvp-page.png -->

> **Duplicate email:** If you try to RSVP with an email that is already registered for the event, you will see a "already registered" error. Use your personal invite link instead (if you have one) to update your response.

---

### Updating Your Response

**Via personal invite link:**
1. Open your personal invite URL (`/invitation/:accessCode`).
2. Your current RSVP status and event details are shown.
3. Change your response (Attend ↔ Decline), update dietary notes, or add/remove a plus-one.
4. Click **Submit** to save the updated response.

**What happens when you cancel:**
- If you change from Attending to Declined, your spot is freed immediately.
- If the event has a waitlist, the next person in the queue is automatically promoted to ATTENDING and receives a confirmation email. You do not need to do anything.

> **After the event date:** The organizer may have marked the event as Completed, which locks RSVPs. If updates are not going through, the event may be closed.

---

### Public Event Browse

The homepage at `/` shows a browsable list of events that organizers have made public (`isPublic = true`).

Each listing shows the event cover image, title, date, and a short description. Click an event to view its details and RSVP if you have not already.

<!-- SCREENSHOT: homepage.png -->

> **Private events:** Events where the organizer did not enable "Public Event" do not appear on the homepage. They are accessible only via the direct invite link shared by the organizer.
