import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { icon: 'map', target: 1500, text: 'évènements organisés sur tout le territoire.' },
  {
    icon: 'chat',
    target: 50000,
    text: 'Français·e·s sensibilisé·e·s aux enjeux et usages de l’intelligence artificielle.',
  },
  { icon: 'people', target: 800, text: 'partenaires de l’ESS mobilisés.' },
];

function formatNumber(n) {
  return n.toLocaleString('fr-FR');
}

/* Petites illustrations « au trait » bleu nuit, comme sur le site réel */
const IconMap = () => (
  <svg viewBox="0 0 48 48" className="ia-chiffre-ic" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 38 L24 10 L38 30 L18 30" />
      <circle cx="10" cy="38" r="4" />
      <circle cx="24" cy="10" r="4" />
      <circle cx="38" cy="30" r="4" />
      <circle cx="18" cy="30" r="3" />
    </g>
  </svg>
);

const IconChat = () => (
  <svg viewBox="0 0 48 48" className="ia-chiffre-ic" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 8 h22 a4 4 0 0 1 4 4 v10 a4 4 0 0 1 -4 4 h-10 l-6 6 v-6 h-6 a4 4 0 0 1 -4 -4 v-10 a4 4 0 0 1 4 -4 z" />
      <path d="M20 38 h14 a4 4 0 0 0 4 -4 v-8" />
    </g>
  </svg>
);

const IconPeople = () => (
  <svg viewBox="0 0 48 48" className="ia-chiffre-ic" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="14" r="6" />
      <path d="M12 40 c0 -8 5 -12 12 -12 s12 4 12 12" />
      <circle cx="9" cy="21" r="4" />
      <path d="M3 40 c0 -5 2 -8 6 -9" />
      <circle cx="39" cy="21" r="4" />
      <path d="M45 40 c0 -5 -2 -8 -6 -9" />
    </g>
  </svg>
);

const ICONS = { map: IconMap, chat: IconChat, people: IconPeople };

/**
 * « EN CHIFFRES » — bloc jaune de la DA réelle, compteurs animés au scroll
 * (fallback statique : valeurs finales affichées d'office si motion réduite).
 */
export default function Chiffres() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray('.ia-chiffre-num', root.current);
      nums.forEach((el, i) => {
        const target = STATS[i].target;
        const obj = { val: 0 };
        el.textContent = '0';
        ScrollTrigger.create({
          trigger: el,
          start: 'top 82%',
          once: true,
          onEnter: () =>
            gsap.to(obj, {
              val: target,
              duration: 2,
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
    <section className="ia-chiffres" id="chiffres" ref={root}>
      <div className="container">
        <span className="ia-kicker" data-reveal>
          En chiffres
        </span>
        <h2 className="ia-sec-title" data-reveal>
          La Semaine de l’IA pour Tous, c’est…
        </h2>
        <div className="ia-chiffres-grid">
          {STATS.map((s, i) => {
            const Icon = ICONS[s.icon];
            return (
              <div className="ia-chiffre" key={i} data-reveal>
                {Icon ? <Icon /> : null}
                <span className="ia-chiffre-num">{formatNumber(s.target)}</span>
                <p>{s.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
