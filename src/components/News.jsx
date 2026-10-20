const ARTICLES = [
  {
    title: 'La métropole de Lyon passe en mode réparation pour les JNR 2026 🛠️',
    date: '12 octobre 2026',
    org: 'Contact HOP',
  },
  {
    title: 'La SERD 2026 : 9 jours d’actions partagées pour toujours moins de déchets !',
    date: '9 octobre 2026',
    org: 'Contact HOP',
  },
  {
    title: 'De la sensibilisation au passage à l’action',
    date: '8 octobre 2026',
    org: 'Contact HOP',
  },
];

export default function News() {
  return (
    <section className="section" id="actualites">
      <div className="container">
        <div className="news-head" data-reveal>
          <h2 className="section-title">À la une</h2>
          <a href="#" className="news-link">
            Découvrir tous les articles →
          </a>
        </div>

        <div className="news-grid">
          {ARTICLES.map((a, i) => (
            <article className="card" key={i} data-reveal>
              <span className="card-tag">Actualités</span>
              <h3>{a.title}</h3>
              <p className="card-meta">
                {a.org} · {a.date}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}