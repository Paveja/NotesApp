# 📓 Notes App

A full-stack notes application built with **React + Vite** (frontend) and **Node.js + Express + SQLite** (backend).

## Features

- ✅ Create, edit, and delete notes
- 🔍 Real-time search by title or content
- 💾 Persistent SQLite storage
- ✨ Responsive, polished UI
- 🛡️ Form validation & error handling

## Quick Start

**Terminal 1 — Backend**
```bash
cd backend && npm install && npm run dev
```

**Terminal 2 — Frontend**
```bash
cd frontend && npm install && npm run dev
```

Then open **http://localhost:5173**

## Project Structure

```
notes-app/
├── frontend/          React + Vite SPA
│   └── src/
│       ├── components/   NoteList, NoteCard, NoteEditor, SearchBar
│       └── services/     notesApi.js (Axios client)
├── backend/           Express REST API
│   ├── config/        db.js (SQLite connection)
│   ├── models/        notesModel.js (SQL queries)
│   ├── controllers/   notesController.js (business logic)
│   ├── routes/        notesRoutes.js
│   └── database/      notes.db + init.sql + seed.js
└── docs/              Architecture, API docs, Setup guide
```

## API Endpoints

| Method | Path             | Description        |
|--------|------------------|--------------------|
| GET    | /api/notes       | Get all notes      |
| GET    | /api/notes?q=foo | Search notes       |
| GET    | /api/notes/:id   | Get single note    |
| POST   | /api/notes       | Create note        |
| PUT    | /api/notes/:id   | Update note        |
| DELETE | /api/notes/:id   | Delete note        |

See [docs/api-documentation.md](docs/api-documentation.md) for full details.

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, Vite 5, Axios           |
| Backend  | Node.js, Express 4                |
| Database | SQLite via better-sqlite3         |
| Styling  | Plain CSS with CSS custom props   |
| Testing  | Jest + Supertest                  |

## Running Tests

```bash
cd backend && npm test
```
