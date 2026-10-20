import { BASE, THEMES } from '../data/themes.js';

const SOCIAL_ICONS = {
  facebook: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#101010" strokeWidth="2.5">
      <path d="M15 3h-3a4 4 0 0 0-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  linkedin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#101010">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z" />
    </svg>
  ),
  instagram: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#101010" strokeWidth="2.5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="#101010" />
    </svg>
  ),
};

/**
 * Navbar de la page JNR (style menthe néo-brutaliste, inchangé).
 * Les liens pointent désormais vers la famille de rendez-vous :
 * JNR = page courante, les autres = bientôt disponibles.
 * Le logo ramène à la grande vitrine (page d'accueil globale).
 */
export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <a href={BASE} className="logo" title="Retour à la vitrine">
          <span className="logo-badge">JNR</span>
          <span>Réparation</span>
        </a>

        <nav className="nav" aria-label="Navigation principale">
          {THEMES.map((t) =>
            t.live ? (
              <a key={t.key} href="#accueil" className="is-active" title="Vous y êtes">
                {t.acronym}
              </a>
            ) : (
              <span key={t.key} className="is-soon" title="Bientôt disponible">
                {t.acronym}
              </span>
            )
          )}
        </nav>

        <div className="socials">
          <a href="#" aria-label="Facebook">
            {SOCIAL_ICONS.facebook}
          </a>
          <a href="#" aria-label="LinkedIn">
            {SOCIAL_ICONS.linkedin}
          </a>
          <a href="#" aria-label="Instagram">
            {SOCIAL_ICONS.instagram}
          </a>
        </div>

        <a href="#newsletter" className="btn header-cta">
          Trouver un événement
        </a>
      </div>
    </header>
  );
}
