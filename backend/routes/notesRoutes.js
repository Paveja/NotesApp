/**
 * notesRoutes.js - Express router for /api/notes
 * Maps HTTP verbs + paths to controller functions.
 */

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notesController');

// GET    /api/notes         → list all (or search with ?q=)
router.get('/', ctrl.getNotes);

// GET    /api/notes/:id     → single note
router.get('/:id', ctrl.getNoteById);

// POST   /api/notes         → create note
router.post('/', ctrl.createNote);

// PUT    /api/notes/:id     → update note
router.put('/:id', ctrl.updateNote);

// DELETE /api/notes/:id     → delete note
router.delete('/:id', ctrl.deleteNote);

module.exports = router;
