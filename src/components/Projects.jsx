import { PROJECTS } from '../data/siteData';
import './Projects.css';

// SVG arrow icon
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function ProjectPlaceholder({ title, category }) {
  const colors = {
    'Business Website': '#e8f0fe',
    'Portfolio': '#f0fdf4',
    'Landing Page': '#fef9ee',
  };
  const bg = colors[category] || '#f5f5f5';
  return (
    <div className="project-card__placeholder" style={{ background: bg }}>
      <span className="project-card__placeholder-text">{title}</span>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="work" className="section section--alt projects" aria-labelledby="work-heading">
      <div className="container">
        <div className="section-intro reveal">
          <span className="label">Selected Work</span>
          <h2 id="work-heading" className="section-heading" style={{ marginTop: '1rem' }}>
            A selection of websites and<br />concepts by GenWebZy.
          </h2>
          <p className="section-subtitle" style={{ marginTop: '1rem' }}>
            Projects we have built, designed or conceptualized. Concept projects are
            clearly labelled — we do not misrepresent demo work as paid client work.
          </p>
        </div>

        <div className="projects__grid">
          {PROJECTS.map((project, i) => (
            <article
              key={project.id}
              className={`project-card reveal${i % 2 === 1 ? ' project-card--reverse' : ''}`}
            >
              <div className="project-card__image-wrap">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={`${project.title} website screenshot`}
                    className="project-card__image"
                    loading="lazy"
                  />
                ) : (
                  <ProjectPlaceholder title={project.title} category={project.category} />
                )}
                {project.isConcept && (
                  <span className="project-card__badge">Concept Project</span>
                )}
              </div>
              <div className="project-card__info">
                <span className="project-card__category label">{project.category}</span>
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__desc">{project.description}</p>
                <div className="project-card__tech">
                  {project.technologies.map(tech => (
                    <span key={tech} className="project-card__tech-item">{tech}</span>
                  ))}
                </div>
                {project.projectUrl ? (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--ghost project-card__link"
                  >
                    View Project <ArrowIcon />
                  </a>
                ) : (
                  <span className="project-card__soon">URL to be added</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
