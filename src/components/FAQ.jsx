import { useRef, useState } from 'react';
import { FAQ as FAQ_DATA } from '../data/siteData';
import './FAQ.css';

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);

  return (
    <div className={`faq-item${open ? ' faq-item--open' : ''}`}>
      <button
        className="faq-item__q"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        id={`faq-${item.question.replace(/\s+/g, '-')}`}
      >
        {item.question}
        <span className="faq-item__icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      <div
        className="faq-item__body"
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div className="faq-item__body-inner">
          <p className="faq-item__a">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="section section--alt faq" aria-labelledby="faq-h">
      <div className="container">
        <div className="faq__inner">
          <div className="faq__left reveal">
            <span className="section-label">FAQ</span>
            <h2 id="faq-h" className="faq__heading">Common questions.</h2>
            <p className="faq__sub">
              Have something specific in mind?{' '}
              <a href="#contact" className="faq__link">Contact us directly.</a>
            </p>
          </div>
          <div className="faq__list reveal reveal-d2">
            {FAQ_DATA.map(item => (
              <FAQItem key={item.question} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
