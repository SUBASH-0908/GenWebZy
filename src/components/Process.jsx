import { PROCESS_STEPS } from '../data/siteData';
import './Process.css';

export default function Process() {
  return (
    <section id="process" className="section section--dark process" aria-labelledby="process-heading">
      <div className="container">
        <div className="section-intro reveal">
          <span className="label label--light">How We Work</span>
          <h2 id="process-heading" className="section-heading section-heading--light" style={{ marginTop: '1rem' }}>
            A simple process from idea to launch.
          </h2>
          <p className="section-subtitle section-subtitle--light" style={{ marginTop: '1rem' }}>
            Every project follows a clear, transparent workflow so you always know where things stand.
          </p>
        </div>

        <div className="process__timeline">
          {PROCESS_STEPS.map((step, i) => (
            <div key={step.number} className="process__step reveal" style={{ '--delay': i * 0.1 + 's' }}>
              <div className="process__step-number">{step.number}</div>
              <div className="process__connector" aria-hidden="true" />
              <div className="process__step-content">
                <h3 className="process__step-title">{step.title}</h3>
                <p className="process__step-desc">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
