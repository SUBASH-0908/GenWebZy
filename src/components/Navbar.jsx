import { useState, useEffect } from 'react';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Demos', href: '#demos' },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="banner">
        <div className="navbar__inner container">
          {/* Logo */}
          <a href="#home" className="navbar__logo" onClick={closeMenu} aria-label="GenWebZy home">
            <img src="/logo.png" alt="GenWebZy" className="navbar__logo-img" />
          </a>

          {/* Desktop nav */}
          <nav className="navbar__nav" aria-label="Main navigation">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="navbar__link">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right CTA */}
          <div className="navbar__right">
            <a href="#contact" className="btn btn--primary btn--sm navbar__cta">
              Start a Project
            </a>
            <button
              className={`navbar__hamburger${menuOpen ? ' navbar__hamburger--open' : ''}`}
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`mobile-menu${menuOpen ? ' mobile-menu--open' : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <nav className="mobile-menu__nav">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="mobile-menu__link"
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
          <a href="#contact" className="btn btn--primary mobile-menu__cta" onClick={closeMenu}>
            Start a Project
          </a>
        </nav>
        <div className="mobile-menu__logo">
          <img src="/logo.png" alt="GenWebZy" />
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div className="mobile-overlay" onClick={closeMenu} aria-hidden="true" />
      )}
    </>
  );
}
