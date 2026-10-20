// Contenu de la navbar = contenu exact du site officiel
// (les ancres pointent vers les sections correspondantes de la démo)
import { BASE, THEMES } from '../../data/themes.js';

// Contenu navbar = même contenu que la HOME : la famille de rendez-vous.
// Aucune ancre — la page courante (SNPS) est marquée « vous y êtes ».
const PAGE_KEY = 'snps';

/**
 * Navbar SNPS — DA du site officiel : violet #6746F2, croix ✚, Sora.
 */
export default function SnpsNav() {
  return (
    <header className="sn-header">
      <div className="sn-header-inner">
        <a href={BASE} className="sn-logo" aria-label="SNPS — Semaine Nationale de la Prévention Santé, retour à la vitrine">
          <span className="sn-logo-badge" aria-hidden="true">✚</span>
          <span className="sn-logo-text">SNPS</span>
        </a>

        <nav className="sn-nav" aria-label="Navigation principale">
          {THEMES.map((t) =>
            t.key === PAGE_KEY ? (
              <span key={t.key} className="sn-nav-link is-active" aria-current="page" title="Vous y êtes">
                {t.acronym}
              </span>
            ) : t.live ? (
              <a key={t.key} href={t.href} className="sn-nav-link">
                {t.acronym}
              </a>
            ) : (
              <span key={t.key} className="sn-nav-link is-soon" title="Bientôt disponible">
                {t.acronym}
              </span>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
