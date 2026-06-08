/**
 * NoteCard.jsx - Displays a single note in the list view.
 * Shows title, truncated content, timestamp, and action buttons.
 */

/**
 * @param {Object}   props
 * @param {Object}   props.note        - Note object from the API
 * @param {Function} props.onEdit      - Called when Edit is clicked
 * @param {Function} props.onDelete    - Called when Delete is clicked
 */
export default function NoteCard({ note, onEdit, onDelete }) {
  // Format the date in a human-readable way
  const formattedDate = new Date(note.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = new Date(note.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Truncate long content for the card preview
  const previewContent =
    note.content.length > 150 ? note.content.slice(0, 150) + '…' : note.content;

  function handleDeleteClick() {
    if (window.confirm(`Delete "${note.title}"? This cannot be undone.`)) {
      onDelete(note.id);
    }
  }

  return (
    <article className="note-card">
      <div className="note-card__header">
        <h3 className="note-card__title">{note.title}</h3>
        <div className="note-card__actions">
          <button
            className="btn btn--icon btn--edit"
            onClick={() => onEdit(note)}
            aria-label={`Edit note: ${note.title}`}
            title="Edit note"
          >
            ✏️
          </button>
          <button
            className="btn btn--icon btn--delete"
            onClick={handleDeleteClick}
            aria-label={`Delete note: ${note.title}`}
            title="Delete note"
          >
            🗑️
          </button>
        </div>
      </div>

      <p className="note-card__content">{previewContent}</p>

      <footer className="note-card__footer">
        <span className="note-card__date" title={`${formattedDate} at ${formattedTime}`}>
          📅 {formattedDate}
        </span>
        {note.updated_at && note.updated_at !== note.created_at && (
          <span className="note-card__updated">edited</span>
        )}
      </footer>
    </article>
  );
}
