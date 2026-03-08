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

### Authentication (Firebase)

Sign in / sign up is done via **Firebase Authentication** (email + password). On sign up, a **name** is required; it is stored as the user’s display name and used in the activity log. The client sends the current user’s name (or email) in the `X-User-Name` header so that `activity_log` records who created, updated, moved or deleted tasks. Configure Firebase in `client/.env` (see `client/.env.example`) and enable the Email/Password sign-in method in the [Firebase Console](https://console.firebase.google.com/).

### Connecting Neon / Vercel Postgres (local backend)

1. In [Vercel](https://vercel.com): open your project → **Storage** → **Create Database** → **Postgres** (Vercel Postgres is powered by Neon).
2. After creation, open the database → **Connect** or **.env** tab and copy the connection string (e.g. `POSTGRES_URL` or `DATABASE_URL`).
3. In the repo, create `server/.env` (see `server/.env.example`) and set:
   ```env
   DATABASE_URL=postgresql://...  # paste the copied URL
   ```
4. Restart the backend. The `tasks` table is created automatically on first run.

### Deploy to Vercel (step by step)

1. **Push the repo to GitHub**  
   If the repo is not on GitHub yet: create a repository, add the remote, and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/calendar-grid.git
   git push -u origin main
   ```

2. **Create a project in Vercel**  
   - Go to [vercel.com](https://vercel.com) and sign in (with GitHub).  
   - **Add New…** → **Project**.  
   - Import the **calendar-grid** repo from GitHub (if it does not appear, configure access under **Configure GitHub App**).  
   - Click **Create** (leave Root Directory empty or `./`).

3. **Database (PostgreSQL)**  
   - In Vercel: **Storage** → **Create Database** → **Postgres** (Vercel Postgres).  
   - After creation, open the database → **Connect** or **.env** tab and copy the connection string (e.g. `POSTGRES_URL` or `DATABASE_URL`).  
   - If the variable is named `POSTGRES_URL`, add it in the project’s Environment Variables (step 5) as **DATABASE_URL** with the same value, because the API expects `DATABASE_URL`.

4. **Firebase (for authentication)**  
   - In [Firebase Console](https://console.firebase.google.com/): your project → **Project settings** → **Your apps** → copy the values from `firebaseConfig`.  
   - Enable **Email/Password** under **Authentication** → **Sign-in method**.

5. **Environment variables in Vercel**  
   - Open the project in Vercel → **Settings** → **Environment Variables**.  
   - Add these (for **Production**; you can add the same for Preview):

   | Name | Value |
   |------|--------|
   | `DATABASE_URL` | `postgresql://...` (connection string from step 3) |
   | `VITE_FIREBASE_API_KEY` | from Firebase Console |
   | `VITE_FIREBASE_AUTH_DOMAIN` | from Firebase Console |
   | `VITE_FIREBASE_PROJECT_ID` | from Firebase Console |
   | `VITE_FIREBASE_STORAGE_BUCKET` | from Firebase Console |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | from Firebase Console |
   | `VITE_FIREBASE_APP_ID` | from Firebase Console |

   Save. After changing env vars, trigger a **Redeploy** (Deployments → three dots next to a deployment → Redeploy).

6. **Build and deploy**  
   - The project already uses `vercel.json`: `buildCommand: npm run build`, `outputDirectory: client/dist`, and a custom `installCommand` for the monorepo.  
   - Click **Deploy** (or a new deployment will run automatically on push to `main`).  
   - If the build fails: check **Settings** → **General** → **Node.js Version** (use **22.x** if possible).

7. **After the first deploy**  
   - Open the deployment URL (e.g. `https://your-project.vercel.app`).  
   - The `tasks` and `activity_log` tables are created on first API request.  
   - In Firebase Console → **Authentication** → **Settings** → **Authorized domains**, add your Vercel domain (e.g. `your-project.vercel.app`) so sign-in works.

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
