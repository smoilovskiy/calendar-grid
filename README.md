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

## Scripts

```bash
npm run dev:client   # frontend only
npm run dev:server   # backend only
npm run build        # build both
```

## Project Structure

```
calendar-grid/
├── client/     # React + Vite
├── server/     # Express API
└── package.json
```
