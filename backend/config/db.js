/**
 * db.js - Database configuration and connection setup
 * Uses better-sqlite3 for synchronous SQLite operations
 */

const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

// Resolve the database file path from environment variable
const DB_PATH = path.resolve(__dirname, '..', process.env.DB_PATH || './database/notes.db');

let db;

/**
 * getDb - Returns a singleton database connection.
 * Creates the connection on first call, reuses it thereafter.
 */
function getDb() {
  if (!db) {
    db = new Database(DB_PATH, {
      // Verbose logging in development
      verbose: process.env.NODE_ENV === 'development' ? console.log : null,
    });

    // Enable WAL mode for better concurrent read performance
    db.pragma('journal_mode = WAL');

    // Initialize schema on first connection
    initSchema();
  }
  return db;
}

/**
 * initSchema - Creates the notes table if it doesn't exist.
 */
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      title     TEXT    NOT NULL,
      content   TEXT    NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Trigger to auto-update updated_at on every UPDATE
    CREATE TRIGGER IF NOT EXISTS notes_updated_at
    AFTER UPDATE ON notes
    FOR EACH ROW
    BEGIN
      UPDATE notes SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
  `);
}

module.exports = { getDb };
