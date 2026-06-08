/**
 * notesApi.js - Axios API client for the Notes backend
 * All network calls are centralised here so components stay clean.
 */

import axios from 'axios';

// Base URL uses Vite proxy (/api → http://localhost:5000) in dev.
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10-second timeout
});

// ─── Response interceptor ─────────────────────────────────────────────────────
// Normalise errors so callers always get a consistent shape.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.errors?.join(', ') ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ─── Notes API methods ────────────────────────────────────────────────────────

/**
 * fetchNotes - Get all notes, optionally filtered by a search query.
 * @param {string} [query] - Optional search term
 * @returns {Promise<Array>} Array of note objects
 */
export async function fetchNotes(query = '') {
  const params = query ? { q: query } : {};
  const { data } = await api.get('/notes', { params });
  return data.data;
}

/**
 * fetchNoteById - Get a single note by ID.
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function fetchNoteById(id) {
  const { data } = await api.get(`/notes/${id}`);
  return data.data;
}

/**
 * createNote - Create a new note.
 * @param {{ title: string, content: string }} noteData
 * @returns {Promise<Object>} Created note
 */
export async function createNote(noteData) {
  const { data } = await api.post('/notes', noteData);
  return data.data;
}

/**
 * updateNote - Update an existing note.
 * @param {number} id
 * @param {{ title: string, content: string }} noteData
 * @returns {Promise<Object>} Updated note
 */
export async function updateNote(id, noteData) {
  const { data } = await api.put(`/notes/${id}`, noteData);
  return data.data;
}

/**
 * deleteNote - Delete a note by ID.
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteNote(id) {
  await api.delete(`/notes/${id}`);
}
