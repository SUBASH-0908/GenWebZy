import { useState, useEffect, useRef } from 'react';
import { PROCESS_STEPS } from '../data/siteData';
import './Process.css';

export default function Process() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setActive(Number(e.target.dataset.idx));
      }),
      { rootMargin: '-30% 0px -60% 0px' }
    );
    refs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="process" className="section section--dark process" aria-labelledby="process-h">
      <div className="container">
        <div className="process__inner">
          {/* Sticky left */}
          <div className="process__left reveal">
            <span className="section-label" style={{ color: 'rgba(255,255,255,0.35)' }}>How We Work</span>
            <h2 id="process-h" className="process__heading">From idea<br />to launch.</h2>
            <p className="process__sub">
              A clear, straightforward workflow from your first message
              to your website going live.
            </p>
            <div className="process__bar-track" aria-hidden="true">
              <div
                className="process__bar-fill"
                style={{ height: `${((active + 1) / PROCESS_STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="process__steps">
            {PROCESS_STEPS.map((step, i) => (
              <div
                key={step.number}
                className={`process__step${i <= active ? ' process__step--active' : ''}`}
                data-idx={i}
                ref={el => (refs.current[i] = el)}
              >
                <div className="process__step-num">{step.number}</div>
                <div className="process__step-body">
                  <h3 className="process__step-title">{step.title}</h3>
                  <p className="process__step-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
