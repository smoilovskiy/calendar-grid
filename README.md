# Calendar Grid

Calendar with task management. Test assignment.

## Tech Stack

- **Frontend:** React 19 + Vite 7 + TypeScript + Emotion (CSS-in-JS)
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (Vercel Postgres / Neon)

## Requirements

- Node.js **22.x** (or 20.19+)

```bash
node -v   # check version
nvm use 22   # if using nvm
```

## Installation

```bash
npm install
```

## Development

```bash
# Frontend + Backend concurrently
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

For task persistence, set `DATABASE_URL` (PostgreSQL). If unset, the app runs but tasks are not saved (API returns 503).

### Connecting Neon / Vercel Postgres (local backend)

1. In [Vercel](https://vercel.com): open your project → **Storage** → **Create Database** → **Postgres** (Vercel Postgres is powered by Neon).
2. After creation, open the database → **Connect** or **.env** tab and copy the connection string (e.g. `POSTGRES_URL` or `DATABASE_URL`).
3. In the repo, create `server/.env` (see `server/.env.example`) and set:
   ```env
   DATABASE_URL=postgresql://...  # paste the copied URL
   ```
4. Restart the backend. The `tasks` table is created automatically on first run.

## Scripts

```bash
npm run dev:client   # frontend only
npm run dev:server   # backend only
npm run build        # build both
```

## Country and week start

- **Country** (for holidays and week start): Initially from the browser locale (`navigator.language`, e.g. `en-US` → US). You can change it via the country dropdown; it controls which public holidays are shown ([Nager.Date API](https://date.nager.at/swagger/index.html)) and whether the week starts on Sunday or Monday.
- **Week start** (Sunday vs Monday): Derived from the selected country via a hardcoded mapping (no API provides this). Sunday: e.g. US, CA, UK, Brazil, Japan, Korea, Israel, Australia; Monday: e.g. most of Europe (PL, UA, DE, FR), Russia, China.

## Project Structure

```
calendar-grid/
├── client/     # React + Vite
├── server/     # Express API
└── package.json
```
