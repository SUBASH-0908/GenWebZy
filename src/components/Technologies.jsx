import { TECHNOLOGIES } from '../data/siteData';
import './Technologies.css';

const techCategories = ['Frontend', 'Backend', 'Database', 'Design', 'Tools'];

export default function Technologies() {
  const grouped = techCategories.reduce((acc, cat) => {
    const items = TECHNOLOGIES.filter(t => t.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <section className="section section--alt technologies" aria-labelledby="tech-heading">
      <div className="container">
        <div className="tech__inner">
          <div className="tech__left reveal">
            <span className="label">Technologies</span>
            <h2 id="tech-heading" className="section-heading" style={{ marginTop: '1rem' }}>
              Technologies we work with.
            </h2>
            <p className="section-subtitle" style={{ marginTop: '1rem' }}>
              We work with a practical stack focused on building reliable, modern websites and web applications.
            </p>
            <p className="tech__note">
              We only list technologies we actually use and are comfortable with.
            </p>
          </div>
          <div className="tech__right reveal reveal-delay-2">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} className="tech__group">
                <span className="tech__group-label">{cat}</span>
                <div className="tech__items">
                  {items.map(tech => (
                    <span key={tech.name} className="tech__item">{tech.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
