import { FAQ } from '../data/siteData';
import { useState, useRef, useEffect } from 'react';
import './FAQ.css';

/* ─── Chevron moved to CSS, no inline style needed ─── */
const ChevronIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    className="faq-chevron"
  >
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── Individual animated item ─── */
function FAQItem({ item, index, isOpen, onToggle }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!bodyRef.current) return;
    // Measure the exact content height and animate to it
    setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
  }, [isOpen]);

  return (
    <div className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
      <button
        className="faq-item__question"
        onClick={onToggle}
        aria-expanded={isOpen}
        id={`faq-btn-${index}`}
        aria-controls={`faq-answer-${index}`}
      >
        <span>{item.question}</span>
        <span className="faq-item__icon">
          <ChevronIcon />
        </span>
      </button>

      {/* Height is driven by exact scrollHeight — perfectly smooth */}
      <div
        ref={bodyRef}
        className="faq-item__answer"
        style={{ height: `${height}px` }}
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-btn-${index}`}
      >
        <p className="faq-item__answer-text">{item.answer}</p>
      </div>
    </div>
  );
}

/* ─── Section ─── */
export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (i) => setOpenIdx((prev) => (prev === i ? null : i));

  return (
    <section id="faq" className="section faq" aria-labelledby="faq-heading">
      <div className="container">
        <div className="faq__inner">
          <div className="faq__left reveal">
            <span className="label">FAQ</span>
            <h2
              id="faq-heading"
              className="section-heading"
              style={{ marginTop: '1rem' }}
            >
              Frequently asked questions.
            </h2>
            <p className="section-subtitle" style={{ marginTop: '1rem' }}>
              Can't find what you're looking for?{' '}
              <a href="#contact" className="faq__contact-link">
                Send us a message.
              </a>
            </p>
          </div>

          <div className="faq__list">
            {FAQ.map((item, i) => (
              <FAQItem
                key={i}
                item={item}
                index={i}
                isOpen={openIdx === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
