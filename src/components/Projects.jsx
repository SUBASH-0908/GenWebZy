import { PROJECTS } from '../data/siteData';
import './Projects.css';

/* Category-based palette for placeholders */
const PAL = {
  'Business Website': { bg: '#eff6ff', line: '#2563eb' },
  Portfolio:          { bg: '#f0fdf4', line: '#16a34a' },
  'Landing Page':     { bg: '#fefce8', line: '#ca8a04' },
  'E-Commerce':       { bg: '#fdf4ff', line: '#9333ea' },
};

function ProjectPlaceholder({ title, category }) {
  const p = PAL[category] || PAL['Business Website'];
  return (
    <div className="proj-ph" style={{ background: p.bg }}>
      <div className="proj-ph__nav">
        <div className="proj-ph__logo" style={{ background: p.line, opacity: 0.7 }} />
        <div className="proj-ph__nav-r">
          <div className="proj-ph__link" />
          <div className="proj-ph__link" />
          <div className="proj-ph__btn" style={{ background: p.line }} />
        </div>
      </div>
      <div className="proj-ph__body">
        <div className="proj-ph__h" style={{ background: p.line, opacity: 0.6 }} />
        <div className="proj-ph__h proj-ph__h--sm" style={{ background: p.line, opacity: 0.35 }} />
        <div className="proj-ph__p" />
        <div className="proj-ph__actions">
          <div className="proj-ph__cta" style={{ background: p.line }} />
          <div className="proj-ph__ghost" />
        </div>
      </div>
      <div className="proj-ph__label" style={{ color: p.line }}>{title}</div>
    </div>
  );
}

export default function Projects() {
  const [featured, ...rest] = PROJECTS;
  return (
    <section id="work" className="section projects" aria-labelledby="work-h">
      <div className="container">
        <div className="projects__head reveal">
          <span className="section-label">Selected Work</span>
          <h2 id="work-h" className="projects__heading">
            A selection of websites<br />by Genwebzy.
          </h2>
          <p className="projects__sub">
            Projects we have built, designed or conceptualised.
            Concept projects are clearly labelled.
          </p>
        </div>

        {/* Featured */}
        {featured && (
          <article className="proj-featured reveal reveal-d1">
            <div className="proj-featured__img">
              {featured.image
                ? <img src={featured.image} alt={featured.title} loading="eager" />
                : <ProjectPlaceholder title={featured.title} category={featured.category} />
              }
              {featured.isConcept && <span className="proj-badge">Concept</span>}
            </div>
            <div className="proj-featured__info">
              <span className="proj-cat">{featured.category}</span>
              <h3 className="proj-featured__title">{featured.title}</h3>
              <p className="proj-desc">{featured.description}</p>
              <div className="proj-tech">
                {featured.technologies.map(t => <span key={t} className="proj-tech-item">{t}</span>)}
              </div>
              {featured.projectUrl
                ? <a href={featured.projectUrl} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
                    View Project →
                  </a>
                : <span className="proj-soon">URL not yet available</span>
              }
            </div>
          </article>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div className="proj-grid reveal reveal-d2">
            {rest.map(p => (
              <article key={p.id} className="proj-card">
                <div className="proj-card__img">
                  {p.image
                    ? <img src={p.image} alt={p.title} loading="lazy" />
                    : <ProjectPlaceholder title={p.title} category={p.category} />
                  }
                  {p.isConcept && <span className="proj-badge">Concept</span>}
                </div>
                <div className="proj-card__info">
                  <span className="proj-cat">{p.category}</span>
                  <h3 className="proj-card__title">{p.title}</h3>
                  <div className="proj-tech">
                    {p.technologies.map(t => <span key={t} className="proj-tech-item">{t}</span>)}
                  </div>
                  {p.projectUrl
                    ? <a href={p.projectUrl} target="_blank" rel="noopener noreferrer" className="proj-link">View →</a>
                    : <span className="proj-soon">Coming soon</span>
                  }
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="projects__cta reveal">
          <a href="#contact" className="btn btn--outline">Work with us on your project</a>
        </div>
      </div>
    </section>
  );
}
