import { BASE } from '../../data/themes.js';

/**
 * Footer — les liens officiels du site : Contactez-nous !, LinkedIn,
 * Mentions légales, Politique de confidentialité, Politique de gestion
 * des cookies + retour à la vitrine.
 */
export default function SnpsFooter() {
  return (
    <footer className="sn-footer" id="contact">
      <div className="sn-container sn-footer-inner">
        <div className="sn-footer-brand">
          <span className="sn-logo-badge" aria-hidden="true">✚</span>
          <div className="sn-footer-brand-text">
            <strong>SNPS</strong>
            <span>Semaine Nationale de la Prévention Santé</span>
          </div>
        </div>

        <nav className="sn-footer-nav" aria-label="Liens du pied de page">
          <a href="mailto:contact@semaine-preventionsante.fr">Contactez-nous !</a>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="#contact">Mentions légales</a>
          <a href="#contact">Politique de confidentialité</a>
          <a href="#contact">Politique de gestion des cookies</a>
        </nav>

        <a href={BASE} className="sn-footer-vitrine">
          ← La vitrine
        </a>

        <p className="sn-footer-copy">
          © 2026 — Vitrine de démonstration non officielle, animée avec GSAP &amp; Lenis.
        </p>
      </div>
    </footer>
  );
}
