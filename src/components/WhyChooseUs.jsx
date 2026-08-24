import { WHY_US } from '../data/siteData';
import './WhyChooseUs.css';

export default function WhyChooseUs() {
  return (
    <section id="why" className="section why" aria-labelledby="why-h">
      <div className="container">
        <div className="why__inner">
          <div className="why__left reveal">
            <span className="section-label">Why Genwebzy</span>
            <h2 id="why-h" className="why__heading">
              Why clients<br />choose us.
            </h2>
            <p className="why__sub">
              We are a small team. That is a feature, not a limitation.
              You deal directly with the people building your website.
            </p>
            <a href="#contact" className="btn btn--primary" style={{ marginTop: 'var(--s6)' }}>
              Start a Project
              <svg className="btn-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          <div className="why__right">
            {WHY_US.map((item, i) => (
              <div key={item.title} className={`why-item reveal reveal-d${Math.min(i + 1, 3)}`}>
                <div className="why-item__num">{String(i + 1).padStart(2, '0')}</div>
                <div className="why-item__body">
                  <h3 className="why-item__title">{item.title}</h3>
                  <p className="why-item__desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
