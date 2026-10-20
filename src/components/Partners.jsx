const ROW_1 = [
  'France Travail',
  'HOP',
  'Emmaüs France',
  'Colibris',
  'Low-Tech',
  'Ecosystem',
  'ReFashion',
  'MAIF',
];

const ROW_2 = [
  'Leboncoin',
  'Darty',
  'April',
  'Envie',
  'Spareka',
  'Repair Day',
  'Fête des possibles',
  'Fresque du numérique',
];

function MarqueeRow({ items, reverse = false }) {
  // Liste dupliquée pour une boucle parfaitement continue
  const doubled = [...items, ...items];
  return (
    <div className={`marquee ${reverse ? 'marquee--reverse' : ''}`}>
      <div className="marquee-track">
        {doubled.map((name, i) => (
          <span className="partner-pill" key={i}>
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Partners() {
  return (
    <section className="section partners" id="partenaires">
      <div className="container">
        <span className="kicker" data-reveal>
          Ils nous soutiennent
        </span>
        <h2 className="section-title" data-reveal>
          Un événement soutenu par
        </h2>
      </div>
      <div style={{ marginTop: 40 }} data-reveal>
        <MarqueeRow items={ROW_1} />
        <MarqueeRow items={ROW_2} reverse />
      </div>
    </section>
  );
}