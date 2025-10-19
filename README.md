# LinePilot — Starter Repo (Frontend + Backend)

This is a clean starter for your new Notion + n8n + Twilio stack.

- **Frontend**: React + Vite + Tailwind (black, modern), animated Login/Signup, dashboard.
- **Backend**: Express + JWT auth (mock users in memory), metrics endpoint to power dashboard.

## Quick start (no Docker)

### Backend
```bash
cd backend
cp .env.example .env
npm i
npm run dev
# serves on http://localhost:8080
```

### Frontend
```bash
cd ../frontend
npm i
# Proxy frontend API calls to backend by starting backend first
npm run dev
# http://localhost:5173
```

## How auth works
- Signup or login on the frontend; backend returns a JWT stored in localStorage `lp_jwt`.
- Subsequent API calls include `Authorization: Bearer <token>`.
- Replace the in-memory auth with your real user store when ready.

## Wiring to n8n/Twilio/Notion later
- Replace `/api/dashboard/summary` with your n8n endpoint (or have backend call n8n).
- Add routes that read from Notion (Leads & Calls) for the Recent Activity pane.
- Add .env secrets and never commit real tokens.

## Brand & Logo
- Brand name: **LinePilot** (placeholder).
- Logo lives in `frontend/src/logo.json` and is drawn by `Logo.tsx`.
- Swap JSON values to change the shape or brand color.

## Docker (optional)
Create your own docker-compose to run both services + reverse proxy if desired.
