# Phase 1 Documentation — Event Hub (Event Manager)

> **Module:** 25CSCI37H — Cloud Computing
> **Team:** Sarra Amro (236382), Noor Essam (232899), Khalid Kamal (234102), Peter Ehab (231345)

---

## 1. Project Description

Event Hub is an event-management system serving both organizers and attendees. Organizers host events with services such as link invites and RSVP tracking (dietary notes, plus-ones). Guests interact through an intuitive UI to state preferences with minimal friction.

**Core flow:**
1. Organizer creates event → title, description, date/time, location, capacity limit
2. System generates a unique shareable invite link
3. Guests access the link → RSVP (attend/decline), dietary requirements, plus-one option
4. Guests can update their response any time before the event
5. Capacity tracking with automatic waitlist promotion on cancellation
6. Day-of check-in interface for organizer staff
7. Post-event analytics: actual vs. expected attendance, waitlist metrics, last-minute changes
8. SendGrid integration for invite, confirmation, reminder, and thank-you emails
9. CSV/PDF export of guest lists and dietary summaries

---

## 2. Services and Functionalities

### 2.1 Event Management Service (Sarra Amro)

Full event lifecycle — creation through archival. Manages metadata, capacity, invite links, status transitions, filtering, sorting, searching.

| # | Functionality | Description | Actor |
|---|---|---|---|
| 1 | Create Event | Title, description, date/time, cover image, capacity limit | Organizer |
| 2 | Update Event | Edit event data | Organizer |
| 3 | Delete Event | Permanent removal including associated check-in and RSVP data | Organizer |
| 4 | Set Event Status | draft → published → completed/cancelled | Organizer |
| 5 | Generate Invite Link | Unique URL (optional QR code) | Organizer |
| 6 | Revoke Invite Link | Disable link to stop new submissions | Organizer |
| 7 | List Organizer Events | All events for logged-in organizer, default sorted by closest date | Organizer |
| 8 | Filter Events | By date range, past vs. upcoming | Organizer |
| 9 | Search Events | By title or description | Organizer |
| 10 | Sort Events | By event time, attendee count, alphabetical | Organizer |

### 2.2 RSVP & Guest Management Service (Noor Essam)

Guest interaction with Event Hub — RSVP handling, dietary restrictions, plus-ones, waitlist management.

| # | Functionality | Description | Actor |
|---|---|---|---|
| 1 | Submit RSVP | Attend/decline with optional notes | Guest |
| 2 | Update RSVP | Modify response before event | Guest |
| 3 | View Own RSVP | Current status and details | Guest |
| 4 | Add Guest Notes | Dietary needs, accessibility requirements | Guest |
| 5 | Add Plus-One | Name and optional dietary notes | Guest |
| 6 | Remove Plus-One | Remove from RSVP | Guest |
| 7 | Join Waitlist | Auto-add when at capacity | Guest |
| 8 | Promote from Waitlist | Manual promotion to confirmed | Organizer |
| 9 | Auto-Promote Waitlist | Auto-promote on cancellation | System |
| 10 | Filter Guests | By RSVP status, dietary info, plus-one | Organizer |
| 11 | Search Guests | By name or email | Organizer |

### 2.3 Stats & Dashboard Service (Khalid Kamal)

Post-event analysis and reporting — RSVP breakdowns, capacity utilization, dashboard summaries.

| # | Functionality | Description | Actor |
|---|---|---|---|
| 1 | RSVP Breakdown | Count of attending, declined, waitlisted | Organizer |
| 2 | Capacity Utilization | Percentage of capacity filled | Organizer |
| 3 | Last-Minute Changes | RSVPs changed within 24–48 hours of event | Organizer |
| 4 | Attendance Rate | Post-event check-ins vs. confirmed RSVPs | Organizer |
| 5 | Plus-One Statistics | Count and percentage of plus-ones | Organizer |
| 6 | Dietary Summary | Aggregate dietary needs for catering | Organizer |
| 7 | Organizer Overview | Cross-event summary (total events, guests, avg attendance) | Organizer |
| 8 | Dashboard Summary | Consolidated key stats endpoint | Organizer |

### 2.4 Check-in, Export & Notification Service (Peter Ehab)

Day-of check-in, post-event workflows, data export, SendGrid email integration.

| # | Functionality | Description | Actor |
|---|---|---|---|
| 1 | Start Check-In | Activate check-in mode | Organizer |
| 2 | Check In Guest | Mark guest checked in by name search | Organizer |
| 3 | Undo Check-In | Revert mistaken check-in | Organizer |
| 4 | Check-In Progress | Real-time count vs. expected | Organizer |
| 5 | Export Guest List (CSV) | Download attendee list with selected columns | Organizer |
| 6 | Export Guest List (PDF) | Formatted attendee list as PDF | Organizer |
| 7 | Export Dietary Summary | Aggregated dietary report for catering | Organizer |
| 8 | Mark Event Completed | Close event, lock RSVPs, finalize data | Organizer |
| 9 | Send Invite Email | Via SendGrid to email list | Organizer |
| 10 | Send Reminder Email | Via SendGrid to confirmed guests | Organizer |
| 11 | Send RSVP Confirmation | Auto-send via SendGrid on RSVP submit | System |
| 12 | Send Thank-You Email | Post-event via SendGrid to checked-in attendees | Organizer |

**External API:** SendGrid — cloud-based email delivery via RESTful API.

---

## 3. Architecture

**Stack:** MERN (MongoDB, Express.js, React, Node.js) — client-server with RESTful API.

**Backend:**
- Node.js + Express.js REST API
- Mongoose ODM → MongoDB Atlas
- JWT authentication (token issued at sign-in, required for protected endpoints)
- Guest endpoints (RSVP, invite link viewing) are public / unauthenticated

**Frontend:**
- React SPA — functional components, hooks, Context API
- Axios for HTTP requests
- Tailwind CSS for styling

**User roles:**
- **Organizer** — authenticated, full access (create events, manage guests, view analytics, check-in, export)
- **Guest** — unauthenticated, limited public interface via invite links (submit/update RSVP, dietary notes, plus-one)

---

## 4. Cloud Service Model

### 4.1 As Cloud Provider (SaaS)
Event Hub is delivered as SaaS — browser-based, no install required. Organizers sign up and manage events; guests access via shared links with zero setup.

### 4.2 As Cloud Consumer
- **MongoDB Atlas** (DBaaS/PaaS) — managed database
- **Azure** (PaaS) — backend deployment (Docker container)
- **Vercel** (PaaS) — frontend deployment
- **SendGrid** (SaaS) — email delivery API

---

## 5. Cloud Deployment Model

**Public cloud** for all services. Justified by:
- Consumer-facing application, no regulatory private-infra requirements
- Data (event details, attendee names, dietary notes) is not highly sensitive
- Public cloud provides managed scalability, global availability, cost efficiency

**Access control within public cloud:**
- JWT middleware protects organizer endpoints
- Guest endpoints scoped to invite codes
- MongoDB Atlas restricted to backend IP addresses
- SendGrid API keys server-side only

---

## 6. Cloud Layers

| Layer | Component | Cloud Provider | Cloud Consumer |
|---|---|---|---|
| Application | React Frontend, Node.js API | Our team | End-users (organizers, guests) |
| Platform | Vercel, Azure, MongoDB Atlas | Vercel, Azure, MongoDB Inc. | Our team |
| Infrastructure | Servers, storage, networking | AWS/GCP/Azure (underlying IaaS) | Vercel, Azure, MongoDB Atlas |
| External SaaS | SendGrid Email API | Twilio/SendGrid | Our team |

---

## 7. Tools and Technologies

| Category | Technology | Purpose |
|---|---|---|
| Frontend | React.js | SPA framework |
| Frontend | React Router | Client-side routing |
| Frontend | Axios | HTTP client |
| Frontend | Recharts / Chart.js | Dashboard visualizations |
| Frontend | Tailwind CSS | Styling |
| Backend | Node.js | Runtime |
| Backend | Express.js | REST API framework |
| Backend | Mongoose | MongoDB ODM |
| Backend | JWT | Token-based auth |
| Backend | bcrypt | Password hashing |
| Database | MongoDB Atlas | Cloud NoSQL database |
| Deployment | Vercel | Frontend hosting |
| Deployment | Azure | Backend hosting (Docker) |
| External API | SendGrid | Email delivery |
| Dev Tools | Git/GitHub | Version control |
| Dev Tools | Postman / REST Client | API testing |
