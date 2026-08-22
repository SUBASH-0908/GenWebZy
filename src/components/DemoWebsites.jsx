import { DEMOS } from '../data/siteData';
import './DemoWebsites.css';

const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M5.5 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M8 1h5v5M13 1L7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function DemoPlaceholder({ name, category }) {
  const hues = {
    Restaurant: '#fff7ed',
    Photography: '#f8f5ff',
    Salon: '#fff0f6',
    Gym: '#f0fff4',
    'Real Estate': '#eff6ff',
    Portfolio: '#f8fafc',
    Education: '#fefce8',
    'Small Business': '#f0fdf4',
    'E-Commerce': '#fdf4ff',
  };
  const bg = hues[category] || '#f8fafc';
  return (
    <div className="demo-card__placeholder" style={{ background: bg }}>
      <span className="demo-card__placeholder-category">{category}</span>
      <span className="demo-card__placeholder-name">{name}</span>
    </div>
  );
}

export default function DemoWebsites() {
  return (
    <section id="demos" className="section demos" aria-labelledby="demos-heading">
      <div className="container">
        <div className="section-intro reveal">
          <span className="label">Demo Websites</span>
          <h2 id="demos-heading" className="section-heading" style={{ marginTop: '1rem' }}>
            Explore our website demos.
          </h2>
          <p className="section-subtitle" style={{ marginTop: '1rem' }}>
            Looking for inspiration? Browse some of our ready-to-show website concepts.
            We can customize the design, content and functionality according to your business.
          </p>
        </div>

        <div className="demos__grid">
          {DEMOS.map((demo, i) => (
            <article key={demo.id} className="demo-card reveal" style={{ '--delay': i * 0.07 + 's' }}>
              <div className="demo-card__image-wrap">
                {demo.image ? (
                  <img
                    src={demo.image}
                    alt={`${demo.name} website preview`}
                    className="demo-card__image"
                    loading="lazy"
                  />
                ) : (
                  <DemoPlaceholder name={demo.name} category={demo.category} />
                )}
                <span className="demo-card__tag">{demo.category}</span>
              </div>

              <div className="demo-card__body">
                <h3 className="demo-card__name">{demo.name}</h3>
                <p className="demo-card__desc">{demo.description}</p>

                <div className="demo-card__tech">
                  {demo.technologies.map(t => (
                    <span key={t} className="demo-card__tech-item">{t}</span>
                  ))}
                </div>

                <div className="demo-card__actions">
                  {demo.liveUrl && !demo.liveUrl.startsWith('DEMO_URL') ? (
                    <a
                      href={demo.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--outline btn--sm demo-card__btn"
                    >
                      Live Demo <ExternalIcon />
                    </a>
                  ) : (
                    <span className="demo-card__coming">Demo coming soon</span>
                  )}
                  <a href="#contact" className="btn btn--primary btn--sm demo-card__btn">
                    Request This Design
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
