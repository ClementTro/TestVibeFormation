import { BASE, THEMES } from '../data/themes.js';

export default function LandingFooter() {
  return (
    <footer className="ln-footer">
      <div className="container ln-footer-inner">
        <div className="ln-footer-brand">
          <span className="ln-logo-badge">JN✱</span>
          <span>
            Les Journées Nationales — vitrine de démonstration non officielle.
          </span>
        </div>

        <nav className="ln-footer-nav" aria-label="Plan du site">
          <a href={BASE}>Accueil</a>
          {THEMES.map((t) =>
            t.live ? (
              <a key={t.key} href={t.href}>
                {t.acronym}
              </a>
            ) : (
              <span key={t.key} className="is-soon" title="Bientôt disponible">
                {t.acronym}
              </span>
            )
          )}
        </nav>

        <span className="ln-footer-copy">© 2026 — Fait main, avec GSAP.</span>
      </div>
    </footer>
  );
}
