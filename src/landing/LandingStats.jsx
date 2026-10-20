import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { target: 4, suffix: '', text: 'rendez-vous nationaux réunis sous une même bannière' },
  { target: 500, suffix: '+', text: "ateliers ouverts partout en France dès la première édition" },
  { target: 80, suffix: '%', text: 'des participant·es changent leur regard sur la réparation' },
  { target: 2026, suffix: '', text: "l'année où tout commence — et rien ne s'arrête plus" },
];

function formatNumber(n) {
  return n.toLocaleString('fr-FR');
}

export default function LandingStats() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray('.ln-stat-num', root.current);
      nums.forEach((el, i) => {
        const target = STATS[i].target;
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 82%',
          once: true,
          onEnter: () =>
            gsap.to(obj, {
              val: target,
              duration: 1.9,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = formatNumber(Math.round(obj.val)) + STATS[i].suffix;
              },
            }),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="ln-stats" ref={root}>
      <div className="container">
        <span className="ln-kicker" data-reveal>
          Le mouvement en chiffres
        </span>
        <div className="ln-stats-grid">
          {STATS.map((s, i) => (
            <div className="ln-stat" key={i} data-reveal>
              <span className="ln-stat-num">
                0{s.suffix}
              </span>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
