/**
 * NoteList.jsx - Renders the grid of NoteCard components.
 * Handles loading, empty, and error states.
 */

import NoteCard from './NoteCard';

/**
 * @param {Object}   props
 * @param {Array}    props.notes      - Array of note objects
 * @param {boolean}  props.loading    - Show skeleton loading state
 * @param {string}   props.error      - Error message to display
 * @param {string}   props.searchQuery - Current search term for empty-state message
 * @param {Function} props.onEdit     - Forwarded to NoteCard
 * @param {Function} props.onDelete   - Forwarded to NoteCard
 */
export default function NoteList({ notes, loading, error, searchQuery, onEdit, onDelete }) {
  // Loading skeletons
  if (loading) {
    return (
      <div className="note-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="note-card note-card--skeleton">
            <div className="skeleton skeleton--title" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line skeleton--short" />
            <div className="skeleton skeleton--date" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="state-message state-message--error">
        <span className="state-message__icon">⚠️</span>
        <p className="state-message__text">{error}</p>
        <p className="state-message__hint">Make sure the backend server is running on port 5000.</p>
      </div>
    );
  }

  // Empty state
  if (notes.length === 0) {
    return (
      <div className="state-message">
        <span className="state-message__icon">{searchQuery ? '🔍' : '📭'}</span>
        <p className="state-message__text">
          {searchQuery ? `No notes found for "${searchQuery}"` : 'No notes yet'}
        </p>
        <p className="state-message__hint">
          {searchQuery ? 'Try a different search term.' : 'Click the + button to create your first note!'}
        </p>
      </div>
    );
  }

  // Populated grid
  return (
    <div className="note-grid">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
