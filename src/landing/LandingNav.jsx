import { BASE, THEMES } from '../data/themes.js';

/**
 * Navbar de la vitrine (style "nuit" : fond noir, accents menthe/jaune).
 * Chaque page thématique garde SA propre navbar stylée — celle-ci n'est
 * utilisée que sur la page d'accueil globale.
 */
export default function LandingNav() {
  return (
    <header className="ln-header">
      <div className="ln-header-inner">
        <a href={BASE} className="ln-logo" aria-label="Retour à la vitrine">
          <span className="ln-logo-badge">JN✱</span>
          <span className="ln-logo-text">Les Journées Nationales</span>
        </a>

        <nav className="ln-nav" aria-label="Navigation principale">
          {THEMES.map((t) =>
            t.live ? (
              <a key={t.key} href={t.href} className="ln-nav-link">
                {t.acronym}
                <sup className="ln-live-dot" aria-hidden="true" />
              </a>
            ) : (
              <span key={t.key} className="ln-nav-link is-soon" title="Bientôt disponible">
                {t.acronym}
              </span>
            )
          )}
        </nav>

        <a href={`${BASE}jnr`} className="ln-cta">
          Trouver un événement
        </a>
      </div>
    </header>
  );
}
