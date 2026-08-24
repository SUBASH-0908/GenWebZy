import { useState, useEffect, useCallback, useRef } from 'react';
import './Hero.css';

/* ── Demo site CSS mockups ── */
function RestaurantMockup() {
  return (
    <div className="demo-site demo-site--restaurant">
      <div className="ds-nav">
        <span className="ds-logo">EMBER</span>
        <div className="ds-nav-r">
          <span className="ds-link">Menu</span>
          <span className="ds-link">Gallery</span>
          <span className="ds-link">Reserve</span>
          <span className="ds-cta-r">Book a Table</span>
        </div>
      </div>
      <div className="ds-hero-r">
        <span className="ds-eyebrow-r">Fine Dining · Est. 2018</span>
        <h2 className="ds-h1-r">Contemporary<br />Indian Cuisine</h2>
        <p className="ds-sub-r">An elevated dining experience rooted in regional flavour</p>
        <div className="ds-actions-r">
          <span className="ds-btn-r">Reserve a Table</span>
          <span className="ds-ghost-r">View Menu</span>
        </div>
      </div>
      <div className="ds-strip-r">
        <div className="ds-strip-item">LUNCH&ensp;12–3PM</div>
        <div className="ds-strip-sep" />
        <div className="ds-strip-item">DINNER&ensp;7–11PM</div>
        <div className="ds-strip-sep" />
        <div className="ds-strip-item">SAT–SUN BRUNCH</div>
      </div>
      <div className="ds-bottom-r">
        <div className="ds-card-r">
          <div className="ds-card-img-r ds-card-img-r--a" />
          <span>Seasonal Menu</span>
        </div>
        <div className="ds-card-r">
          <div className="ds-card-img-r ds-card-img-r--b" />
          <span>Private Dining</span>
        </div>
        <div className="ds-card-r">
          <div className="ds-card-img-r ds-card-img-r--c" />
          <span>Chef's Table</span>
        </div>
      </div>
    </div>
  );
}

function PhotographyMockup() {
  return (
    <div className="demo-site demo-site--photo">
      <div className="ds-nav-p">
        <span className="ds-logo-p">ATELIER</span>
        <div className="ds-nav-r-p">
          <span>Work</span>
          <span>Services</span>
          <span>About</span>
          <span>Contact</span>
        </div>
      </div>
      <div className="ds-hero-p">
        <div className="ds-photo-main" />
        <div className="ds-photo-caption">
          <span className="ds-photo-label">Visual Stories</span>
          <h2 className="ds-photo-h1">Crafted for<br />brands &amp; people</h2>
        </div>
      </div>
      <div className="ds-grid-p">
        <div className="ds-thumb ds-thumb--tall" />
        <div className="ds-thumb-col">
          <div className="ds-thumb ds-thumb--short" />
          <div className="ds-thumb ds-thumb--short" />
        </div>
        <div className="ds-thumb ds-thumb--tall ds-thumb--accent" />
      </div>
    </div>
  );
}

function BusinessMockup() {
  return (
    <div className="demo-site demo-site--business">
      <div className="ds-nav-b">
        <span className="ds-logo-b">MERIDIAN</span>
        <div className="ds-nav-r-b">
          <span>Services</span>
          <span>Projects</span>
          <span>About</span>
          <span className="ds-cta-b">Get in Touch</span>
        </div>
      </div>
      <div className="ds-hero-b">
        <span className="ds-eyebrow-b">Consulting &amp; Strategy</span>
        <h2 className="ds-h1-b">We help businesses<br />grow with clarity.</h2>
        <p className="ds-sub-b">Financial and operational consulting for ambitious companies</p>
        <div className="ds-actions-b">
          <span className="ds-btn-b">Book a Discovery Call</span>
          <span className="ds-ghost-b">Our Work →</span>
        </div>
      </div>
      <div className="ds-services-b">
        <div className="ds-svc-item">
          <div className="ds-svc-num">01</div>
          <div className="ds-svc-info">
            <strong>Strategy</strong>
            <span>Growth planning</span>
          </div>
        </div>
        <div className="ds-svc-item">
          <div className="ds-svc-num">02</div>
          <div className="ds-svc-info">
            <strong>Finance</strong>
            <span>P&amp;L optimization</span>
          </div>
        </div>
        <div className="ds-svc-item">
          <div className="ds-svc-num">03</div>
          <div className="ds-svc-info">
            <strong>Operations</strong>
            <span>Process design</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const DEMOS = [
  { id: 'restaurant',  label: 'Restaurant',   liveUrl: null, Component: RestaurantMockup },
  { id: 'photography', label: 'Photography',  liveUrl: null, Component: PhotographyMockup },
  { id: 'business',    label: 'Business',     liveUrl: null, Component: BusinessMockup },
];

const INTERVAL = 3800; // ms between auto-slides

export default function Hero() {
  const [active, setActive]   = useState(0);
  const [prev, setPrev]       = useState(null);
  const [animating, setAnimating] = useState(false);
  const [tilt, setTilt]       = useState({ x: 0, y: 0 });
  const timerRef  = useRef(null);
  const previewRef= useRef(null);

  /* ── transition to a new slide ── */
  const goTo = useCallback((idx) => {
    if (idx === active || animating) return;
    setPrev(active);
    setActive(idx);
    setAnimating(true);
    setTimeout(() => { setPrev(null); setAnimating(false); }, 600);
  }, [active, animating]);

  /* ── auto-rotate ── */
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(a => {
        const next = (a + 1) % DEMOS.length;
        setPrev(a);
        setAnimating(true);
        setTimeout(() => { setPrev(null); setAnimating(false); }, 600);
        return next;
      });
    }, INTERVAL);
  }, []);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  /* ── subtle mouse tilt ── */
  const handleMouseMove = useCallback((e) => {
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 5;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 3;
    setTilt({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  /* ── click indicator — also resets timer ── */
  const handleDotClick = (i) => {
    goTo(i);
    startTimer();
  };

  const ActiveComp = DEMOS[active].Component;
  const PrevComp   = prev !== null ? DEMOS[prev].Component : null;

  return (
    <section id="home" className="hero" aria-label="Hero">
      <div className="container hero__inner">

        {/* Left — Content */}
        <div className="hero__content">
          <span className="hero__eyebrow hero__in hero__in--1">
            Web Development Studio
          </span>
          <h1 className="hero__heading hero__in hero__in--2">
            Websites built<br />around your business.
          </h1>
          <p className="hero__body hero__in hero__in--3">
            We design, develop and launch websites that help businesses
            present themselves professionally online.
          </p>
          <div className="hero__actions hero__in hero__in--4">
            <a href="#contact" className="btn btn--primary btn--lg">
              Start a Project
              <svg className="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#work" className="btn btn--outline btn--lg">View Our Work</a>
          </div>
        </div>

        {/* Right — Auto-rotating demo preview */}
        <div className="hero__preview-wrap hero__in hero__in--4">
          <div
            className="hero__preview"
            ref={previewRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform: `translate(${tilt.x}px, ${tilt.y}px)` }}
            aria-label="Website demo preview — auto-rotating"
          >
            {/* Outgoing slide */}
            {PrevComp && (
              <div className="hero__slide hero__slide--out" key={`prev-${prev}`}>
                <PrevComp />
              </div>
            )}
            {/* Incoming slide */}
            <div className={`hero__slide hero__slide--in${animating ? '' : ' hero__slide--settled'}`} key={`active-${active}`}>
              <ActiveComp />
            </div>

            {/* Hover bar */}
            <div className="hero__preview-bar">
              {DEMOS[active].liveUrl
                ? <a href={DEMOS[active].liveUrl} target="_blank" rel="noopener noreferrer">View Demo →</a>
                : <span>Demo website — contact us to build yours</span>
              }
            </div>
          </div>

          {/* Dot indicators */}
          <div className="hero__dots-row" role="tablist" aria-label="Demo previews">
            {DEMOS.map((d, i) => (
              <button
                key={d.id}
                className={`hero__dot${active === i ? ' hero__dot--active' : ''}`}
                onClick={() => handleDotClick(i)}
                role="tab"
                aria-selected={active === i}
                aria-label={d.label}
                title={d.label}
              >
                <span className="hero__dot-fill" />
              </button>
            ))}
            <span className="hero__dot-label">{DEMOS[active].label}</span>
          </div>
        </div>
      </div>

      {/* Trust line */}
      <div className="hero__trust" aria-hidden="true">
        <div className="container">
          <span>DESIGN&ensp;•&ensp;DEVELOP&ensp;•&ensp;DEPLOY</span>
        </div>
      </div>
    </section>
  );
}
