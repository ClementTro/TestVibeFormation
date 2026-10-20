import { useEffect, useState } from 'react';
import { BASE, THEMES } from '../../data/themes.js';

// Contenu navbar = même contenu que la HOME : la famille de rendez-vous.
// Aucune ancre — la page courante (SIAT) est marquée « vous y êtes ».
const PAGE_KEY = 'siat';
const OFFICIAL_SITE = 'https://semaine-ia.fr/';

/**
 * Navbar SIAT : bandeau bleu nuit collant, logo empilé « à la DA »
 * (la ligne « DE L'IA » tamponnée corail), CTA « Proposer mon évènement ».
 * Sur mobile : burger → panneau plein écran.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);

  // Bloque le scroll de fond quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="ia-header">
      <div className="container ia-header-inner">
        <a href={BASE} className="ia-logo" aria-label="Retour à la vitrine">
          <span className="ia-logo-line">Semaine</span>
          <span className="ia-logo-line ia-logo-line--hl">de l&rsquo;IA</span>
          <span className="ia-logo-line">pour tous</span>
        </a>

        <nav className="ia-nav" aria-label="Navigation principale">
          {THEMES.map((t) =>
            t.key === PAGE_KEY ? (
              <span key={t.key} className="ia-nav-link is-active" aria-current="page" title="Vous y êtes">
                {t.acronym}
              </span>
            ) : t.live ? (
              <a key={t.key} href={t.href} className="ia-nav-link">
                {t.acronym}
              </a>
            ) : (
              <span key={t.key} className="ia-nav-link is-soon" title="Bientôt disponible">
                {t.acronym}
              </span>
            )
          )}
        </nav>

        <a href={OFFICIAL_SITE} target="_blank" rel="noopener noreferrer" className="ia-btn ia-btn--sm ia-header-cta">
          Proposer mon évènement ↗
        </a>

        <button
          type="button"
          className={`ia-burger${open ? ' is-open' : ''}`}
          aria-expanded={open}
          aria-controls="ia-mobile-menu"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="ia-mobile-menu" className={`ia-mobile${open ? ' is-open' : ''}`}>
        <nav className="ia-mobile-nav" aria-label="Navigation mobile">
          {THEMES.map((t) =>
            t.key === PAGE_KEY ? (
              <span key={t.key} className="is-active" aria-current="page" title="Vous y êtes">
                {t.acronym}
              </span>
            ) : t.live ? (
              <a key={t.key} href={t.href}>
                {t.acronym}
              </a>
            ) : (
              <span key={t.key} className="is-soon" title="Bientôt disponible">
                {t.acronym}
              </span>
            )
          )}
          <a href={OFFICIAL_SITE} target="_blank" rel="noopener noreferrer" className="ia-btn">
            Proposer mon évènement ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
