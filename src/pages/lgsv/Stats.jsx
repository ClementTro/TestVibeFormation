import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Vine from './Vine.jsx';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 8, prefix: '+ de ', suffix: 'M', label: 'personnes touchées' },
  { value: 50, prefix: '+ de ', suffix: '', label: 'partenaires' },
  { value: 60000, prefix: '', suffix: '', label: 'participants' },
  { value: 590, prefix: '', suffix: '', label: 'événements partout en France' },
];

function formatNumber(n) {
  return n.toLocaleString('fr-FR');
}

export default function Stats() {
  const root = useRef(null);

  // Compteurs animés à l'entrée dans le viewport
  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray('.lg-stat-num', root.current);
      nums.forEach((el, i) => {
        const { value, prefix, suffix } = STATS[i];
        el.textContent = prefix + formatNumber(value) + suffix;
        if (reduced) return;
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 82%',
          once: true,
          onEnter: () =>
            gsap.to(obj, {
              val: value,
              duration: 1.9,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = prefix + formatNumber(Math.round(obj.val)) + suffix;
              },
            }),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="lg-stats" id="actualites" ref={root}>
      <Vine side="left" seed={21} stem="#d5f683" leaf="#fff1ba" className="lg-vine--stats" />
      <Vine side="right" seed={42} stem="#d5f683" leaf="#d5f683" className="lg-vine--stats" />
      <div className="container">
        <span className="lg-kicker lg-kicker--invert" data-reveal>
          L’édition 2025 en chiffres
        </span>
        <h2 className="lg-title" data-reveal>
          Un enthousiasme <em className="lg-em">national</em>.
        </h2>
        <div className="lg-stats-grid">
          {STATS.map((s, i) => (
            <div className="lg-stat" key={i} data-reveal>
              <span className="lg-stat-num">
                {s.prefix}0{s.suffix}
              </span>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
        <div className="lg-stats-report" data-reveal>
          <a
            className="lg-report-link"
            href="https://lagrandesemainevegetale.fr/"
            target="_blank"
            rel="noreferrer"
          >
            Consulter le Reporting 2025 ↗
          </a>
        </div>
      </div>
    </section>
  );
}
