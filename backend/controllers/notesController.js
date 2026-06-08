/**
 * notesController.js - Business logic layer
 * Receives validated requests from routes, calls the model, and sends responses.
 */

const model = require('../models/notesModel');

/**
 * GET /api/notes
 * Returns all notes, or filtered results if ?q= query param is present.
 */
async function getNotes(req, res) {
  try {
    const { q } = req.query;
    const notes = q ? model.searchNotes(q) : model.getAllNotes();
    res.json({ success: true, data: notes, count: notes.length });
  } catch (err) {
    console.error('[getNotes]', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve notes.' });
  }
}

/**
 * GET /api/notes/:id
 * Returns a single note by ID.
 */
async function getNoteById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid note ID.' });

    const note = model.getNoteById(id);
    if (!note) return res.status(404).json({ success: false, error: 'Note not found.' });

    res.json({ success: true, data: note });
  } catch (err) {
    console.error('[getNoteById]', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve note.' });
  }
}

/**
 * POST /api/notes
 * Creates a new note. Expects { title, content } in request body.
 */
async function createNote(req, res) {
  try {
    const { title, content } = req.body;

    // Validation
    const errors = [];
    if (!title || title.trim().length === 0) errors.push('Title is required.');
    if (!content || content.trim().length === 0) errors.push('Content is required.');
    if (title && title.trim().length > 200) errors.push('Title must be 200 characters or fewer.');

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const note = model.createNote(title.trim(), content.trim());
    res.status(201).json({ success: true, data: note, message: 'Note created successfully.' });
  } catch (err) {
    console.error('[createNote]', err);
    res.status(500).json({ success: false, error: 'Failed to create note.' });
  }
}

/**
 * PUT /api/notes/:id
 * Updates an existing note. Expects { title, content } in request body.
 */
async function updateNote(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid note ID.' });

    const { title, content } = req.body;

    // Validation
    const errors = [];
    if (!title || title.trim().length === 0) errors.push('Title is required.');
    if (!content || content.trim().length === 0) errors.push('Content is required.');
    if (title && title.trim().length > 200) errors.push('Title must be 200 characters or fewer.');

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const updated = model.updateNote(id, title.trim(), content.trim());
    if (!updated) return res.status(404).json({ success: false, error: 'Note not found.' });

    res.json({ success: true, data: updated, message: 'Note updated successfully.' });
  } catch (err) {
    console.error('[updateNote]', err);
    res.status(500).json({ success: false, error: 'Failed to update note.' });
  }
}

/**
 * DELETE /api/notes/:id
 * Deletes a note by ID.
 */
async function deleteNote(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid note ID.' });

    const deleted = model.deleteNote(id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Note not found.' });

    res.json({ success: true, message: 'Note deleted successfully.' });
  } catch (err) {
    console.error('[deleteNote]', err);
    res.status(500).json({ success: false, error: 'Failed to delete note.' });
  }
}

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote };
