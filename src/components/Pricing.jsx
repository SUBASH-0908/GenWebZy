import { PRICING } from '../data/siteData';
import './Pricing.css';

export default function Pricing() {
  return (
    <section id="pricing" className="section pricing" aria-labelledby="pricing-h">
      <div className="container">
        <div className="pricing__head reveal">
          <span className="section-label">Pricing</span>
          <h2 id="pricing-h" className="pricing__heading">Straightforward pricing.</h2>
          <p className="pricing__sub">
            No hidden fees. Scope, deliverables and cost are discussed
            and agreed before any development begins.
          </p>
        </div>

        <div className="pricing__grid reveal reveal-d1">
          {PRICING.map(plan => (
            <article
              key={plan.id}
              className={`price-card${plan.highlighted ? ' price-card--featured' : ''}`}
            >
              {plan.highlighted && <div className="price-card__badge">Most Popular</div>}

              <div className="price-card__top">
                <h3 className="price-card__name">{plan.name}</h3>
                <p className="price-card__audience">{plan.audience}</p>
              </div>

              <div className="price-card__price-wrap">
                {plan.priceNote && (
                  <span className="price-card__note">{plan.priceNote}</span>
                )}
                <div className="price-card__price">{plan.price}</div>
              </div>

              <ul className="price-card__features">
                {plan.features.map(f => (
                  <li key={f} className="price-card__feature">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a href="#contact" className={`btn price-card__cta${plan.highlighted ? ' btn--primary' : ' btn--outline'}`}>
                {plan.cta}
              </a>
            </article>
          ))}
        </div>

        <p className="pricing__disclaimer reveal">
          All prices are discussed and agreed upon before development begins.
          Timelines and payment terms are included in the project quotation.
        </p>
      </div>
    </section>
  );
}
