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

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite opens the app at `http://localhost:5173`.

## Step 1 Scope

- Backend: Node.js, Express, `/health`, base `src` layout, `.env.example`, Prisma dependency and placeholder client.
- Frontend: React, Vite, Tailwind CSS, shadcn/ui preparation, Radix Slot, lucide-react, placeholder ParaHive page.
- No auth, permissions, Prisma schema, migrations, seeds, or business logic yet.
