import { useState } from 'react';
import './Contact.css';
import { CONTACT } from '../data/siteData';
import CustomSelect from './CustomSelect';

const WEBSITE_TYPES = [
  'Business Website',
  'Portfolio Website',
  'Landing Page',
  'E-Commerce Website',
  'Custom Web Development',
  'Website Redesign',
  'Other',
];

const BUDGETS = [
  'Under ₹10,000',
  '₹10,000 – ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  'Above ₹1,00,000',
  'Not sure yet',
];

const TIMELINES = [
  'As soon as possible',
  'Within 2 weeks',
  'Within a month',
  '1–3 months',
  'No specific deadline',
];

const FEATURES_LIST = [
  'Contact Form',
  'WhatsApp Integration',
  'Google Maps',
  'Image Gallery',
  'Blog / News',
  'E-Commerce',
  'Payment Integration',
  'Multi-language',
  'Admin Panel',
  'Booking / Reservation',
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '', business: '', email: '', phone: '',
    websiteType: '', budget: '', features: [],
    description: '', timeline: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleFeature = (feat) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feat)
        ? prev.features.filter(f => f !== feat)
        : [...prev.features, feat],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // TODO: Connect to backend / Google Apps Script / email service
    // Example: await fetch('/api/enquiry', { method: 'POST', body: JSON.stringify(form) });
    await new Promise(r => setTimeout(r, 800));
    setSending(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="contact" className="section section--dark contact" aria-labelledby="contact-heading">
        <div className="container">
          <div className="contact__success">
            <div className="contact__success-icon" aria-hidden="true">✓</div>
            <h2 className="contact__success-heading">Enquiry received.</h2>
            <p className="contact__success-body">
              Thank you for reaching out. We will review your project details and
              get back to you as soon as possible.
            </p>
            <button className="btn btn--outline-light" onClick={() => setSubmitted(false)}>
              Send Another Enquiry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section section--dark contact" aria-labelledby="contact-heading">
      <div className="container">
        <div className="contact__inner">
          {/* Left */}
          <div className="contact__left reveal">
            <span className="label label--light">Get in Touch</span>
            <h2 id="contact-heading" className="section-heading section-heading--light" style={{ marginTop: '1rem' }}>
              Have a project in mind?
            </h2>
            <p className="section-subtitle section-subtitle--light" style={{ marginTop: '1rem' }}>
              Tell us what you're looking to build and we'll get back to you.
            </p>

            <div className="contact__details">
              <a href={`mailto:${CONTACT.email}`} className="contact__detail">
                <span className="contact__detail-label">Email</span>
                <span className="contact__detail-value">{CONTACT.email}</span>
              </a>
              <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer" className="contact__detail">
                <span className="contact__detail-label">WhatsApp</span>
                <span className="contact__detail-value">{CONTACT.whatsapp}</span>
              </a>
              {CONTACT.instagram && !CONTACT.instagram.startsWith('INSTAGRAM') && (
                <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="contact__detail">
                  <span className="contact__detail-label">Instagram</span>
                  <span className="contact__detail-value">@genwebzy</span>
                </a>
              )}
            </div>


          </div>

          {/* Form */}
          <form className="contact__form reveal reveal-delay-2" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name *</label>
                <input
                  id="name" name="name" type="text" required
                  className="form-input" placeholder="Your full name"
                  value={form.name} onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="business">Business / Organization</label>
                <input
                  id="business" name="business" type="text"
                  className="form-input" placeholder="Company or organization name"
                  value={form.business} onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address *</label>
                <input
                  id="email" name="email" type="email" required
                  className="form-input" placeholder="you@example.com"
                  value={form.email} onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone">WhatsApp / Phone</label>
                <input
                  id="phone" name="phone" type="tel"
                  className="form-input" placeholder="+91 XXXXX XXXXX"
                  value={form.phone} onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="websiteType">Website Type</label>
                <CustomSelect
                  id="websiteType"
                  placeholder="Select a type"
                  options={WEBSITE_TYPES}
                  value={form.websiteType}
                  onChange={(val) => setForm(prev => ({ ...prev, websiteType: val }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="budget">Budget Range</label>
                <CustomSelect
                  id="budget"
                  placeholder="Select a range"
                  options={BUDGETS}
                  value={form.budget}
                  onChange={(val) => setForm(prev => ({ ...prev, budget: val }))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Required Features (select all that apply)</label>
              <div className="form-features">
                {FEATURES_LIST.map(feat => (
                  <button
                    key={feat} type="button"
                    className={`form-feature-btn${form.features.includes(feat) ? ' form-feature-btn--active' : ''}`}
                    onClick={() => toggleFeature(feat)}
                    aria-pressed={form.features.includes(feat)}
                  >
                    {feat}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Project Description</label>
              <textarea
                id="description" name="description" rows={4}
                className="form-textarea" placeholder="Describe your website idea, goals and any specific requirements..."
                value={form.description} onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="timeline">Preferred Timeline</label>
              <CustomSelect
                id="timeline"
                placeholder="Select a timeline"
                options={TIMELINES}
                value={form.timeline}
                onChange={(val) => setForm(prev => ({ ...prev, timeline: val }))}
              />
            </div>

            <button type="submit" className="btn btn--primary btn--lg contact__submit" disabled={sending}>
              {sending ? 'Sending…' : 'Send Project Enquiry'}
            </button>

            <p className="contact__form-note">
              We aim to respond within 1–2 business days.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
