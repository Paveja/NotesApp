/**
 * App.jsx - Root component
 * Manages global state: notes list, search query, editor modal visibility.
 */

import { useState, useEffect, useCallback } from 'react';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import SearchBar from './components/SearchBar';
import { fetchNotes, createNote, updateNote, deleteNote } from './services/notesApi';
import './App.css';

export default function App() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Editor modal state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // null = create mode
  const [isSaving, setIsSaving] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null); // { message, type }

  // ── Helpers ────────────────────────────────────────────────────────────────

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Data Fetching ──────────────────────────────────────────────────────────

  const loadNotes = useCallback(async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchNotes(query);
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Reload when search query changes
  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      loadNotes(query);
    },
    [loadNotes]
  );

  // ── CRUD Handlers ──────────────────────────────────────────────────────────

  function openCreateEditor() {
    setEditingNote(null);
    setEditorOpen(true);
  }

  function openEditEditor(note) {
    setEditingNote(note);
    setEditorOpen(true);
  }

  function closeEditor() {
    setEditorOpen(false);
    setEditingNote(null);
  }

  async function handleSave(formData) {
    setIsSaving(true);
    try {
      if (editingNote) {
        // Update existing note
        const updated = await updateNote(editingNote.id, formData);
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        showToast('Note updated successfully!');
      } else {
        // Create new note
        const created = await createNote(formData);
        setNotes((prev) => [created, ...prev]);
        showToast('Note created successfully!');
      }
      closeEditor();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      showToast('Note deleted.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <span className="app-header__logo">📓</span>
            <h1 className="app-header__title">Notes</h1>
          </div>
          <span className="app-header__count">
            {loading ? '…' : `${notes.length} note${notes.length !== 1 ? 's' : ''}`}
          </span>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="app-main">
        {/* Toolbar: search + new note button */}
        <div className="toolbar">
          <SearchBar onSearch={handleSearch} disabled={loading} />
          <button
            className="btn btn--primary btn--new"
            onClick={openCreateEditor}
            aria-label="Create new note"
            title="New note"
          >
            <span className="btn__icon">+</span>
            <span className="btn__label">New Note</span>
          </button>
        </div>

        {/* Notes grid / loading / error / empty states */}
        <NoteList
          notes={notes}
          loading={loading}
          error={error}
          searchQuery={searchQuery}
          onEdit={openEditEditor}
          onDelete={handleDelete}
        />
      </main>

      {/* ── Note Editor Modal ── */}
      <NoteEditor
        note={editingNote}
        isOpen={editorOpen}
        onSave={handleSave}
        onClose={closeEditor}
        isSaving={isSaving}
      />

      {/* ── Toast Notification ── */}
      {toast && (
        <div className={`toast toast--${toast.type}`} role="alert" aria-live="polite">
          {toast.type === 'error' ? '❌' : '✅'} {toast.message}
        </div>
      )}
    </div>
  );
}
