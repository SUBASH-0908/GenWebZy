import { SERVICES } from '../data/siteData';
import './Services.css';

export default function Services() {
  return (
    <section id="services" className="section services" aria-labelledby="services-heading">
      <div className="container">
        <div className="section-intro reveal">
          <span className="label">What We Do</span>
          <h2 id="services-heading" className="section-heading" style={{ marginTop: '1rem' }}>
            From the first design to<br />the final deployment.
          </h2>
          <p className="section-subtitle" style={{ marginTop: '1rem' }}>
            We help turn ideas into working websites — covering every stage of the process.
          </p>
        </div>

        <div className="services__grid">
          {SERVICES.map((service, i) => (
            <article key={service.id} className="service-item reveal" style={{ '--delay': i * 0.08 + 's' }}>
              <div className="service-item__number">{service.id}</div>
              <div className="service-item__content">
                <h3 className="service-item__title">{service.title}</h3>
                <p className="service-item__desc">{service.description}</p>
                {service.extras && (
                  <ul className="service-item__extras">
                    {service.extras.map(extra => (
                      <li key={extra} className="service-item__extra">{extra}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="services__footer reveal">
          <p className="services__also">
            <strong>Also available:</strong> Domain &amp; hosting setup &nbsp;·&nbsp;
            WhatsApp integration &nbsp;·&nbsp; Contact forms &nbsp;·&nbsp;
            Google Maps integration &nbsp;·&nbsp; Basic SEO &nbsp;·&nbsp;
            Payment integration &nbsp;·&nbsp; Database integration
          </p>
          <a href="#contact" className="btn btn--outline">
            Discuss Your Project
          </a>
        </div>
      </div>
    </section>
  );
}
