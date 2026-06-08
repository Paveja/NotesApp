/**
 * server.js - Express application entry point
 * Sets up middleware, routes, and starts the HTTP server.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const notesRoutes = require('./routes/notesRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────

// CORS: allow requests from the Vite dev server (and same origin in production)
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite default
    'http://localhost:3000', // Alternative dev port
    'http://127.0.0.1:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Parse incoming JSON bodies
app.use(express.json());

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Request logger (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Notes API
app.use('/api/notes', notesRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ success: false, error: 'An unexpected error occurred.' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Notes API running on http://localhost:${PORT}`);
  console.log(`📁  Database path: ${process.env.DB_PATH || './database/notes.db'}`);
  console.log(`🌍  Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; // Export for testing
