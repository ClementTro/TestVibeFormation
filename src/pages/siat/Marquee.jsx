const ITEMS = [
  'Semaine de l’IA pour tous',
  'Du 18 au 24 mai 2026',
  '1 500 évènements',
  '50 000 Français·e·s',
  '800 partenaires',
  'Partout en France',
];

/**
 * Bandeau défilant corail sous le hero (deux copies pour une boucle parfaite).
 * S'arrête proprement si prefers-reduced-motion (voir styles.css).
 */
export default function Marquee() {
  const group = (hidden) => (
    <div className="ia-mq-group" aria-hidden={hidden || undefined}>
      {ITEMS.map((item, i) => (
        <span key={i} className={i % 2 ? 'ia-mq-star' : 'ia-mq-item'}>
          {i % 2 ? '✦' : item}
        </span>
      ))}
    </div>
  );
  return (
    <div className="ia-mq" aria-hidden="true">
      <div className="ia-mq-track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
