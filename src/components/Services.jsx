import { useState } from 'react';
import { SERVICES } from '../data/siteData';
import './Services.css';

export default function Services() {
  const [active, setActive] = useState(null);

  return (
    <section id="services" className="section services" aria-labelledby="services-h">
      <div className="container">
        <div className="services__head reveal">
          <span className="section-label">What We Do</span>
          <h2 id="services-h" className="services__heading">
            From the first design to<br />the final deployment.
          </h2>
        </div>

        <div className="services__list reveal reveal-d1">
          {SERVICES.map((s, i) => (
            <div
              key={s.id}
              className={`svc-row${active === i ? ' svc-row--active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="svc-num">{s.id}</span>
              <div className="svc-body">
                <h3 className="svc-title">{s.title}</h3>
                <div className="svc-expand">
                  <div className="svc-expand__inner">
                    <p className="svc-desc">{s.description}</p>
                    {s.extras && (
                      <div className="svc-tags">
                        {s.extras.map(e => <span key={e} className="svc-tag">{e}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <a href="#contact" className="svc-cta">
                Get a Quote
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          ))}
        </div>

        <div className="services__also reveal">
          <strong>Also available:</strong>
          &ensp;Domain &amp; hosting · WhatsApp integration · Contact forms ·
          Google Maps · SEO basics · Payment integration
        </div>
      </div>
    </section>
  );
}
