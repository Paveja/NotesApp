/**
 * SearchBar.jsx - Real-time search input with debounce
 */

import { useState, useEffect, useRef } from 'react';

/**
 * @param {Object}   props
 * @param {Function} props.onSearch   - Called with the trimmed query string
 * @param {boolean}  props.disabled   - Disable input while loading
 */
export default function SearchBar({ onSearch, disabled }) {
  const [query, setQuery] = useState('');
  const debounceTimer = useRef(null);

  // Debounce the search call by 300 ms so we don't hammer the API on every keystroke
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onSearch(query.trim());
    }, 300);

    return () => clearTimeout(debounceTimer.current);
  }, [query, onSearch]);

  function handleClear() {
    setQuery('');
    onSearch('');
  }

  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search notes by title or content…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={disabled}
        aria-label="Search notes"
      />
      {query && (
        <button
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
