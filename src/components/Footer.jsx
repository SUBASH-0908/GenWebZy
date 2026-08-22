import { CONTACT } from '../data/siteData';
import './Footer.css';

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

const SERVICE_LINKS = [
  'Business Websites',
  'Portfolio Websites',
  'Landing Pages',
  'E-Commerce',
  'Custom Development',
  'Website Maintenance',
];

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export default function Footer() {
  const socialLinks = [
    { href: CONTACT.instagram, Icon: InstagramIcon, label: 'Instagram', placeholder: 'INSTAGRAM' },
    { href: CONTACT.linkedin, Icon: LinkedInIcon, label: 'LinkedIn', placeholder: 'LINKEDIN' },
    { href: CONTACT.github, Icon: GitHubIcon, label: 'GitHub', placeholder: 'GITHUB' },
  ].filter(s => !s.href.startsWith(s.placeholder));

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer__main">
          {/* Brand */}
          <div className="footer__brand">
            <a href="#home" aria-label="GenWebZy home" className="footer__wordmark">
              <span className="footer__wordmark-gen">Gen</span><span className="footer__wordmark-web">Web</span><span className="footer__wordmark-zy">Zy</span>
            </a>
            <p className="footer__tagline">Your Ideas. Our Code. Your Success.</p>
            <p className="footer__design-tag">Design&ensp;•&ensp;Develop&ensp;•&ensp;Deploy</p>
            {socialLinks.length > 0 && (
              <div className="footer__socials">
                {socialLinks.map(({ href, Icon, label }) => (
                  <a
                    key={label} href={href} target="_blank"
                    rel="noopener noreferrer"
                    className="footer__social" aria-label={label}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="footer__nav-col" aria-label="Footer navigation">
            <h3 className="footer__col-heading">Navigation</h3>
            <ul className="footer__links">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="footer__link">{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div className="footer__nav-col">
            <h3 className="footer__col-heading">Services</h3>
            <ul className="footer__links">
              {SERVICE_LINKS.map(s => (
                <li key={s}>
                  <a href="#services" className="footer__link">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer__nav-col">
            <h3 className="footer__col-heading">Contact</h3>
            <ul className="footer__links footer__contact-links">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="footer__link">
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer" className="footer__link">
                  WhatsApp: {CONTACT.whatsapp}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">© 2026 GenWebZy. All rights reserved.</p>
          <p className="footer__bottom-tag">Design&ensp;•&ensp;Develop&ensp;•&ensp;Deploy</p>
        </div>
      </div>
    </footer>
  );
}
