import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Chiffres officiels de la SNPS */
const STATS = [
  { target: 500, color: 'c1', text: 'animations partout en France' },
  { target: 15000, color: 'c2', text: 'participant·es aux initiatives et ateliers de prévention santé' },
  { target: 300, color: 'c3', text: 'organisations mobilisées tout au long de la Semaine Nationale de la Prévention Santé' },
];

function formatNumber(n) {
  return n.toLocaleString('fr-FR');
}

/** Petit tracé ECG décoratif (statique) sous chaque chiffre. */
function MiniEcg({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 24" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 12 H28 l3 -5 l3 5 H46 l5 -3 l4 10 l5 -16 l4 9 H120"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * « En chiffres » — compteurs animés au scroll, chacun relié à une
 * couleur du kit (jaune / cyan / magenta), avec sa ligne ECG.
 */
export default function SnpsStats() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const nums = gsap.utils.toArray('.sn-stat-num', root.current);
      nums.forEach((el, i) => {
        const target = STATS[i].target;
        if (reduced) {
          el.textContent = formatNumber(target);
          return;
        }
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
                el.textContent = formatNumber(Math.round(obj.val));
              },
            }),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sn-stats" id="chiffres" ref={root}>
      <div className="sn-container">
        <span className="sn-kicker sn-kicker--violet" data-reveal>
          En chiffres
        </span>
        <h2 className="sn-stats-title" data-reveal>
          La SNPS, c&rsquo;est…
        </h2>
        <div className="sn-stats-grid">
          {STATS.map((s, i) => (
            <div className="sn-stat" key={i} data-reveal>
              <span className={`sn-stat-num sn-stat-num--${s.color}`}>
                0
              </span>
              <MiniEcg className={`sn-stat-ecg sn-stat-ecg--${s.color}`} />
              <p className="sn-stat-text">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
