import { THEMES } from '../data/themes.js';

const ITEMS = [
  ...THEMES.map((t) => t.acronym),
  'Réparer, c’est déjà agir',
  'Édition 2026',
  'Toute la France',
];

/** Bandeau défilant infini sous le hero (deux copies pour une boucle parfaite). */
export default function Marquee() {
  const group = (hidden) => (
    <div className="ln-mq-group" aria-hidden={hidden || undefined}>
      {ITEMS.map((item, i) => (
        <span key={i} className={i % 2 ? 'ln-mq-star' : ''}>
          {i % 2 ? '✱' : item}
        </span>
      ))}
    </div>
  );
  return (
    <div className="ln-mq" aria-hidden="true">
      <div className="ln-mq-track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
