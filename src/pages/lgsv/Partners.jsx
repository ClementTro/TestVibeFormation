const GROUPS = [
  { label: 'Un événement organisé par', names: ['Make Org Foundation', 'AVF', 'InterVeg'] },
  { label: 'Nos mécènes', names: ['Ecotable', 'Réseau Action Climat'] },
  { label: 'Partenaires réseaux', names: ['oNav', 'Noé', 'RF — Je veux Aider'] },
  { label: 'Marques partenaires', names: ['Les Insatiables', 'Les Bouillonnantes'] },
  { label: 'Partenaires de la distribution alimentaire', names: ['Et vous ?'] },
];

export default function Partners() {
  return (
    <section className="lg-partners" id="partenaires">
      <div className="container">
        <span className="lg-kicker" data-reveal>
          Ils nous soutiennent
        </span>
        <h2 className="lg-title" data-reveal>
          Un écosystème qui <em className="lg-em">cultive</em> l’envie.
        </h2>

        <div className="lg-partner-groups">
          {GROUPS.map((g) => (
            <div className="lg-partner-group" data-reveal key={g.label}>
              <span className="lg-partner-label">{g.label}</span>
              <ul className="lg-partner-pills">
                {g.names.map((n) => (
                  <li
                    className={`lg-partner-pill ${n === 'Et vous ?' ? 'lg-partner-pill--dashed' : ''}`}
                    key={n}
                  >
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="lg-partners-close" data-reveal>
          La Grande Semaine Végétale est fondée grâce à celles et ceux qui font
          vivre l’alimentation végétale en France.
        </p>
        <p className="lg-partners-caption" data-reveal>
          Vitrine de démonstration — mentions illustratives, sans logo officiel.
        </p>
      </div>
    </section>
  );
}
