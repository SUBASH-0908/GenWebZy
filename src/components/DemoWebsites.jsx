import { useState } from 'react';
import { DEMOS } from '../data/siteData';
import './DemoWebsites.css';

const FILTERS = ['All', 'Restaurant', 'Photography', 'Salon', 'Gym', 'Real Estate', 'Portfolio'];

/* Color scheme per category for placeholder backgrounds */
const PALETTES = {
  Restaurant:   { bg: '#1a0f0a', accent: '#c97c3a', text: '#f5ede4', label: 'Warm & Inviting'  },
  Photography:  { bg: '#0c0c0c', accent: '#ffffff', text: '#ffffff', label: 'Minimal & Visual'  },
  Salon:        { bg: '#2a1020', accent: '#c084a8', text: '#fdf0f8', label: 'Elegant & Refined' },
  Gym:          { bg: '#0a1218', accent: '#22c55e', text: '#ffffff', label: 'Bold & Energetic'  },
  'Real Estate':{ bg: '#0e1825', accent: '#60a5fa', text: '#f0f6ff', label: 'Clean & Professional'},
  Portfolio:    { bg: '#f7f8fb', accent: '#2563eb', text: '#0c1120', label: 'Minimal & Personal' },
};

function DemoPlaceholder({ category, name }) {
  const p = PALETTES[category] || PALETTES.Portfolio;
  const light = category === 'Portfolio';
  return (
    <div className="demo-ph" style={{ background: p.bg }}>
      <div className="demo-ph__nav" style={{ borderColor: light ? '#eee' : 'rgba(255,255,255,0.08)' }}>
        <span className="demo-ph__logo" style={{ color: p.text, opacity: light ? 1 : 0.85 }}>
          {name.toUpperCase()}
        </span>
        <div className="demo-ph__nav-links" style={{ color: p.text, opacity: 0.4 }}>
          <span>Menu</span><span>Gallery</span><span>Contact</span>
        </div>
      </div>
      <div className="demo-ph__body">
        <span className="demo-ph__cat" style={{ color: p.accent }}>{p.label}</span>
        <div className="demo-ph__blocks">
          <div className="demo-ph__h" style={{ background: p.accent, opacity: 0.8 }} />
          <div className="demo-ph__h demo-ph__h--sm" style={{ background: p.text, opacity: 0.3 }} />
          <div className="demo-ph__p" style={{ background: p.text, opacity: 0.15 }} />
          <div className="demo-ph__p demo-ph__p--sm" style={{ background: p.text, opacity: 0.1 }} />
          <div className="demo-ph__btn" style={{ background: p.accent }} />
        </div>
      </div>
    </div>
  );
}

export default function DemoWebsites() {
  const [filter, setFilter] = useState('All');

  const visible = filter === 'All'
    ? DEMOS
    : DEMOS.filter(d => d.category === filter);

  const hasUrl = (url) => url && !url.startsWith('DEMO_URL');

  return (
    <section id="demos" className="section section--alt demos" aria-labelledby="demos-h">
      <div className="container">
        <div className="demos__head reveal">
          <div>
            <span className="section-label">Demo Websites</span>
            <h2 id="demos-h" className="demos__heading">See what we can build.</h2>
            <p className="demos__sub">
              Explore our website concepts and find a direction for your project.
              Each demo can be fully customised to your brand.
            </p>
          </div>
          <a href="#contact" className="btn btn--outline demos__head-cta">
            Request a Custom Design
          </a>
        </div>

        {/* Filter */}
        <div className="demos__filters reveal" role="tablist" aria-label="Filter demos">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`demos__filter${filter === f ? ' demos__filter--active' : ''}`}
              onClick={() => setFilter(f)}
              role="tab"
              aria-selected={filter === f}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="demos__grid reveal reveal-d1">
          {visible.map(demo => (
            <article key={demo.id} className="demo-card">
              <div className="demo-card__img-wrap">
                {demo.image
                  ? <img src={demo.image} alt={`${demo.name} preview`} className="demo-card__img" loading="lazy" />
                  : <DemoPlaceholder category={demo.category} name={demo.name} />
                }
                <div className="demo-card__overlay">
                  {hasUrl(demo.liveUrl)
                    ? <a href={demo.liveUrl} target="_blank" rel="noopener noreferrer" className="demo-card__overlay-btn">
                        View Demo →
                      </a>
                    : <span className="demo-card__overlay-soon">Coming Soon</span>
                  }
                </div>
              </div>
              <div className="demo-card__body">
                <span className="demo-card__cat">{demo.category}</span>
                <h3 className="demo-card__name">{demo.name}</h3>
                <p className="demo-card__desc">{demo.description}</p>
                <div className="demo-card__tech">
                  {demo.technologies.map(t => <span key={t} className="demo-card__tech-item">{t}</span>)}
                </div>
                <a href="#contact" className="demo-card__req">
                  Build something like this →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
