import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Ligne de pouls verticale : 5 battements, du haut au bas de l'écran. */
const RAIL_D = (() => {
  const x = 18;
  const H = 800;
  const step = 160;
  let d = `M ${x} 0`;
  for (let y = 0; y + step <= H; y += step) {
    d += ` L ${x} ${y + 70} l -3 6 l 3 6 L ${x} ${y + 96}` +
      ` l -6 4 l 21 11 l -15 24 L ${x} ${y + 146}` +
      ` l -4 7 l 4 7 L ${x} ${y + step}`;
  }
  return d;
})();

/**
 * LE fil conducteur : une ligne de pouls/ECG verticale, fixée au bord
 * droit de l'écran, qui se dessine battement après battement pendant
 * que la page défile — la ligne traverse toute la page et « bat » au scroll.
 * Desktop large, motion OK uniquement (cachée sinon).
 */
export default function SnpsPulseRail() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1101px) and (prefers-reduced-motion: no-preference)', () => {
      const paths = gsap.utils.toArray('.sn-rail-path', root.current);
      if (!paths.length) return;

      const tween = gsap.fromTo(
        paths,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
          },
        }
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <aside className="sn-rail" ref={root} aria-hidden="true">
      <svg className="sn-rail-svg" viewBox="0 0 36 800" preserveAspectRatio="none">
        <path className="sn-rail-path sn-rail-path--halo" d={RAIL_D} pathLength="1" />
        <path className="sn-rail-path" d={RAIL_D} pathLength="1" />
      </svg>
    </aside>
  );
}
