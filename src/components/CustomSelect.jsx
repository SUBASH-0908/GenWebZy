import { useState, useRef, useEffect } from 'react';
import './CustomSelect.css';

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * CustomSelect — replaces native <select> with a styled dropdown.
 * Props:
 *   id, placeholder, options (string[]), value, onChange(value)
 */
export default function CustomSelect({ id, placeholder = 'Select…', options = [], value, onChange, dark = false }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const select = (opt) => {
    onChange(opt);
    setOpen(false);
  };

  const displayValue = value || placeholder;

  return (
    <div
      className={`cs-wrap${open ? ' cs-wrap--open' : ''}${dark ? ' cs-wrap--dark' : ''}`}
      ref={wrapRef}
    >
      {/* Trigger button */}
      <button
        type="button"
        id={id}
        className={`cs-trigger${value ? ' cs-trigger--filled' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="cs-trigger__value">{displayValue}</span>
        <span className="cs-trigger__icon">
          <ChevronDown />
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <ul
          className="cs-panel"
          role="listbox"
          aria-label={placeholder}
        >
          {options.map((opt) => {
            const selected = opt === value;
            return (
              <li
                key={opt}
                role="option"
                aria-selected={selected}
                className={`cs-option${selected ? ' cs-option--selected' : ''}`}
                onClick={() => select(opt)}
                onKeyDown={(e) => { if (e.key === 'Enter') select(opt); }}
                tabIndex={0}
              >
                <span className="cs-option__label">{opt}</span>
                {selected && (
                  <span className="cs-option__check">
                    <CheckIcon />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
