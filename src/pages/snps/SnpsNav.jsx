// Contenu de la navbar = contenu exact du site officiel
// (les ancres pointent vers les sections correspondantes de la démo)
const LINKS = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Manifeste', href: '#manifeste' },
  { label: 'Réferencer un événement', href: '#participer' },
  { label: 'Participer à un événement', href: '#thematiques' },
  { label: 'Ils nous soutiennent', href: '#soutiens' },
  { label: 'Contactez-nous !', href: '#contact' },
];

/**
 * Navbar SNPS — DA du site officiel : violet #6746F2, croix ✚, Sora.
 */
export default function SnpsNav() {
  return (
    <header className="sn-header">
      <div className="sn-header-inner">
        <a href="#accueil" className="sn-logo" aria-label="SNPS — Semaine Nationale de la Prévention Santé, retour en haut">
          <span className="sn-logo-badge" aria-hidden="true">✚</span>
          <span className="sn-logo-text">SNPS</span>
        </a>

        <nav className="sn-nav" aria-label="Navigation principale">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="sn-nav-link">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
