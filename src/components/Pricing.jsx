import { PRICING } from '../data/siteData';
import './Pricing.css';

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Pricing() {
  return (
    <section className="section pricing" aria-labelledby="pricing-heading">
      <div className="container">
        <div className="section-intro reveal">
          <span className="label">Pricing</span>
          <h2 id="pricing-heading" className="section-heading" style={{ marginTop: '1rem' }}>
            Simple starting points.
          </h2>
          <p className="section-subtitle" style={{ marginTop: '1rem' }}>
            Prices depend on pages, functionality, integrations and project requirements.
            Every project starts with a conversation.
          </p>
        </div>

        <div className="pricing__grid">
          {PRICING.map(plan => (
            <div
              key={plan.id}
              className={`pricing-card reveal${plan.highlighted ? ' pricing-card--highlighted' : ''}`}
            >
              {plan.highlighted && (
                <span className="pricing-card__badge">Most Popular</span>
              )}
              <div className="pricing-card__header">
                <h3 className="pricing-card__name">{plan.name}</h3>
                <p className="pricing-card__audience">{plan.audience}</p>
              </div>
              <div className="pricing-card__price">
                {plan.priceNote && (
                  <span className="pricing-card__price-note">{plan.priceNote}</span>
                )}
                <span className="pricing-card__price-value">{plan.price}</span>
              </div>
              <ul className="pricing-card__features">
                {plan.features.map(feat => (
                  <li key={feat} className="pricing-card__feature">
                    <span className="pricing-card__check"><CheckIcon /></span>
                    {feat}
                  </li>
                ))}
              </ul>
              <a href="#contact" className={`btn pricing-card__cta${plan.highlighted ? ' btn--primary' : ' btn--outline'}`}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="pricing__disclaimer reveal">
          * All prices are in Indian Rupees (₹) and serve as starting points.
          Final pricing is confirmed after discussing your specific requirements.
        </p>
      </div>
    </section>
  );
}
