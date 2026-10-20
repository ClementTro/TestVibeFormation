const ITEMS = [
  'nutrition',
  'activité physique',
  'santé mentale',
  'sommeil',
  'santé environnementale',
  'du 1er au 7 juin 2026',
  'partout en France',
];

/** Bandeau défilant infini sous le hero — thématiques séparées par des croix ✚. */
export default function SnpsMarquee() {
  const group = (hidden) => (
    <div className="sn-mq-group" aria-hidden={hidden || undefined}>
      {ITEMS.map((item, i) => (
        <span key={i} className={i % 2 ? 'sn-mq-plus' : ''}>
          {i % 2 ? '✚' : item}
        </span>
      ))}
    </div>
  );
  return (
    <div className="sn-mq" aria-hidden="true">
      <div className="sn-mq-track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
