import { BASE } from '../../data/themes.js';

const LINKS = [
  { label: 'Organiser un événement', href: '#organiser' },
  { label: 'Soutenir l’événement', href: '#aventure' },
];

/**
 * Pied de page SIAT — bleu nuit profond, liens de service (comme le site
 * réel) et retour vers la vitrine globale.
 */
export default function Footer() {
  return (
    <footer className="ia-footer" id="contact">
      <div className="container ia-footer-grid">
        <div className="ia-footer-brand">
          <span className="ia-logo ia-logo--footer">
            <span className="ia-logo-line">Semaine</span>
            <span className="ia-logo-line ia-logo-line--hl">de l&rsquo;IA</span>
            <span className="ia-logo-line">pour tous</span>
          </span>
          <p className="ia-footer-tag">
            Une semaine pour découvrir l&rsquo;intelligence artificielle près de chez vous.
          </p>
          <p className="ia-footer-date">Du 18 au 24 mai 2026</p>
        </div>

        <nav className="ia-footer-nav" aria-label="Liens de service">
          {LINKS.map((l) => (
            <a key={l.href + l.label} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href="#" onClick={(e) => e.preventDefault()}>
            Espace presse
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Kit de communication
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Mentions légales
          </a>
        </nav>

        <a className="ia-footer-back" href={BASE}>
          <span className="ia-footer-back-arrow" aria-hidden="true">
            ←
          </span>
          Retour à la vitrine
        </a>
      </div>

      <div className="container ia-footer-bottom">
        <span>
          © 2026 La Semaine de l&rsquo;IA pour Tous — vitrine de démonstration non officielle,
          DA inspirée de semaine-ia.fr.
        </span>
      </div>
    </footer>
  );
}
