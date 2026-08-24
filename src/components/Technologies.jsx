import { TECHNOLOGIES } from '../data/siteData';
import './Technologies.css';

const CATS = ['Frontend', 'Backend', 'Database', 'Design', 'Tools'];

export default function Technologies() {
  return (
    <section className="section section--alt tech" aria-labelledby="tech-h">
      <div className="container">
        <div className="tech__inner">
          <div className="tech__left reveal">
            <span className="section-label">Tools We Use</span>
            <h2 id="tech-h" className="tech__heading">Technologies we work with.</h2>
            <p className="tech__sub">
              We choose tools that are well-supported, practical
              and appropriate for the project — not the newest trend.
            </p>
          </div>
          <div className="tech__right reveal reveal-d2">
            {CATS.map(cat => {
              const items = TECHNOLOGIES.filter(t => t.category === cat);
              if (!items.length) return null;
              return (
                <div key={cat} className="tech__group">
                  <span className="tech__group-label">{cat}</span>
                  <div className="tech__items">
                    {items.map(t => (
                      <span key={t.name} className="tech__item">{t.name}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
