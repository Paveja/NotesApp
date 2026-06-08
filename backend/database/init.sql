-- init.sql
-- Schema definition for the Notes application.
-- This file is for documentation/reference; actual init happens in config/db.js.

CREATE TABLE IF NOT EXISTS notes (
  id         INTEGER  PRIMARY KEY AUTOINCREMENT,
  title      TEXT     NOT NULL,
  content    TEXT     NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Auto-update updated_at whenever a note row is modified
CREATE TRIGGER IF NOT EXISTS notes_updated_at
AFTER UPDATE ON notes
FOR EACH ROW
BEGIN
  UPDATE notes SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
