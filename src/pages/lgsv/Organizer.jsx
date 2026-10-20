const BENEFITS = [
  {
    title: 'Visibilité',
    text: 'Votre événement rejoint le programme officiel, consulté partout en France pendant dix jours.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3C7 8 5.5 14 5.5 19c2-3.5 4-5 6.5-5s4.5 1.5 6.5 5C18.5 14 17 8 12 3Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M12 8v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Kits de communication',
    text: 'Des kits numériques et/ou imprimés prêts à l’emploi pour annoncer votre événement autour de vous.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="7" width="16" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.5 7V5.5A2 2 0 0 1 10.5 3.5h3A2 2 0 0 1 15.5 5.5V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9.5 12h5M12 9.5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Amplification',
    text: 'Votre animation est portée par la campagne nationale — relais, réseaux et écho médiatique.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 10v4h3l6 4V6L7 10H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M16.5 9.5a4 4 0 0 1 0 5M19 7a7.5 7.5 0 0 1 0 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Organizer() {
  return (
    <section className="lg-orga" id="organisateur">
      <div className="container">
        <div className="lg-orga-panel" data-reveal>
          <span className="lg-kicker">Espace organisateur</span>
          <h2 className="lg-title">
            Pourquoi inscrire <em className="lg-em">son événement</em> ?
          </h2>
          <p className="lg-lead">
            En quelques minutes, inscrivez votre animation sur Airtable et profitez
            gratuitement de :
          </p>

          <div className="lg-benefits">
            {BENEFITS.map((b, i) => (
              <article className="lg-benefit" data-reveal key={b.title}>
                <span className="lg-benefit-icon" aria-hidden="true">
                  {b.icon}
                </span>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </article>
            ))}
          </div>

          <div className="lg-orga-cta" data-reveal>
            <a
              className="lg-btn lg-btn--lime lg-btn--big"
              href="https://lagrandesemainevegetale.fr/"
              target="_blank"
              rel="noreferrer"
            >
              Inscrire mon événement — c’est gratuit ↗
            </a>
            <p className="lg-orga-note">
              Inscription via Airtable. Une question, un coup de main ?{' '}
              <a href="#contact" className="lg-inline-link">
                Écrivez-nous
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
