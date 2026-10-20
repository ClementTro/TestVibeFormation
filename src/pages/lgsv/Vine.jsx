import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ---------- Génération déterministe (vigne stable entre renders) ---------- */

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const VB_W = 70;
const VB_H = 300;
const STEPS = 48;

// Feuille locale : point d'attache en (0,0), limbe balayé vers +x
const LEAF_BODY = 'M0 0 C 8 3 16 2 21 -5 C 15 -11 6 -9 0 0 Z';
const LEAF_RIB = 'M1.5 -0.5 C 7 -2 13 -3.5 19.5 -5.5';
// Vrille : petit crochet spiralé
const TENDRIL = 'M0 0 C 5 0 8 3 6 6 C 4 8.5 0.5 8 0.5 5.5 C 0.5 3.5 3 3 4 4.5';

function buildVine(seed) {
  const r = rng(seed);
  const phase = r() * Math.PI * 2;
  const a1 = 13 + r() * 8; // amplitude principale
  const a2 = 3 + r() * 4; // frémissement secondaire
  const turns = 2 + Math.round(r()); // 2 ou 3 grandes courbes
  const cx = VB_W / 2;

  const pts = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const x =
      cx +
      Math.sin(t * turns * Math.PI * 2 + phase) * a1 +
      Math.sin(t * turns * 2.4 * Math.PI * 2 + phase * 1.7) * a2;
    pts.push([x, t * VB_H]);
  }
  const d = pts
    .map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(' ');

  const pointAt = (t) => {
    const i = Math.min(STEPS, Math.max(0, Math.round(t * STEPS)));
    return pts[i];
  };
  const angleAt = (t) => {
    const p0 = pointAt(Math.max(0, t - 0.05));
    const p1 = pointAt(Math.min(1, t + 0.05));
    return (Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180) / Math.PI;
  };

  // Feuilles alternées le long de la tige, orientées selon la tangente
  const leaves = [];
  const leafCount = 9;
  for (let k = 0; k < leafCount; k++) {
    const t = (k + 1) / (leafCount + 1);
    const p = pointAt(t);
    const side = k % 2 ? 1 : -1;
    leaves.push({
      t,
      x: p[0],
      y: p[1],
      rot: angleAt(t) + side * (52 + r() * 24),
      scale: 0.7 + r() * 0.55,
    });
  }

  // Vrilles discrètes
  const tendrils = [];
  for (let k = 0; k < 3; k++) {
    const t = (k + 1.6) / 6;
    const p = pointAt(t);
    tendrils.push({ t, x: p[0], y: p[1], rot: (r() * 360) | 0, scale: 0.8 + r() * 0.4 });
  }

  return { d, leaves, tendrils };
}

/**
 * EFFET SIGNATURE n°2 — liane qui grimpe au scroll.
 * La tige (SVG path) est « dessinée » par stroke-dashoffset scrubbé
 * par ScrollTrigger ; feuilles et vrilles éclosent progressivement
 * au fil de la progression. prefers-reduced-motion → vigne statique.
 *
 * @param {string} side   'left' | 'right'
 * @param {number} seed   graine du PRNG
 * @param {string} stem    couleur de tige / contours
 * @param {string} leaf    couleur de remplissage des feuilles
 */
export default function Vine({ side = 'left', seed = 1, stem = '#004900', leaf = '#d5f683', className = '' }) {
  const svgRef = useRef(null);
  const { d, leaves, tendrils } = buildVine(seed);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const stemEl = svg.querySelector('.lg-vine-stem');
    if (!stemEl) return;

    const ctx = gsap.context(() => {
      const leafEls = gsap.utils.toArray('.lg-vine-leaf-in', svg);
      const tendrilEls = gsap.utils.toArray('.lg-vine-tendril-in', svg);
      const all = [...leafEls, ...tendrilEls];

      const L = stemEl.getTotalLength();
      gsap.set(stemEl, { strokeDasharray: L, strokeDashoffset: L });
      gsap.set(all, { scale: 0, opacity: 0, transformOrigin: '0% 100%' });

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set(stemEl, { strokeDashoffset: 0 });
        gsap.set(all, { scale: 1, opacity: 1 });
        return;
      }

      const pop = (el, p) => {
        const e = p * p * (3 - 2 * p); // smoothstep
        gsap.set(el, { opacity: e, scale: 0.25 + 0.75 * e });
      };
      const grow = (els, p, span) => {
        els.forEach((el) => {
          const t = parseFloat(el.dataset.t || '1');
          pop(el, gsap.utils.clamp(0, 1, (p - t + 0.05) / span));
        });
      };

      gsap.to(stemEl, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: svg,
          start: 'top 85%',
          end: 'bottom 55%',
          scrub: 0.5,
          onUpdate: (self) => {
            grow(leafEls, self.progress, 0.16);
            grow(tendrilEls, self.progress, 0.12);
          },
        },
      });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      className={`lg-vine lg-vine--${side} ${className}`}
      ref={svgRef}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      fill="none"
      preserveAspectRatio="xMidYMin meet"
      aria-hidden="true"
    >
      <path className="lg-vine-stem" d={d} stroke={stem} strokeWidth="3" strokeLinecap="round" />
      {leaves.map((l, i) => (
        <g key={`l${i}`} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.rot.toFixed(1)}) scale(${l.scale.toFixed(2)})`}>
          <g className="lg-vine-leaf-in" data-t={l.t.toFixed(3)}>
            <path d={LEAF_BODY} fill={leaf} stroke={stem} strokeWidth="1" strokeLinejoin="round" />
            <path d={LEAF_RIB} stroke={stem} strokeWidth="0.7" strokeLinecap="round" opacity="0.5" />
          </g>
        </g>
      ))}
      {tendrils.map((t, i) => (
        <g key={`t${i}`} transform={`translate(${t.x.toFixed(1)} ${t.y.toFixed(1)}) rotate(${t.rot}) scale(${t.scale.toFixed(2)})`}>
          <path className="lg-vine-tendril-in" data-t={t.t.toFixed(3)} d={TENDRIL} stroke={stem} strokeWidth="1" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}
