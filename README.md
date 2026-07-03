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
- No auth endpoints, permissions, frontend business screens, or flight/accounting modules yet.
