# Notes App — Setup Guide

## Prerequisites

| Tool    | Version | Check command  |
|---------|---------|----------------|
| Node.js | ≥ 18.x  | `node -v`      |
| npm     | ≥ 9.x   | `npm -v`       |

---

## Quick Start (2 terminals)

### 1 — Backend

```bash
cd notes-app/backend
npm install
npm run dev          # starts on http://localhost:5000
```

On first start the SQLite database is created automatically at `backend/database/notes.db`.

**Optional: seed sample data**
```bash
npm run seed         # inserts 6 sample notes
```

### 2 — Frontend

```bash
cd notes-app/frontend
npm install
npm run dev          # starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## Environment Variables

### Backend (`backend/.env`)
| Variable   | Default               | Description            |
|------------|-----------------------|------------------------|
| `PORT`     | `5000`                | Express server port    |
| `DB_PATH`  | `./database/notes.db` | SQLite file path       |
| `NODE_ENV` | `development`         | Controls request logs  |

### Frontend (`frontend/.env`)
| Variable            | Default                 | Description       |
|---------------------|-------------------------|-------------------|
| `VITE_API_BASE_URL` | `http://localhost:5000`  | Backend base URL  |

---

## Running Tests

```bash
cd backend
npm test             # Jest + Supertest suite
```

---

## Production Build

```bash
# Build the frontend
cd frontend
npm run build        # outputs to frontend/dist/

# Serve frontend dist with any static server, e.g.:
npx serve dist
```

---

## Verify SQLite Data

### Option A — SQLite CLI
```bash
sqlite3 backend/database/notes.db
sqlite> SELECT * FROM notes;
sqlite> .quit
```

### Option B — DB Browser for SQLite
Download from https://sqlitebrowser.org/ and open `backend/database/notes.db`.

### Option C — API
```bash
curl http://localhost:5000/api/notes | python3 -m json.tool
```

---

## Troubleshooting

| Problem                         | Fix                                                     |
|---------------------------------|---------------------------------------------------------|
| `EADDRINUSE` on port 5000/5173  | Kill the other process or change PORT in `.env`         |
| `Cannot find module better-sqlite3` | Run `npm install` inside the `backend/` folder    |
| CORS errors in browser          | Ensure backend is running on port 5000                  |
| Notes not saving                | Check browser console and backend terminal for errors   |
