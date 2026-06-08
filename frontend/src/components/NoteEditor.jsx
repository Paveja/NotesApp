/**
 * NoteEditor.jsx - Modal form for creating and editing notes.
 * Handles its own local form state and validation.
 */

import { useState, useEffect, useRef } from 'react';

const MAX_TITLE_LENGTH = 200;

/**
 * @param {Object}        props
 * @param {Object|null}   props.note       - Note to edit, or null to create new
 * @param {boolean}       props.isOpen     - Controls visibility
 * @param {Function}      props.onSave     - Called with { title, content } on submit
 * @param {Function}      props.onClose    - Called when the modal should close
 * @param {boolean}       props.isSaving   - Disables form while saving
 */
export default function NoteEditor({ note, isOpen, onSave, onClose, isSaving }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  // Populate form fields when editing an existing note
  useEffect(() => {
    if (isOpen) {
      setTitle(note ? note.title : '');
      setContent(note ? note.content : '');
      setErrors({});
      // Auto-focus the title field when modal opens
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [isOpen, note]);

  // Close modal on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen && !isSaving) onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  function validate() {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    else if (title.trim().length > MAX_TITLE_LENGTH)
      newErrors.title = `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`;
    if (!content.trim()) newErrors.content = 'Content is required.';
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave({ title: title.trim(), content: content.trim() });
  }

  if (!isOpen) return null;

  const isEditing = Boolean(note);

  return (
    // Backdrop – click outside to close
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && !isSaving && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="editor-title"
    >
      <div className="modal">
        <header className="modal__header">
          <h2 id="editor-title" className="modal__heading">
            {isEditing ? '✏️ Edit Note' : '📝 New Note'}
          </h2>
          <button
            className="modal__close"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close editor"
          >
            ✕
          </button>
        </header>

        <form className="modal__form" onSubmit={handleSubmit} noValidate>
          {/* Title field */}
          <div className="form-group">
            <label htmlFor="note-title" className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              id="note-title"
              ref={titleRef}
              type="text"
              className={`form-input ${errors.title ? 'form-input--error' : ''}`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder="Give your note a title…"
              maxLength={MAX_TITLE_LENGTH + 1} // Soft cap; validation handles the rest
              disabled={isSaving}
            />
            <div className="form-meta">
              {errors.title && <span className="form-error">{errors.title}</span>}
              <span className="form-counter">
                {title.length}/{MAX_TITLE_LENGTH}
              </span>
            </div>
          </div>

          {/* Content field */}
          <div className="form-group">
            <label htmlFor="note-content" className="form-label">
              Content <span className="required">*</span>
            </label>
            <textarea
              id="note-content"
              className={`form-textarea ${errors.content ? 'form-input--error' : ''}`}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) setErrors((prev) => ({ ...prev, content: '' }));
              }}
              placeholder="Write your note here…"
              rows={8}
              disabled={isSaving}
            />
            {errors.content && <span className="form-error">{errors.content}</span>}
          </div>

          {/* Actions */}
          <div className="modal__actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={isSaving}>
              {isSaving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
