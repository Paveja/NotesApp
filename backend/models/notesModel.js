/**
 * notesModel.js - Data Access Layer for Notes
 * All raw SQL queries live here; controllers call these functions.
 */

const { getDb } = require('../config/db');

/**
 * getAllNotes - Fetch every note ordered by newest first.
 * @returns {Array} Array of note objects
 */
function getAllNotes() {
  const db = getDb();
  return db.prepare('SELECT * FROM notes ORDER BY created_at DESC').all();
}

/**
 * getNoteById - Fetch a single note by its primary key.
 * @param {number} id - Note ID
 * @returns {Object|undefined} Note object or undefined if not found
 */
function getNoteById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM notes WHERE id = ?').get(id);
}

/**
 * searchNotes - Full-text search on title and content (case-insensitive).
 * @param {string} query - Search term
 * @returns {Array} Matching notes ordered by newest first
 */
function searchNotes(query) {
  const db = getDb();
  const term = `%${query}%`;
  return db
    .prepare(
      'SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY created_at DESC'
    )
    .all(term, term);
}

/**
 * createNote - Insert a new note row.
 * @param {string} title
 * @param {string} content
 * @returns {Object} The newly created note
 */
function createNote(title, content) {
  const db = getDb();
  const stmt = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
  const info = stmt.run(title, content);
  return getNoteById(info.lastInsertRowid);
}

/**
 * updateNote - Update title and content of an existing note.
 * @param {number} id
 * @param {string} title
 * @param {string} content
 * @returns {Object|null} Updated note or null if not found
 */
function updateNote(id, title, content) {
  const db = getDb();
  const stmt = db.prepare('UPDATE notes SET title = ?, content = ? WHERE id = ?');
  const info = stmt.run(title, content, id);
  if (info.changes === 0) return null; // No row matched the id
  return getNoteById(id);
}

/**
 * deleteNote - Delete a note by id.
 * @param {number} id
 * @returns {boolean} true if a row was deleted, false otherwise
 */
function deleteNote(id) {
  const db = getDb();
  const info = db.prepare('DELETE FROM notes WHERE id = ?').run(id);
  return info.changes > 0;
}

module.exports = { getAllNotes, getNoteById, searchNotes, createNote, updateNote, deleteNote };
