# Notes App — Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│   React (Vite) · port 5173                                  │
│                                                             │
│   App.jsx (state management)                                │
│     ├─ SearchBar.jsx     ─ debounced query input            │
│     ├─ NoteList.jsx      ─ grid / loading / empty states    │
│     │   └─ NoteCard.jsx  ─ single note display              │
│     └─ NoteEditor.jsx    ─ create / edit modal              │
│                                                             │
│   services/notesApi.js   ─ Axios HTTP client                │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON (proxied via Vite)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Node.js + Express   · port 5000               │
│                                                             │
│   server.js   ─ middleware, CORS, route mounting            │
│   routes/     ─ URL → controller mapping                    │
│   controllers/─ request parsing, validation, responses      │
│   models/     ─ SQL query functions (data access layer)     │
│   config/db.js─ singleton SQLite connection + schema init   │
└──────────────────────────────┬──────────────────────────────┘
                               │ better-sqlite3 (sync driver)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  SQLite   (notes.db)                        │
│                                                             │
│  notes table:  id | title | content | created_at            │
│                                       | updated_at          │
└─────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

| Layer         | File(s)                    | Responsibility                              |
|---------------|----------------------------|---------------------------------------------|
| View          | `*.jsx` components         | UI rendering, user events                   |
| Service       | `services/notesApi.js`     | HTTP calls, error normalisation             |
| API Routes    | `routes/notesRoutes.js`    | URL matching, HTTP verb mapping             |
| Controller    | `controllers/notesController.js` | Validation, business logic, responses |
| Model         | `models/notesModel.js`     | SQL queries, DB interaction                 |
| Config        | `config/db.js`             | Connection, schema initialisation           |

## Design Decisions

**better-sqlite3 (sync) vs sqlite3 (async)**  
Synchronous SQLite is simpler for a single-user notes app: no callback hell, no connection pooling complexity. The synchronous model means Express handles one request at a time per thread, but for a local/personal tool this is irrelevant.

**Singleton DB connection**  
A single connection with WAL journal mode gives better concurrent read performance than opening/closing connections per request.

**Vite proxy**  
During development, Vite forwards `/api/*` to `http://localhost:5000`. This eliminates CORS headers in development while keeping the frontend and backend clearly separated.

**Component state in App.jsx**  
All note state lives in the root `App` component. This keeps data flow unidirectional and avoids context/Redux complexity for an application of this scope.
