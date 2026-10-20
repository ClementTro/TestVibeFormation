/**
 * « Ils nous accompagnent » — les catégories du site officiel :
 * organisateurs, partenaires fondateurs, partenaire associé (Astek),
 * partenaires soutiens, partenaires réseau, acteurs ressources.
 * Wordmarks typographiques illustratifs (vitrine de démonstration).
 */
const GROUPS = [
  { title: 'Les organisateurs', items: ['SNPS ✚', 'Prévention & Territoires'] },
  { title: 'Les partenaires fondateurs', items: ['Santé+ France', 'Vitalia', 'Oméga Prévention'] },
  { title: 'Le partenaire associé', featured: 'Astek', note: 'partenaire associé de la SNPS' },
  { title: 'Les partenaires soutiens', items: ['Mutuelle Cœur', 'Pharma+ Réseau', 'Bien-Vivre.fr', 'Omni Santé'] },
  { title: 'Les partenaires réseau', items: ['France Santé Ensemble', 'Réseau Prévention 300', 'Ateliers Citoyens', 'Territoires & Santé'] },
  { title: 'Les acteurs ressources', items: ['Santé Publique+', 'La Pause Santé', 'Réseau Prévention'] },
];

export default function SnpsPartners() {
  return (
    <section className="sn-partners" id="soutiens">
      <div className="sn-container">
        <span className="sn-kicker sn-kicker--ink" data-reveal>
          Ils nous accompagnent
        </span>
        <h2 className="sn-partners-title" data-reveal>
          Un écosystème mobilisé
        </h2>
        <p className="sn-partners-lead" data-reveal>
          Organisateurs, fondateurs, soutiens, réseaux et acteurs ressources&nbsp;:
          toute une chaîne qui fait battre le cœur de la prévention.
        </p>

        <div className="sn-partners-groups">
          {GROUPS.map((g) => (
            <div className="sn-partner-group" key={g.title} data-reveal>
              <h3 className="sn-partner-title">{g.title}</h3>
              {g.featured ? (
                <div className="sn-pill sn-pill--featured">
                  <span className="sn-pill-mark">Astek</span>
                  <span className="sn-pill-note">{g.note}</span>
                </div>
              ) : (
                <div className="sn-pills">
                  {g.items.map((item) => (
                    <span className="sn-pill" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="sn-partners-note" data-reveal>
          Wordmarks illustratifs — vitrine de démonstration non officielle.
          Astek, partenaire de la SNPS.
        </p>
      </div>
    </section>
  );
}
