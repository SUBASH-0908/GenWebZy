import { useEffect, useRef } from 'react';
import './Introduction.css';

/**
 * The first editorial statement after the hero.
 * As the heading scrolls into view, words transition from
 * light gray to dark navy — subtle, memorable.
 */
export default function Introduction() {
  const headRef = useRef(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => el.classList.toggle('intro-head--lit', entry.isIntersecting),
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section intro" aria-label="What we do">
      <div className="container">
        <div className="intro__inner">
          <span className="section-label">What We Do</span>

          <h2 className="intro__head" ref={headRef}>
            A website should do<br />more than look good.
          </h2>

          <p className="intro__body reveal reveal-d2">
            It should explain what you offer, build trust and make it easy
            for people to contact you. That is what we focus on.
          </p>
        </div>

        {/* Three pillars */}
        <div className="intro__pillars">
          {[
            {
              n: '01',
              title: 'Design',
              desc: 'Layouts and visuals built specifically for your business — not adapted from a template.',
            },
            {
              n: '02',
              title: 'Develop',
              desc: 'Clean, responsive code that works correctly across every device and browser.',
            },
            {
              n: '03',
              title: 'Deploy',
              desc: 'Domain, hosting and everything set up — your website live and ready from day one.',
            },
          ].map((p, i) => (
            <div key={p.n} className={`intro__pillar reveal reveal-d${i + 1}`}>
              <span className="intro__pillar-n">{p.n}</span>
              <h3 className="intro__pillar-title">{p.title}</h3>
              <p className="intro__pillar-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
