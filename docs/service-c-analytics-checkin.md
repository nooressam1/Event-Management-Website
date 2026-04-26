# Service C — Analytics & Check-In

## Overview

Service C covers two related domains that both read from RSVP and Event data:

- **Analytics** — post-event aggregation of attendance, dietary, and conversion metrics
- **Check-In** — event-day guest verification and attendance tracking

Neither domain creates its own data; both are read-heavy services that operate on records owned by Services A and B.

---

## Architecture

```
Backend/src/
  controllers/analyticsController.js   — thin handler, delegates to analyticsService
  routes/analyticsRoutes.js            — /api/analytics (all protected)
  services/Analytics_Service/
    analyticsService.js                — all aggregation logic

Frontend/src/Modules/
  analytics/
    components/   — 9 chart/header components (all presentational, no fetching)
    hooks/        — useEventAnalytics
    pages/        — EventAnalytics
    utils/        — analyticsService (HTTP client)
  checkin/
    components/   — CheckInBoxGuest, LivePulse
    pages/        — CheckInPage

Shared (Event_Creator_Suite_Service/):
  hooks/useCheckIn.js      — check-in state management
  utils/checkInService.js  — check-in API calls
```

---

## API Reference

### Analytics (protected — organizer JWT required)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/analytics/events/:id` | Compute and return all analytics for one event |

Returns a **single aggregated payload** — the frontend makes one API call for all charts.

### Check-In (via RSVP routes, all protected)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/rsvp/:id/ATTENDING` | Load attending guests for the check-in list |
| `PATCH` | `/api/rsvp/:rsvpId/checkin` | Toggle check-in for one guest |
| `GET` | `/api/events/:id` | Event metadata (title, capacity) |

There is no dedicated check-in route namespace — check-in piggybacks on RSVP routes.

### Export (via Event routes, protected)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/events/:id/export` | Download full attendee list as CSV |

---

## Analytics Aggregation

All computation runs in `computeEventAnalytics()` in `analyticsService.js`. It performs **one `Event.findOne` and one `RSVP.find`** (all RSVPs), then derives all metrics in memory — no separate DB query per metric.

### Summary Metrics

| Metric | Derivation |
|--------|-----------|
| `totalRSVPs` | `rsvps.length` |
| `confirmed` | count where `status = ATTENDING` |
| `waitlisted` | count where `status = WAITLISTED` |
| `declined` | count where `status = DECLINED` |
| `pending` | count where `status = PENDING` |
| `checkIns` | count where `r.checkedIn === true` |
| `noShows` | `max(confirmed - checkIns, 0)` |
| `plusOnes` | count where `r.plusOne !== null` |
| `attendanceRate` | `round(checkIns / confirmed * 100)`% |
| `capacityUtilization` | `min(round(checkIns / capacity * 100), 100)`% |

### Time-Series Data

**RSVP Timeline** — 14-day window before event, bucketed by calendar day. Each bucket counts RSVPs *created* in that window.

**Check-In Timeline** — bucketed by hour-of-day (`"14:00"`, `"15:00"`, ...) based on `checkedInAt`. Only populated after check-ins are recorded.

**Last-Minute Changes** — 24-hour window before event, 12 x 2-hour buckets. Counts RSVPs where `lastModifiedAt` falls in the window — captures late cancellations and updates.

### Dietary Aggregation

Notes from `r.dietaryNotes` and `r.plusOne.dietaryNotes` are classified by regex into: `vegetarian`, `vegan`, `glutenFree`, `nutAllergy`, `halal`, `kosher`, `dairyFree`, `other`. A single note can match multiple categories. Empty or non-matching notes are skipped.

---

## Chart Library

**No third-party chart library is used.** All 9 chart components use:
- Custom SVG rings (`AttendanceDonut`, `LivePulse`)
- CSS `flex + inline height` bar columns (all timeline and bar charts)
- Tailwind tokens for all colours and spacing

This avoids Recharts/Chart.js as a dependency. Tradeoff: no built-in tooltips, zoom, or accessibility features — hover tooltips are simple CSS opacity transitions.

---

## Frontend Data Flow

```
EventAnalytics (page)
  useEventAnalytics(eventId)
    GET /api/analytics/events/:id
      computeEventAnalytics() returns single response object

Destructured at page level, passed as props:
  AnalyticsHeader       <- event
  AnalyticsSummaryCards <- summary
  ConversionFunnel      <- summary, capacity
  AttendanceDonut       <- summary
  LastMinuteChart       <- lastMinuteChanges
  DietarySummary        <- dietary
  RSVPBreakdown         <- summary
  RSVPTimeline          <- rsvpTimeline
  CheckInTimeline       <- checkInTimeline
```

Each chart is a **pure presentational component** — no data fetching, no side effects.

---

## Check-In Flow

### State Machine

Event must be `PUBLISHED` — EventSideBar only shows the Check-In nav item for published events.

```
useCheckIn(eventId)
  fetchEvent(eventId)       GET /api/events/:id
  fetchAttendees(eventId)   GET /api/rsvp/:id/ATTENDING

handleToggle(rsvpId)
  setTogglingId(rsvpId)         disables that row button while in-flight
  PATCH /api/rsvp/:rsvpId/checkin
    rsvp.checkedIn toggled, rsvp.checkedInAt set or cleared
  optimistic local state update (no refetch needed)
  setTogglingId(null)
```

Search (by name/email) and filter (All / Pending / Checked In) are **client-side only** — no API call per filter change.

### Real-Time Behaviour

There is **no socket or polling**. `LivePulse` and the checked-in count both derive from local React state and reflect only the current session's toggles. A second organiser on a different device will not see updates until page refresh.

---

## Export Functionality

`GET /api/events/:id/export` streams a CSV attachment:

```
Name, Email, Status, Plus One, Checked In, Notes
```

Triggered from the Analytics page via `window.open(getExportUrl(id), "_blank")`. The browser handles the download natively via `Content-Disposition: attachment` header.

**Included:** all RSVPs (all statuses), plus-one name, checked-in boolean, additional notes.
**Not included:** dietary notes, waitlist position, check-in timestamp.

---

## Cross-Service Dependencies

| Data field read | Written by |
|-----------------|-----------|
| `RSVP.checkedIn` / `checkedInAt` | Service C (check-in toggle) |
| `RSVP.status` | Service B (RSVP submit, bulk update) |
| `RSVP.dietaryNotes` / `plusOne` | Service B (RSVP submit) |
| `RSVP.lastModifiedAt` | Service B (RSVP pre-save hook) |
| `RSVP.createdAt` | Service B (initial RSVP creation) |
| `Event.capacity` / `organizer` | Service A (event creation) |

Analytics is only meaningful **after** check-ins have been recorded. Running before the event returns valid RSVP metrics but zeroes for all check-in and attendance metrics.

---

## Dead UI / Known Limitations

| Issue | Detail |
|-------|--------|
| No real-time sync | Two organiser sessions diverge; refresh required to reconcile |
| `sentimentRating` placeholder | Returns `null` — no feedback model or UI widget exists |
| `feedback` array placeholder | Always returns `[]` — no frontend component consumes it |
| Export omits dietary notes | CSV does not include guest dietary requirements |
| Analytics organiser-only | `computeEventAnalytics` verifies `organizer: organizerId` — co-organisers cannot view analytics |
