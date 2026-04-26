# Service D — Auth, Shared Components & Notifications

## Overview

Service D covers the cross-cutting concerns that all other services depend on:

- **Auth** — JWT-in-cookie login, signup, logout, and session persistence
- **Shared components** — reusable UI building blocks consumed across all modules
- **Notifications** — email delivery (SMTP via nodemailer) triggered by RSVP events
- **Real-time** — Socket.IO infrastructure for capacity updates (partially wired)

---

## Architecture

```
Backend/
  server.js                          — Express app, middleware wiring, socket init
  config/db.js                       — Mongoose connection
  src/
    controllers/authController.js    — signup, login, logout, getCurrentUser
    routes/authRoutes.js             — /api/auth (public)
    middleware/authMiddleware.js      — JWT cookie verification, attaches req.user
    models/User.js                   — User schema with bcrypt pre-save hook
    models/EmailLog.js               — Audit log for every email send attempt
    models/enum.js                   — EMAIL_TYPE, EMAIL_STATUS, RSVP_STATUS enums
    socket.js                        — Socket.IO init + emitCapacityUpdate (see Dead UI)
    services/Notification_Service/
      notificationService.js         — nodemailer transport, send(), three typed senders
      templates/
        rsvpConfirmation.js          — HTML email: RSVP received, modify link
        acceptance.js                — HTML email: promoted from waitlist / confirmed
        thankYou.js                  — HTML email: post-event thank-you

Frontend/src/Modules/
  auth/
    components/  — LoginPage, SignUpPage (Formik + Yup)
    context/     — AuthContext (AuthProvider, useAuth hook)
    pages/       — AuthPage (two-panel layout, routes /login and /signup)
  shared/
    components/  — ColorMap, CustomButton, Footer, LabeledInput, Logo, SearchBar,
                   SideBarBox, SideNavigationBar, StatBar, StatCard,
                   StatPercentage, StatWrapper
  eventManagement/utils/useSocket.js — Socket.IO client hook
```

---

## API Reference

### Auth Routes (`/api/auth`, all public)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/signup` | Create account, set JWT cookie, return user |
| `POST` | `/api/auth/login` | Verify credentials, set JWT cookie, return user |
| `POST` | `/api/auth/logout` | Clear JWT cookie |
| `GET` | `/api/auth/me` | Return current user (protected — requires cookie) |

### Middleware

`authMiddleware.js` — reads `req.cookies.token`, verifies JWT, attaches `req.user = { id }`. Applied to all protected routes (events, RSVP, analytics). Auth routes themselves are public.

---

## Auth Flow

### Session Lifecycle

```
Signup/Login
  POST /api/auth/signup|login
    User.create or bcrypt.compare
    jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" })
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" })
    return user object

App Mount
  AuthProvider.useEffect → GET /api/auth/me (withCredentials: true)
    authMiddleware verifies cookie
    User.findById → setUser(res.data.user)
  setLoading(false) — guards all protected routes

Logout
  POST /api/auth/logout → res.cookie("token", "", { expires: new Date(0) })
  AuthProvider.setUser(null) → redirects to /login
```

### AuthContext API

```js
const { user, loading, login, signup, logout } = useAuth();
```

- `user` — null when unauthenticated; populated user object after successful login/signup or `checkAuth`.
- `loading` — true until the initial `GET /api/auth/me` resolves; use to gate route rendering.
- `login(email, password)` — POSTs credentials, sets user state.
- `signup(username, email, password)` — POSTs registration, sets user state.
- `logout()` — POSTs to clear cookie, sets user to null.

### Token Expiry

JWT is set with `expiresIn: "7d"`. The cookie has no explicit `maxAge` — it is a session cookie that the browser expires on close, but the JWT itself expires after 7 days server-side. If an expired token reaches `authMiddleware`, JWT verification throws and the protected route returns 401. AuthContext does not proactively poll; stale sessions are caught on the next API call.

---

## Notification Service

### Transport

Uses **nodemailer** (not SendGrid). The field `log.sendgridMessageId` stores the nodemailer `info.messageId` — the name is a misnomer from an earlier refactor. Configured via environment variables:

```
SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, EMAIL_FROM_NAME, FRONTEND_URL
```

### Email Types

| Function | Trigger | Template |
|----------|---------|----------|
| `sendRsvpConfirmation(rsvp, event)` | RSVP submitted (invite or public) | `rsvpConfirmation.js` |
| `sendAcceptance(rsvp, event)` | Guest promoted from waitlist to ATTENDING | `acceptance.js` |
| `sendThankYou(rsvp, event)` | Organizer marks event as started/ended | `thankYou.js` |

All three are called **fire-and-forget** (`.catch(err => console.error(...))`) — email failure does not block the API response.

### Email Audit Log

Every send attempt writes an `EmailLog` document:

```
recipient, recipientName, event, type (EMAIL_TYPE), status (PENDING → SENT | FAILED)
sentAt, sendgridMessageId (nodemailer messageId), errorMessage
```

No frontend UI reads the email log; it is for backend observability only.

### Template Colors

All three templates embed hardcoded hex colors (`#0a192f`, `#1978e5`, etc.) as inline HTML styles — required because email clients do not execute CSS classes. These match the design token values but must be maintained manually if the design system changes.

---

## Shared Components

All shared components live in `Frontend/src/Modules/shared/components/`. They are consumed across every module.

### ColorMap

```js
// maps color name → { bg, border, text } Tailwind token classes
ColorMap["green"] // → { bg: "bg-MainGreenBackground", border: "...", text: "..." }
```

Used exclusively by `StatCard`. Extend by adding named entries.

### StatCard / StatBar / StatWrapper / StatPercentage

Composable stat display: `StatCard` renders a colored card with label/value/icon. `StatBar` renders a progress bar (inline `width` style). `StatPercentage` shows a percentage label. `StatWrapper` is a flex container.

Usage (in manageAttendees):
```jsx
<StatCard label="Attending" value={stats.attending} color="green" icon={UserCheck}>
  <StatBar pct={attendPct} color="green" />
</StatCard>
```

### SideNavigationBar

Renders a Fragment with two branches:
- **Mobile** (`md:hidden`): sticky top bar with hamburger; dropdown overlay at `top-[57px]`.
- **Desktop** (`hidden md:flex`): fixed 256px left sidebar with nav items and a profile dropdown.

Both branches share logout logic via `useAuth().logout`.

### SearchBar / LabeledInput

Both accept controlled `value`/`onChange` (SearchBar) or `text`/`setText` (LabeledInput) props. LabeledInput adds an icon slot and focus ring via `focus-within`. Both use `shadow` style with rgba values matching `MainBlue` — not expressible as a Tailwind token without a custom plugin.

### CustomButton

Fully style-controlled via `className` prop. Handles left/right icon position. No built-in size or color — all appearance comes from the caller.

---

## Real-Time (Socket.IO)

### Architecture

```
server.js → initSocket(httpServer)
  io.on("connection", socket)
    socket.on("join:event", eventId)  → socket.join(`event:${eventId}`)
    socket.on("leave:event", eventId) → socket.leave(`event:${eventId}`)

Frontend: useSocket(onCapacityUpdate) [eventManagement/utils/useSocket.js]
  io(SOCKET_URL, { withCredentials: true })
  socket.on("capacity:update", onCapacityUpdate)
  joinEvent(eventId) → emit("join:event", eventId)
  leaveEvent(eventId) → emit("leave:event", eventId)

useMyEvents.js → useSocket(handleCapacityUpdate)
```

### Dead State

`emitCapacityUpdate(eventId, rsvpCount)` is exported from `socket.js` but **never imported by any controller**. No `capacity:update` event is ever emitted. The frontend socket connection is established and rooms are joined, but updates never arrive. The `onCapacityUpdate` callback in `useMyEvents` is wired but never fires.

---

## Dead UI / Known Limitations

| Issue | Detail |
|-------|--------|
| `emitCapacityUpdate` never called | Capacity update socket event is fully wired on frontend but never triggered from backend. Frontend subscribes to `capacity:update` via `useSocket` / `useMyEvents`; no controller ever calls `emitCapacityUpdate`. |
| `secure: false` on JWT cookie | All three auth cookie writes set `secure: false`. Should be `process.env.NODE_ENV === 'production'` for HTTPS deployments. |
| `sendgridMessageId` field name | `EmailLog.sendgridMessageId` stores the nodemailer `messageId` — naming is a misnomer from an earlier refactor. |
| Session cookie has no `maxAge` | JWT cookie expires with the browser session on the client side, but the JWT itself is valid for 7 days. User can be re-authenticated by any tab that holds the cookie. |
| No token refresh | JWT expiry is silent — next API call returns 401. No automatic refresh or warning shown to user. |
| Footer is minimal | `Footer.jsx` renders only a copyright line. All links that would go in a footer (Privacy, Terms, etc.) are absent. |
