# ParaHive

Internal CRM/ERP scaffold for a paragliding club.

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

## Current Scope

- Backend: Node.js, Express, `/health`, base `src` layout, `.env.example`, Prisma dependency and placeholder client.
- Frontend: React, Vite, Tailwind CSS, shadcn/ui preparation, Radix Slot, lucide-react, placeholder ParaHive page.
- Prisma schema and seed for `users`, `roles`, `pilot_profiles`, `pilot_statuses`, `pilot_ranks`, and `auth_sessions`.
- Backend auth endpoints for login, refresh, logout, current user, and password change.
- No permissions map, users/pilots API, frontend business screens, or flight/accounting modules yet.
