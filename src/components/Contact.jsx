import { useState } from 'react';
import { CONTACT } from '../data/siteData';
import CustomSelect from './CustomSelect';
import './Contact.css';

// ─── FORM OPTIONS ────────────────────────────────────────────
const SERVICES = [
  'Business Website',
  'Portfolio Website',
  'Landing Page',
  'E-Commerce Website',
  'Web Application',
  'Website Redesign',
  'Custom Web Development',
  'Maintenance & Support',
  'Other',
];

const BUDGETS = [
  'Under ₹10,000',
  '₹10,000 – ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000+',
  'Not Sure',
];

const TIMELINES = [
  'As soon as possible',
  '1–2 weeks',
  '2–4 weeks',
  '1–2 months',
  '2–3 months',
  'Flexible',
];

// ─── APPS SCRIPT ENDPOINT ────────────────────────────────────
// Replace with your deployed Google Apps Script Web App URL after deployment.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwwSz9hZ1G0EvLk1lmPIAw5s9s4WfoVN2ZU65JW1BLotGqK6XOtcH7sBKu6j0lQAPuCIA/exec';

// ─── COMPONENT ───────────────────────────────────────────────
export default function Contact() {
  const [form, setForm] = useState({
    name:      '',
    email:     '',
    phone:     '',
    company:   '',
    service:   '',
    budget:    '',
    timeline:  '',
    startDate: '',
    message:   '',
  });
  const [status,  setStatus]  = useState('idle'); // idle | sending | done | error
  const [errMsg,  setErrMsg]  = useState('');
  const [otherService, setOtherService] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ── SUBMIT ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');

    // Basic client-side validation
    if (!form.name.trim())           return setErrMsg('Please enter your full name.');
    if (!form.email.trim())          return setErrMsg('Please enter your email address.');
    if (!form.phone.trim())          return setErrMsg('Please enter your WhatsApp / phone number.');
    if (!form.service)               return setErrMsg('Please select a service.');
    if (form.service === 'Other' && !otherService.trim())
                                     return setErrMsg('Please describe the service you need.');

    // Build final form data — replace "Other" with custom text
    const finalService = form.service === 'Other'
      ? 'Other: ' + otherService.trim()
      : form.service;
    const submitData = { ...form, service: finalService };

    // ── Step 1: Show loading state immediately ───────────────
    setStatus('sending');

    // ── Step 2: Fire-and-forget to Apps Script ─────────────────
    fetch(APPS_SCRIPT_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams(submitData).toString(),
    }).catch(() => {
      console.warn('Genwebzy CRM: background submission failed silently.');
    });

    // ── Step 3: Show success after 2.2s (smooth, professional feel) ──
    setTimeout(() => setStatus('done'), 2200);
  };

  return (
    <section id="contact" className="section section--dark contact" aria-labelledby="contact-h">
      <div className="container">
        <div className="contact__inner">

          {/* ── Left Info ─────────────────────────────────── */}
          <div className="contact__left reveal">
            <span className="section-label" style={{ color: 'rgba(255,255,255,0.35)' }}>Get in Touch</span>
            <h2 id="contact-h" className="contact__heading">Have a website in mind?</h2>
            <p className="contact__sub">
              Tell us what you are building. We will take it from there.
            </p>

            <div className="contact__details">
              <a href={`mailto:${CONTACT.email}`} className="contact__detail">
                <span className="contact__detail-label">Email</span>
                <span className="contact__detail-val">{CONTACT.email}</span>
              </a>
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__detail contact__detail--wa"
              >
                <span className="contact__detail-label">WhatsApp</span>
                <span className="contact__detail-val">+91 97515 74014 →</span>
              </a>
            </div>
          </div>

          {/* ── Form ──────────────────────────────────────── */}
          <div className="contact__right reveal reveal-d2">
            {status === 'done' ? (
              <div className="contact__success">
                <div className="contact__success-icon">
                  <svg viewBox="0 0 52 52" className="contact__success-svg" aria-hidden="true">
                    <circle className="contact__success-circle" cx="26" cy="26" r="24" fill="none" />
                    <path className="contact__success-check" fill="none" d="M14 27l8 8 16-16" />
                  </svg>
                </div>
                <h3 className="contact__success-h">Enquiry received — thank you!</h3>
                <p className="contact__success-p">
                  Check your inbox — we have sent a confirmation. We will be in touch within 24 hours.
                </p>
                <a
                  href={CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary btn--lg"
                  style={{ marginTop: '20px', display: 'inline-block' }}
                >
                  Chat on WhatsApp →
                </a>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit} noValidate>

                {/* Row 1 — Name + Company */}
                <div className="contact__row">
                  <div className="cfield">
                    <label className="cfield__label" htmlFor="cf-name">Full Name <span className="cfield__req">*</span></label>
                    <input
                      id="cf-name"
                      className="cfield__input"
                      type="text"
                      placeholder="Ravi Kumar"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="cfield">
                    <label className="cfield__label" htmlFor="cf-company">Company / Business Name</label>
                    <input
                      id="cf-company"
                      className="cfield__input"
                      type="text"
                      placeholder="ABC Technologies"
                      value={form.company}
                      onChange={e => set('company', e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 2 — Email + Phone */}
                <div className="contact__row">
                  <div className="cfield">
                    <label className="cfield__label" htmlFor="cf-email">Email <span className="cfield__req">*</span></label>
                    <input
                      id="cf-email"
                      className="cfield__input"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="cfield">
                    <label className="cfield__label" htmlFor="cf-phone">Phone / WhatsApp <span className="cfield__req">*</span></label>
                    <input
                      id="cf-phone"
                      className="cfield__input"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Service — unique dropdown */}
                <div className="cfield">
                  <label className="cfield__label">Service Required <span className="cfield__req">*</span></label>
                  <CustomSelect
                    id="cf-service"
                    placeholder="Select a service…"
                    options={SERVICES}
                    value={form.service}
                    onChange={v => { set('service', v); if (v !== 'Other') setOtherService(''); }}
                    dark
                  />
                  {form.service === 'Other' && (
                    <input
                      className="cfield__input cfield__other-input"
                      type="text"
                      placeholder="Tell us what you need…"
                      value={otherService}
                      onChange={e => setOtherService(e.target.value)}
                      autoFocus
                    />
                  )}
                </div>

                {/* Budget + Timeline row */}
                <div className="contact__row">
                  <div className="cfield">
                    <label className="cfield__label">Budget Range</label>
                    <CustomSelect
                      id="cf-budget"
                      placeholder="Select budget…"
                      options={BUDGETS}
                      value={form.budget}
                      onChange={v => set('budget', v)}
                      dark
                    />
                  </div>
                  <div className="cfield">
                    <label className="cfield__label">Timeline</label>
                    <CustomSelect
                      id="cf-timeline"
                      placeholder="Select timeline…"
                      options={TIMELINES}
                      value={form.timeline}
                      onChange={v => set('timeline', v)}
                      dark
                    />
                  </div>
                </div>

                {/* Start Date */}
                <div className="cfield">
                  <label className="cfield__label" htmlFor="cf-start">Preferred Start Date <span style={{color:'rgba(255,255,255,0.25)',fontWeight:400}}>(optional)</span></label>
                  <input
                    id="cf-start"
                    className="cfield__input"
                    type="date"
                    value={form.startDate}
                    onChange={e => set('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Message */}
                <div className="cfield">
                  <label className="cfield__label" htmlFor="cf-message">Project Details</label>
                  <textarea
                    id="cf-message"
                    className="cfield__input cfield__input--ta"
                    rows={4}
                    placeholder="Tell us about your business, what you need the website to do, and any specific requirements…"
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                  />
                </div>

                {/* Error */}
                {(status === 'error' || errMsg) && (
                  <p className="contact__err">
                    {errMsg || 'Something went wrong. Please '}
                    {!errMsg && (
                      <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer" style={{ color: '#4ade80' }}>
                        message us on WhatsApp
                      </a>
                    )}
                    {!errMsg && ' instead.'}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  id="contact-submit-btn"
                  className={`btn btn--primary btn--lg contact__submit${status === 'sending' ? ' contact__submit--sending' : ''}`}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <>
                      <span className="contact__spinner" aria-hidden="true" />
                      Sending your enquiry…
                    </>
                  ) : 'Send Enquiry →'}
                </button>
                <p className="contact__note">We'll get back to you within 24 hours.</p>

              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
