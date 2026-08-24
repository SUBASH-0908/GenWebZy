import { useState, useEffect } from 'react';
import './Navbar.css';

const NAV = [
  { label: 'Demos',    href: '#demos' },
  { label: 'Services', href: '#services' },
  { label: 'Work',     href: '#work' },
  { label: 'Process',  href: '#process' },
  { label: 'About',    href: '#about' },
  { label: 'Pricing',  href: '#pricing' },
  { label: 'Reviews',  href: '#reviews' },
  { label: 'FAQ',      href: '#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', s, { passive: true });
    return () => window.removeEventListener('scroll', s);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
        <div className="navbar__inner container">
          <a href="#home" className="navbar__logo" onClick={close} aria-label="Genwebzy home">
            <img
              src="/logo.png"
              alt="Genwebzy"
              className="navbar__logo-img"
            />
          </a>
          <nav className="navbar__nav" aria-label="Main navigation">
            {NAV.map(l => (
              <a
                key={l.href}
                href={l.href}
                className={`navbar__link${active === l.href.slice(1) ? ' navbar__link--active' : ''}`}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="navbar__right">
            <a href="#contact" className="btn btn--primary btn--sm navbar__cta">
              Start a Project
            </a>
            <button
              className={`navbar__hamburger${open ? ' navbar__hamburger--open' : ''}`}
              onClick={() => setOpen(v => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu${open ? ' mobile-menu--open' : ''}`} role="dialog" aria-hidden={!open}>
        <nav className="mobile-menu__nav">
          <a href="#home"    className="mobile-menu__link" onClick={close}>Home</a>
          <a href="#demos"   className="mobile-menu__link" onClick={close}>Demos</a>
          <a href="#services"className="mobile-menu__link" onClick={close}>Services</a>
          <a href="#work"    className="mobile-menu__link" onClick={close}>Work</a>
          <a href="#process" className="mobile-menu__link" onClick={close}>Process</a>
          <a href="#about"   className="mobile-menu__link" onClick={close}>About</a>
          <a href="#pricing" className="mobile-menu__link" onClick={close}>Pricing</a>
          <a href="#faq"     className="mobile-menu__link" onClick={close}>FAQ</a>
          <a href="#contact" className="btn btn--primary mobile-menu__cta" onClick={close}>
            Start a Project
          </a>
        </nav>
        <div className="mobile-menu__foot">
          <img src="/logo.png" alt="Genwebzy" className="mobile-menu__foot-img" height="36" />
        </div>
      </div>
      {open && <div className="mobile-overlay" onClick={close} aria-hidden="true" />}
    </>
  );
}
