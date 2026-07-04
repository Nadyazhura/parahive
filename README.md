# ParaHive

Internal CRM/ERP scaffold for a paragliding club.

## Local PostgreSQL

```bash
docker compose up -d postgres
docker compose ps
```

Connection string for local development:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/parahive?schema=public
```

## Backend

```bash
cd backend
npm install
npm run dev
```

Health endpoint:

```bash
curl http://localhost:4000/health
```

Prisma:

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Set `DATABASE_URL` before running migrate or seed. The seed creates roles,
pilot statuses, pilot ranks, and optionally the first `SYSADMIN` when
`SEED_SYSADMIN_LOGIN`, `SEED_SYSADMIN_EMAIL`, and `SEED_SYSADMIN_PASSWORD`
are set.

Auth endpoints:

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/change-password`

Permissions:

- Role permissions are defined in backend code.
- `GET /auth/me` returns current user permissions.
- Permissions are not stored in database tables during the first stage.

Users/Pilots/Profile API:

- `GET /users` lists managed users for roles with `users:read_all`.
- `POST /users` creates a user with a temporary password and pilot profile.
- `PATCH /users/:id` updates account login/email fields.
- `PATCH /users/:id/role` assigns a role.
- `PATCH /users/:id/block` updates `users.blocked`.
- `POST /users/:id/reset-password` sets a new temporary password and revokes active refresh sessions.
- `GET /pilots` lists pilots with public or extended fields depending on permissions.
- `GET /pilots/:id` returns a public pilot card, or a full profile when the requester has access.
- `PATCH /pilots/:id/profile` updates another pilot profile. `FLIGHTMANAGER` is limited to flight/training fields: `statusCode`/`pilotStatusCode`, `rankCode`, `parapro`, and `serviceNotes`.
- `GET /profile/me` returns the current user's profile.
- `PATCH /profile/me` updates the current user's allowed personal profile fields.

Required auth env:

- `ACCESS_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRES_IN`
- `REFRESH_TOKEN_EXPIRES_DAYS`
- `LOGIN_MAX_FAILED_ATTEMPTS`
- `LOGIN_LOCK_MINUTES`

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite opens the app at `http://localhost:5173`.

Frontend foundation:

- `AuthProvider` stores tokens, loads `/auth/me`, and exposes login/logout/session helpers.
- `ProtectedRoute` guards authenticated sections and route permissions.
- Hash routing maps first-stage sections to placeholder views.
- `AppLayout` provides sidebar/topbar navigation and mobile menu behavior.
- Navigation items are filtered by backend-provided permissions.
- `apiClient` centralizes auth, pilots, profile, and users API calls.

## Current Scope

- Backend: Node.js, Express, `/health`, base `src` layout, `.env.example`, Prisma dependency and placeholder client.
- Frontend: React, Vite, Tailwind CSS, shadcn/ui preparation, Radix Slot, lucide-react, app layout, auth state foundation, protected route foundation, API client foundation, and permission-driven navigation.
- Prisma schema and seed for `users`, `roles`, `pilot_profiles`, `pilot_statuses`, `pilot_ranks`, and `auth_sessions`.
- Backend auth endpoints for login, refresh, logout, current user, and password change.
- Backend permission map and `requirePermission` middleware.
- Backend users, pilots, and profile API for the first stage.
- No finished frontend business screens or flight/accounting modules yet.
