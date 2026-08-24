import { useState } from 'react';
import './Reviews.css';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzwNDynzpPi4xU5K6XN9iyRs3NNPelSQfU1ztqA-Ipt4dBhXGIE-qB7wWMJr-zCYHs/exec';

import { REVIEWS } from '../data/siteData';


function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="rv-stars rv-stars--input" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`rv-star-btn${(hover || value) >= n ? ' rv-star-btn--on' : ''}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="rv-card reveal">
      <div className="rv-card__header">
        <div className="rv-card__avatar">{review.avatar}</div>
        <div className="rv-card__meta">
          <span className="rv-card__name">{review.name}</span>
          <span className="rv-card__company">{review.company}</span>
        </div>
        <span className="rv-card__badge">{review.service}</span>
      </div>
      <div className="rv-stars" aria-label={`${review.rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map(n => (
          <span key={n} className={`rv-star${review.rating >= n ? ' rv-star--on' : ''}`}>★</span>
        ))}
      </div>
      <blockquote className="rv-card__text">"{review.text}"</blockquote>
    </article>
  );
}

export default function Reviews() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]   = useState({ name: '', company: '', service: '', rating: 0, text: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | done

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.text || form.rating === 0) return;

    setStatus('sending');

    const payload = {
      type:    'review',
      name:    form.name.trim(),
      company: form.company.trim(),
      service: form.service,
      rating:  form.rating,
      review:  form.text.trim(),
      date:    new Date().toISOString(),
    };

    fetch(APPS_SCRIPT_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams(payload).toString(),
    }).catch(() => {});

    setTimeout(() => setStatus('done'), 2000);
  };

  return (
    <section id="reviews" className="section reviews" aria-labelledby="reviews-h">
      <div className="container">

        {/* Header */}
        <div className="reviews__header reveal">
          <span className="section-label">Client Reviews</span>
          <h2 id="reviews-h" className="reviews__heading">What our clients say</h2>
          <p className="reviews__sub">
            Real feedback from businesses and individuals we have worked with.
          </p>
        </div>

        {/* Cards grid */}
        <div className="reviews__grid">
          {REVIEWS.map(r => <ReviewCard key={r.id} review={r} />)}
        </div>

        {/* CTA to leave a review */}
        <div className="reviews__cta-row reveal">
          {!showForm ? (
            <button
              className="btn btn--outline reviews__leave-btn"
              onClick={() => setShowForm(true)}
            >
              ★ Leave a Review
            </button>
          ) : (
            <div className="rv-form-wrap rv-form-wrap--appear">
              {status === 'done' ? (
                <div className="rv-form-success">
                  <svg viewBox="0 0 52 52" className="rv-success-svg" aria-hidden="true">
                    <circle className="rv-success-circle" cx="26" cy="26" r="24" fill="none" />
                    <path className="rv-success-check" fill="none" d="M14 27l8 8 16-16" />
                  </svg>
                  <p className="rv-success-msg">Thank you! Your review has been submitted.</p>
                </div>
              ) : (
                <form className="rv-form" onSubmit={handleSubmit} noValidate>
                  <h3 className="rv-form__title">Share your experience</h3>

                  <div className="rv-form__field">
                    <label className="rv-form__label">Your Rating <span className="rv-req">*</span></label>
                    <StarRating value={form.rating} onChange={v => set('rating', v)} />
                  </div>

                  <div className="rv-form__row">
                    <div className="rv-form__field">
                      <label className="rv-form__label" htmlFor="rv-name">Full Name <span className="rv-req">*</span></label>
                      <input id="rv-name" className="rv-form__input" type="text"
                        placeholder="Ravi Kumar" value={form.name}
                        onChange={e => set('name', e.target.value)} required />
                    </div>
                    <div className="rv-form__field">
                      <label className="rv-form__label" htmlFor="rv-company">Company / Business</label>
                      <input id="rv-company" className="rv-form__input" type="text"
                        placeholder="ABC Technologies" value={form.company}
                        onChange={e => set('company', e.target.value)} />
                    </div>
                  </div>

                  <div className="rv-form__field">
                    <label className="rv-form__label" htmlFor="rv-service">Service Received</label>
                    <select id="rv-service" className="rv-form__input"
                      value={form.service} onChange={e => set('service', e.target.value)}>
                      <option value="">Select a service</option>
                      <option>Business Website</option>
                      <option>Portfolio Website</option>
                      <option>Landing Page</option>
                      <option>E-Commerce Website</option>
                      <option>Custom Development</option>
                    </select>
                  </div>

                  <div className="rv-form__field">
                    <label className="rv-form__label" htmlFor="rv-text">Your Review <span className="rv-req">*</span></label>
                    <textarea id="rv-text" className="rv-form__input rv-form__input--ta"
                      rows={4} placeholder="Tell others about your experience with Genwebzy..."
                      value={form.text} onChange={e => set('text', e.target.value)} required />
                  </div>

                  <div className="rv-form__actions">
                    <button type="button" className="btn btn--ghost rv-form__cancel"
                      onClick={() => setShowForm(false)}>Cancel</button>
                    <button
                      type="submit"
                      className={`btn btn--primary rv-form__submit${status === 'sending' ? ' rv-form__submit--sending' : ''}`}
                      disabled={status === 'sending'}
                    >
                      {status === 'sending' ? (
                        <><span className="rv-spinner" aria-hidden="true" /> Submitting…</>
                      ) : 'Submit Review'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
