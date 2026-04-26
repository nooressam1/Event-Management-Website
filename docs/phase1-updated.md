# Phase 1 Documentation — Event Hub (Event Manager) — Updated

> **Module:** 25CSCI37H — Cloud Computing
> **Team:** Sarra Amro (236382), Noor Essam (232899), Khalid Kamal (234102), Peter Ehab (231345)
> **Note:** This document supersedes `phase1-reference.md`. Sections 2–7 reflect the **actual implemented system** as of the submission build. Deviations from the original proposal are documented in Section 8.

---

## 1. Project Description

Event Hub is an event-management system serving both organizers and attendees. Organizers host events with services such as link invites and RSVP tracking (dietary notes, plus-ones). Guests interact through an intuitive UI to state preferences with minimal friction.

**Implemented core flow:**
1. Organizer signs up / logs in → JWT stored in httpOnly cookie (7-day expiry)
2. Organizer creates event → title, short description, full description, date/time, location (lat/lng), cover image URL, capacity limit, optional RSVP logic toggles
3. On publish → system generates a 16-character hex invite code
4. Guests access the public invite link → RSVP form (name, email, attend/decline, dietary notes, plus-one)
5. Guests with a personal RSVP link can view and update their response at any time before the event
6. Capacity tracking with automatic waitlist promotion on cancellation
7. Day-of check-in interface for organizer staff — search, filter, toggle per guest
8. Post-event analytics: RSVP breakdown, capacity utilization, dietary summary, check-in timeline, conversion funnel, last-minute changes
9. SMTP email delivery via nodemailer — RSVP confirmation, waitlist acceptance, post-event thank-you
10. CSV export of guest list with status and notes
11. Public homepage for browsing events marked as public

---

## 2. Services and Functionalities

### 2.1 Event Management Service (Sarra Amro)

Full event lifecycle — creation through archival. Manages metadata, capacity, invite links, status transitions, filtering, sorting, and searching.

| # | Functionality | Status | Description | Actor |
|---|---|---|---|---|
| 1 | Create Event | ✅ Implemented | Title, short description, full description, date/time, location (address + lat/lng), cover image URL, capacity | Organizer |
| 2 | Update Event | ✅ Implemented | Edit all event fields; wizard pre-fills existing data | Organizer |
| 3 | Delete Event | ✅ Implemented | Permanent removal including all associated RSVPs | Organizer |
| 4 | Set Event Status | ✅ Implemented | DRAFT → PUBLISHED → COMPLETED / CANCELLED via dashboard actions | Organizer |
| 5 | Generate Invite Link | ✅ Implemented | 16-char hex code generated on publish; shareable URL displayed in Step 3 of wizard with copy + social share buttons | Organizer |
| 6 | Revoke Invite Link | ✅ Implemented | One-click revoke from EventDashboard; code becomes non-functional | Organizer |
| 7 | List Organizer Events | ✅ Implemented | My Events page; card grid sorted by closest date by default | Organizer |
| 8 | Filter Events | ✅ Implemented | By date range (from/to) and by status tab (All / DRAFT / PUBLISHED / COMPLETED / CANCELLED) | Organizer |
| 9 | Search Events | ✅ Implemented | Client-side real-time search by title and description | Organizer |
| 10 | Sort Events | ✅ Implemented | By upcoming date, title A–Z, or attendee count | Organizer |
| 11 | QR Code for invite link | ❌ Not implemented | Planned as optional; not built | Organizer |
| — | RSVP Logic Toggles *(added)* | ✅ Implemented | Enable Waitlist, Allow Plus-Ones, Auto-Accept, Public Event | Organizer |
| — | Custom RSVP Questions *(added)* | ✅ Implemented | Organizer can add text / multiple-choice / yes-no fields to the RSVP form | Organizer |
| — | Public Homepage *(added)* | ✅ Implemented | Events with `isPublic = true` appear on the browsable homepage at `/` | Guest |

**Stats sidebar on My Events:** Stats cards show active event count, total RSVPs this month, and upcoming events in the next 7 days.

---

### 2.2 RSVP & Guest Management Service (Noor Essam)

Guest interaction with Event Hub — RSVP handling, dietary restrictions, plus-ones, and waitlist management.

| # | Functionality | Status | Description | Actor |
|---|---|---|---|---|
| 1 | Submit RSVP | ✅ Implemented | Attend/Decline with dietary notes; available via personal invite link and public invite code | Guest |
| 2 | Update RSVP | ✅ Implemented | Re-submit via personal invite link (`/invitation/:id`) | Guest |
| 3 | View Own RSVP | ✅ Implemented | Personal invite page shows current status, event details, and Leaflet map | Guest |
| 4 | Add Guest Notes | ✅ Implemented | Dietary notes stored on the RSVP; also supported for plus-one | Guest |
| 5 | Add Plus-One | ✅ Implemented | Name + dietary notes embedded in RSVP document | Guest |
| 6 | Remove Plus-One | ✅ Implemented | Toggled via the RSVP update form | Guest |
| 7 | Join Waitlist | ✅ Implemented | Auto-assigned when event is at capacity and `enableWaitlist = true` | Guest |
| 8 | Promote from Waitlist | ✅ Implemented | Manual promotion via ManageAttendees page (bulk or single action) | Organizer |
| 9 | Auto-Promote Waitlist | ✅ Implemented | Fires server-side when a confirmed guest cancels or is removed | System |
| 10 | Filter Guests | ⚠️ Partial | Filter by RSVP status (ATTENDING / WAITLISTED / DECLINED / All) is implemented; dedicated dietary or plus-one filters are not | Organizer |
| 11 | Search Guests | ✅ Implemented | Real-time search by guest name or email on ManageAttendees and EventDashboard | Organizer |

**Public invite-link flow:** Guest visits `/event/:inviteCode` → fills form → receives RSVP confirmation email → shown `PublicRsvpSuccess` screen with status-specific messaging.

**Personal invite flow:** Guest visits `/invitation/:accessCode` → can view event details and current RSVP response → can re-submit to change response.

---

### 2.3 Stats & Dashboard Service (Khalid Kamal)

Post-event analysis and reporting — RSVP breakdowns, capacity utilization, dashboard summaries.

| # | Functionality | Status | Description | Actor |
|---|---|---|---|---|
| 1 | RSVP Breakdown | ✅ Implemented | Count and percentage of ATTENDING / DECLINED / WAITLISTED / PENDING | Organizer |
| 2 | Capacity Utilization | ✅ Implemented | `min(checkIns / capacity × 100, 100)%` shown on Analytics page and dashboard capacity card | Organizer |
| 3 | Last-Minute Changes | ✅ Implemented | 24-hour window before event, bucketed into 12 × 2-hour bins; bar chart visualization | Organizer |
| 4 | Attendance Rate | ✅ Implemented | `checkIns / confirmed × 100%`; shown as donut chart and summary card | Organizer |
| 5 | Plus-One Statistics | ✅ Implemented | Count of RSVPs with a plus-one; displayed in summary cards | Organizer |
| 6 | Dietary Summary | ✅ Implemented | Notes classified by regex into 8 categories (vegetarian, vegan, gluten-free, nut allergy, halal, kosher, dairy-free, other); bar chart | Organizer |
| 7 | Organizer Overview | ✅ Implemented | Stats cards on My Events: active events, total RSVPs this month, upcoming in 7 days | Organizer |
| 8 | Dashboard Summary | ✅ Implemented | `GET /api/analytics/events/:id` returns a single aggregated payload consumed by 9 chart components | Organizer |
| — | RSVP Timeline *(added)* | ✅ Implemented | 14-day window before event bucketed by calendar day; bar chart | Organizer |
| — | Check-In Timeline *(added)* | ✅ Implemented | Check-ins bucketed by hour-of-day; bar chart | Organizer |
| — | Conversion Funnel *(added)* | ✅ Implemented | Total RSVPs → Confirmed → Checked In visual funnel | Organizer |

**Chart implementation:** All 9 chart components use custom SVG and CSS (no third-party chart library). See Section 7.

---

### 2.4 Check-In, Export & Notification Service (Peter Ehab)

Day-of check-in, data export, and email notifications.

| # | Functionality | Status | Description | Actor |
|---|---|---|---|---|
| 1 | Navigate to Check-In | ✅ Implemented | Check-In page accessible from sidebar for PUBLISHED events | Organizer |
| 2 | Check In Guest | ✅ Implemented | Toggle button per guest; `checkedIn = true`, `checkedInAt` timestamp recorded | Organizer |
| 3 | Undo Check-In | ✅ Implemented | Same toggle reverses check-in | Organizer |
| 4 | Check-In Progress | ✅ Implemented | `LivePulse` component shows checked-in count vs. attending; `CheckInBoxGuest` per row | Organizer |
| 5 | Export Guest List (CSV) | ✅ Implemented | `GET /api/events/:id/export` — columns: Name, Email, Status, Plus One, Checked In, Notes | Organizer |
| 6 | Export Guest List (PDF) | ❌ Not implemented | Planned; not built | Organizer |
| 7 | Export Dietary Summary | ❌ Not implemented | Dietary notes not included in the CSV export | Organizer |
| 8 | Mark Event Completed | ✅ Implemented | "Mark as Completed" action in EventDashboard locks status to COMPLETED | Organizer |
| 9 | Send Invite Email (manual) | ❌ Not implemented | No organizer-triggered manual invite email UI | Organizer |
| 10 | Send Reminder Email | ❌ Not implemented | No reminder email workflow | Organizer |
| 11 | Send RSVP Confirmation | ✅ Implemented | Auto-sent on every RSVP submission (public invite and personal link) | System |
| 12 | Send Thank-You Email | ✅ Implemented | Auto-triggered when organizer marks event as started/ended | System |
| — | Waitlist Acceptance Email *(added)* | ✅ Implemented | Sent automatically when guest is promoted from waitlist to ATTENDING | System |

**Email delivery:** All emails are sent via **nodemailer** (SMTP), not SendGrid. See Section 8 for details.

---

## 3. Architecture

**Stack:** MERN (MongoDB, Express.js, React, Node.js) — client-server with RESTful API.

**Backend:**
- Node.js + Express.js REST API (ES module syntax — `type: "module"` in package.json)
- Mongoose ODM → MongoDB Atlas
- JWT authentication — token issued at sign-in, stored in **httpOnly `SameSite=lax` cookie** (7-day expiry); verified by `authMiddleware.js` on all protected routes
- Guest endpoints (RSVP, invite link) are fully public — no auth token required
- **Socket.IO** partially wired — room join/leave implemented, but `emitCapacityUpdate` is never called by any controller; no live events are emitted
- **nodemailer** for SMTP email delivery with three automated message types

**Frontend:**
- React 19 SPA — functional components, hooks, Context API
- React Router v7 for client-side routing
- Axios with `withCredentials: true` for all API calls
- Tailwind CSS v4 for all styling (Vite plugin integration)
- **Formik + Yup** for form state management and validation
- **Leaflet / React-Leaflet** for location map on RSVP pages
- Custom SVG and CSS-based chart components (no third-party chart library)

**User roles:**
- **Organizer** — authenticated; full access to event creation, guest management, analytics, check-in, and export
- **Guest** — unauthenticated; accesses RSVP form via invite link (public or personal); personal RSVP link is the sole access credential

**Route layouts:**
- `GuestLayout` — header with logo and Login/My Events button + Footer; used for `/`, `/invitation/:id`, `/event/:inviteCode`
- `UserLayout` — `SideNavigationBar` sidebar + Footer; used for `/myevents`, `/events/*`, `/dashboard/*`, `/checkin/*`
- Auth pages (`/login`, `/signup`) use `AuthPage` directly with no shared layout

---

## 4. Cloud Service Model

### 4.1 As Cloud Provider (SaaS)
Event Hub is delivered as SaaS — browser-based, no install required. Organizers sign up and manage events; guests access via shared invite links with zero setup.

### 4.2 As Cloud Consumer
- **MongoDB Atlas** (DBaaS/PaaS) — managed cloud database; backend connects via `MONGO_URI`
- **Azure** (PaaS) — backend deployment as Docker container (Azure Container Instance or App Service)
- **Vercel** (PaaS) — frontend deployment; `VITE_API_URL` set at build time
- **SMTP Provider** (SaaS) — email delivery via nodemailer; any SMTP service (Gmail, Outlook, SendGrid SMTP relay) configured via environment variables

---

## 5. Cloud Deployment Model

**Public cloud** for all services. Justified by:
- Consumer-facing application with no regulatory private-infrastructure requirements
- Data (event details, attendee names, dietary notes) is not classified as highly sensitive
- Public cloud provides managed scalability, global availability, and cost efficiency at this scale

**Access control within public cloud:**
- JWT middleware (`authMiddleware.js`) protects all organizer endpoints
- Guest RSVP endpoints scoped to invite codes and nanoid(21) access codes
- MongoDB Atlas IP allowlist restricts direct database access to the backend container
- SMTP credentials and JWT secret are server-side environment variables only; never sent to the client

---

## 6. Cloud Layers

| Layer | Component | Cloud Provider | Cloud Consumer |
|---|---|---|---|
| Application | React Frontend, Node.js API | Our team | End-users (organizers, guests) |
| Platform | Vercel, Azure, MongoDB Atlas | Vercel, Azure, MongoDB Inc. | Our team |
| Infrastructure | Servers, storage, networking | AWS/GCP/Azure (underlying IaaS) | Vercel, Azure, MongoDB Atlas |
| External SaaS | SMTP Email (via nodemailer) | Any SMTP provider (e.g. Gmail, Outlook) | Our team |

---

## 7. Tools and Technologies

| Category | Technology | Version | Purpose |
|---|---|---|---|
| Frontend | React | 19 | SPA framework |
| Frontend | React Router | 7 | Client-side routing |
| Frontend | Axios | 1.14 | HTTP client (all API calls) |
| Frontend | Formik | 2.4 | Form state management |
| Frontend | Yup | 1.7 | Form validation schemas |
| Frontend | Tailwind CSS | 4.2 | Utility-first styling (Vite plugin) |
| Frontend | Leaflet / React-Leaflet | 1.9 / 5.0 | Location map on RSVP pages |
| Frontend | Socket.IO Client | 4.8 | Real-time capacity updates (partially wired) |
| Frontend | Lucide React | 0.577 | Icon set |
| Frontend | Custom SVG charts | — | Dashboard visualizations (replaces Recharts/Chart.js) |
| Backend | Node.js | 20 (Docker) | Runtime |
| Backend | Express.js | 5.2 | REST API framework |
| Backend | Mongoose | 9.2 | MongoDB ODM |
| Backend | JWT (`jsonwebtoken`) | 9.0 | Token-based auth (httpOnly cookie) |
| Backend | bcrypt | 6.0 | Password hashing |
| Backend | nodemailer | 8.0 | SMTP email delivery |
| Backend | nanoid | 5.1 | RSVP access code generation (21-char) |
| Backend | Socket.IO | 4.8 | Real-time WebSocket server |
| Backend | cookie-parser | 1.4 | JWT cookie reading |
| Database | MongoDB Atlas | Cloud | Managed NoSQL database |
| Deployment | Vercel | — | Frontend hosting (auto-deploy from GitHub) |
| Deployment | Azure | — | Backend hosting (Docker container) |
| Deployment | Docker / docker-compose | — | Container builds + local full-stack testing |
| Dev Tools | Git / GitHub | — | Version control |
| Dev Tools | Nodemon | 3.1 | Dev server auto-restart |

> **Removed from proposal:** Recharts / Chart.js (replaced by custom SVG), SendGrid SDK (replaced by nodemailer SMTP). See Section 8.

---

## 8. Changes from Phase 1 Proposal

This section explicitly lists every deviation from the original Phase 1 proposal and the justification for each.

### 8.1 Email Delivery — SendGrid → nodemailer (SMTP)

**Original:** SendGrid RESTful API for all transactional email.
**Actual:** `nodemailer` with configurable SMTP transport (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`).

**Justification:** nodemailer is provider-agnostic. Any SMTP relay (Gmail, Outlook, SendGrid SMTP, Mailgun SMTP) can be dropped in via environment variables without a vendor SDK. The `EmailLog.sendgridMessageId` field name is a naming artefact from an earlier refactor — it stores the nodemailer `messageId`.

**Impact:** The three automated email types (RSVP confirmation, waitlist acceptance, post-event thank-you) are all implemented. Manual organizer-triggered emails (invite, reminder) were not built.

---

### 8.2 Manual Email Actions — Not Implemented

**Original (§2.4, items 9–10):** Organizer can manually send invite emails and reminder emails via UI.
**Actual:** Not built. Only the three automated server-triggered emails are implemented.

**Justification:** Automated emails cover the most critical notification moments. Manual bulk email was descoped to meet the delivery deadline.

---

### 8.3 PDF Export — Not Implemented

**Original (§2.4, item 6):** Export guest list as formatted PDF.
**Actual:** Only CSV export is implemented (`GET /api/events/:id/export`).

**Justification:** CSV covers the functional requirement (downloading the guest list). PDF generation requires a headless renderer (puppeteer, pdfmake) and was descoped.

---

### 8.4 Dietary Summary Export — Not Implemented

**Original (§2.4, item 7):** Separate export for aggregated dietary summary.
**Actual:** Dietary data is visible in the Analytics page charts but is not included in the CSV export nor exported as a standalone file.

**Justification:** The analytics page provides dietary breakdown visually. A downloadable dietary report was not prioritized.

---

### 8.5 QR Code for Invite Link — Not Implemented

**Original (§2.1, item 5, "optional QR code"):** Optional QR code alongside invite link.
**Actual:** Invite link is displayed as a URL with copy and social-share buttons; no QR code rendered.

**Justification:** Marked optional in the original proposal. The copy + share buttons satisfy the core sharing requirement.

---

### 8.6 Guest Filters — Partial Implementation

**Original (§2.2, item 10):** Filter guests by RSVP status, dietary info, and plus-one.
**Actual:** Filtering by RSVP status is fully implemented on both ManageAttendees and EventDashboard. Dedicated dietary filter and plus-one filter are not implemented; dietary data is surfaced only in the Analytics dietary chart.

---

### 8.7 Chart Library Replaced with Custom SVG

**Original (§7):** Recharts / Chart.js listed as the dashboard visualization library.
**Actual:** All 9 chart components are built from scratch using custom SVG rings and CSS flex-based bar columns with Tailwind tokens. No third-party chart library is used.

**Justification:** Custom components avoid a heavy dependency, allow full visual control matching the design system, and stay within Tailwind token constraints. Tradeoff: no built-in accessibility features or tooltips beyond simple CSS opacity transitions.

---

### 8.8 Features Added Beyond Proposal

The following were not in the original Phase 1 proposal but were implemented:

| Feature | Description |
|---|---|
| RSVP Logic Toggles | Organizer can enable/disable: waitlist, plus-ones, auto-accept, public visibility per event |
| Custom RSVP Questions | Organizer can add text, multiple-choice, or yes/no custom fields to the RSVP form |
| Auto-Accept Mode | If enabled, new RSVPs go directly to ATTENDING without organizer approval |
| Public Homepage | Browsable homepage at `/` listing events where `isPublic = true` |
| Waitlist Acceptance Email | Sent automatically when a guest is promoted from waitlist to confirmed |
| Socket.IO Infrastructure | Room join/leave architecture wired; `emitCapacityUpdate` exported but not yet called by any controller — pending completion |
| Personal Invite Links | Each RSVP gets a unique nanoid(21) access code (`/invitation/:code`) so guests can view and update their own response without an account |
| Location Map | Leaflet map on RSVP pages shows event location when lat/lng are provided |
| Email Audit Log | Every email send attempt is recorded in `EmailLog` collection for backend observability |
| Docker Infrastructure | Multi-stage Dockerfiles for both frontend (nginx) and backend (Node.js); `docker-compose.yml` for local stack testing |

---

### 8.9 Architecture Changes

| Aspect | Proposed | Actual |
|---|---|---|
| JWT storage | Not specified | httpOnly `SameSite=lax` cookie (never in localStorage) |
| Real-time | Not planned | Socket.IO partially implemented; no events emitted yet |
| HTTPS cookie flag | — | `secure: false` in all three auth cookie writes; should be `process.env.NODE_ENV === 'production'` before production deploy |
| Session lifetime | Not specified | 7-day JWT; cookie is a session cookie (no `maxAge`) — browser-close expires client cookie, server-side JWT valid 7 days |
