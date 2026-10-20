import { useEffect, useState } from 'react';
import { BASE } from '../../data/themes.js';

const LINKS = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Événements', href: '#chiffres' },
  { label: 'Manifeste', href: '#manifeste' },
  { label: 'Organiser un événement', href: '#organiser' },
  { label: "Soutenir l'événement", href: '#aventure' },
  { label: 'Nos actus', href: '#newsletter' },
  { label: 'Contactez-nous', href: '#contact' },
];

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
          {LINKS.map((l) => (
            <a key={l.href + l.label} href={l.href} className="ia-nav-link">
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#organiser" className="ia-btn ia-btn--sm ia-header-cta">
          Proposer mon évènement
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
          {LINKS.map((l) => (
            <a key={l.href + l.label} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#organiser" className="ia-btn" onClick={() => setOpen(false)}>
            Proposer mon évènement
          </a>
        </nav>
      </div>
    </header>
  );
}
