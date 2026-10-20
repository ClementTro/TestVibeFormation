import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  {
    pct: 33,
    text: 'des Français·e·s utilisent l’intelligence artificielle — un chiffre qui monte à 77 % chez les 18-24 ans.',
  },
  { pct: 56, text: 'des Français·e·s n’ont pas confiance en l’intelligence artificielle.' },
  { pct: 85, text: 'des Français·e·s souhaitent développer leurs compétences numériques.' },
];

/**
 * « POURQUOI SENSIBILISER À L'IA ? » — bloc bleu nuit de la DA réelle :
 * compteurs + barres de données corail qui se remplissent au scroll.
 * Fallback statique si prefers-reduced-motion (rien n'est masqué en CSS).
 */
export default function Pourquoi() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      // compteurs
      const nums = gsap.utils.toArray('.ia-pq-num-val', root.current);
      nums.forEach((el, i) => {
        const target = STATS[i].pct;
        const obj = { val: 0 };
        el.textContent = '0';
        ScrollTrigger.create({
          trigger: el,
          start: 'top 84%',
          once: true,
          onEnter: () =>
            gsap.to(obj, {
              val: target,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = String(Math.round(obj.val));
              },
            }),
        });
      });
      // barres de données
      const bars = gsap.utils.toArray('.ia-pq-bar-fill', root.current);
      bars.forEach((el, i) => {
        gsap.set(el, { scaleX: 0, transformOrigin: '0% 50%' });
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () =>
            gsap.to(el, { scaleX: STATS[i].pct / 100, duration: 1.4, ease: 'power3.out' }),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="ia-pq" id="pourquoi" ref={root}>
      <div className="container">
        <span className="ia-kicker ia-kicker--light" data-reveal>
          Pourquoi sensibiliser à l’IA&nbsp;?
        </span>
        <h2 className="ia-sec-title ia-sec-title--light" data-reveal>
          Un besoin réel, une demande massive
        </h2>
        <p className="ia-pq-lead" data-reveal>
          Des Français·e·s en fort besoin et demande d’accompagnement sur un sujet
          aujourd’hui omniprésent.
        </p>

        <div className="ia-pq-grid">
          {STATS.map((s, i) => (
            <div className="ia-pq-card" key={i} data-reveal>
              <p className="ia-pq-num">
                <span className="ia-pq-num-val">{s.pct}</span>
                <span className="ia-pq-num-sign">%</span>
              </p>
              <div className="ia-pq-bar" aria-hidden="true">
                <div className="ia-pq-bar-fill" style={{ width: s.pct + '%' }} />
              </div>
              <p className="ia-pq-text">{s.text}</p>
            </div>
          ))}
        </div>

        <p className="ia-pq-src" data-reveal>
          <span className="ia-pq-src-label">Sources&nbsp;:</span> Baromètre du numérique 2025 ·
          Observatoire Pix des compétences numériques 2025
        </p>
      </div>
    </section>
  );
}
