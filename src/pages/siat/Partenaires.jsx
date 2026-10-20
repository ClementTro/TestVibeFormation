const ORGANISATEURS = ['La MedNum', 'make.org Foundation', 'Café IA'];

const INVITES = [
  { group: 'Les mécènes', cta: 'Devenez mécène →', href: '#contact' },
  { group: 'Les partenaires', cta: 'Devenez partenaire →', href: '#contact' },
  { group: 'Les partenaires médias', cta: 'Devenez partenaire média →', href: '#contact' },
];

/**
 * « ILS ONT REJOINT L'AVENTURE » — la famille des organisateurs,
 * le haut marrainage (contenu réel du site), et des emplacements
 * « à rejoindre » pour mécènes, partenaires et médias.
 */
export default function Partenaires() {
  return (
    <section className="ia-part" id="aventure">
      <div className="container">
        <span className="ia-kicker" data-reveal>
          Rejoignez l’aventure
        </span>
        <h2 className="ia-sec-title" data-reveal>
          Ils ont rejoint l’aventure
        </h2>

        <div className="ia-part-group" data-reveal>
          <h3 className="ia-part-label">Les organisateurs</h3>
          <div className="ia-part-chips">
            {ORGANISATEURS.map((name) => (
              <span key={name} className="ia-chip">
                <span className="ia-chip-mark" aria-hidden="true">
                  ✦
                </span>
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="ia-part-group" data-reveal>
          <h3 className="ia-part-label">Les soutiens institutionnels</h3>
          <div className="ia-marrainage">
            <p>
              Sous le haut marrainage d’<strong>Anne Le Hénanff</strong>, Ministre déléguée
              auprès du ministre de l’Economie, des Finances et de la Souveraineté industrielle,
              énergétique et numérique, chargée de l’Intelligence artificielle et du Numérique.
            </p>
          </div>
        </div>

        {INVITES.map((g) => (
          <div className="ia-part-group" key={g.group} data-reveal>
            <h3 className="ia-part-label">{g.group}</h3>
            <div className="ia-part-chips">
              {[0, 1, 2].map((i) => (
                <a key={i} className="ia-chip ia-chip--join" href={g.href}>
                  {g.cta}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
