import { WHY_US } from '../data/siteData';
import './WhyChooseUs.css';

const icons = {
  'Direct Communication': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Custom Approach': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.07 4.93A10 10 0 004.93 19.07M12 2v2M12 20v2M2 12h2M20 12h2" strokeLinecap="round"/>
    </svg>
  ),
  'Responsive Design': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round"/>
      <path d="M8 21h8M12 17v4" strokeLinecap="round"/>
    </svg>
  ),
  'Transparent Pricing': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Practical Solutions': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <polyline points="9 11 12 14 22 4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Post-Launch Support': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M18.364 5.636A9 9 0 115.636 18.364" strokeLinecap="round"/>
      <polyline points="15 5 18.364 5.636 19 9" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export default function WhyChooseUs() {
  return (
    <section id="why" className="section why" aria-labelledby="why-heading">
      <div className="container">
        <div className="why__header reveal">
          <div>
            <span className="label">Why Work With Us?</span>
            <h2 id="why-heading" className="section-heading" style={{ marginTop: '1rem' }}>
              What we actually bring to every project.
            </h2>
          </div>
          <a href="#contact" className="btn btn--outline why__cta">
            Start a Conversation
          </a>
        </div>

        <div className="why__grid">
          {WHY_US.map((item, i) => (
            <div key={item.title} className="why-item reveal" style={{ '--delay': i * 0.08 + 's' }}>
              <div className="why-item__icon">
                {icons[item.title] || null}
              </div>
              <h3 className="why-item__title">{item.title}</h3>
              <p className="why-item__desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
