/** Bandeau défilant infini (deux copies pour une boucle parfaite). */
export default function Marquee({ items, variant = '' }) {
  const group = (hidden) => (
    <div className="lg-mq-group" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className={i % 2 ? 'lg-mq-flower' : ''}>
          {i % 2 ? '✿' : item}
        </span>
      ))}
    </div>
  );
  return (
    <div className={`lg-mq ${variant}`.trim()} aria-hidden="true">
      <div className="lg-mq-track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
