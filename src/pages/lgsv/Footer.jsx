import { BASE } from '../../data/themes.js';

const NAV = [
  { label: 'Le projet', href: '#projet' },
  { label: 'Espace organisateur', href: '#organisateur' },
  { label: 'Actualités', href: '#actualites' },
  { label: 'Le livret', href: '#livret' },
];

export default function Footer() {
  return (
    <footer className="lg-footer" id="contact">
      <div className="container lg-footer-inner">
        <div className="lg-footer-brand">
          <span className="lg-logo-badge lg-logo-badge--invert">LGSV</span>
          <p className="lg-footer-tag">
            La Grande Semaine Végétale — du 25 septembre au 4 octobre 2026.
            Organisée par AVF, Make Org Foundation et InterVeg.
          </p>
        </div>

        <nav className="lg-footer-nav" aria-label="Plan de la page">
          {NAV.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href="https://lagrandesemainevegetale.fr/" target="_blank" rel="noreferrer">
            Site officiel ↗
          </a>
        </nav>

        <div className="lg-footer-meta">
          <a href={BASE} className="lg-footer-vitrine">
            ← La vitrine des rendez-vous nationaux
          </a>
          <span className="lg-footer-copy">
            © 2026 — Vitrine de démonstration non officielle, animée avec GSAP.
          </span>
        </div>
      </div>
    </footer>
  );
}
