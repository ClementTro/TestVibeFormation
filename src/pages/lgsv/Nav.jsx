import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BASE, THEMES } from '../../data/themes.js';

gsap.registerPlugin(ScrollTrigger);

// Contenu navbar = même contenu que la HOME : la famille de rendez-vous.
// Aucune ancre — la page courante (LGSV) est marquée « vous y êtes ».
const PAGE_KEY = 'lgsv';
const OFFICIAL_SITE = 'https://lagrandesemainevegetale.fr/';

export default function Nav() {
  const barRef = useRef(null);

  // Barre de progression « tige » en bas de la navbar
  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(bar, { scaleX: 1 });
      return;
    }
    const tw = gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.25 },
      }
    );
    return () => {
      tw.scrollTrigger?.kill();
      tw.kill();
    };
  }, []);

  return (
    <header className="lg-header">
      <div className="lg-header-inner container">
        <a href={BASE} className="lg-logo" aria-label="La Grande Semaine Végétale — retour à la vitrine">
          <span className="lg-logo-badge">LGSV</span>
          <span className="lg-logo-text">La Grande Semaine Végétale</span>
        </a>

        <nav className="lg-nav" aria-label="Navigation principale">
          {THEMES.map((t) =>
            t.key === PAGE_KEY ? (
              <span key={t.key} className="lg-nav-link is-active" aria-current="page" title="Vous y êtes">
                {t.acronym}
              </span>
            ) : t.live ? (
              <a key={t.key} href={t.href} className="lg-nav-link">
                {t.acronym}
              </a>
            ) : (
              <span key={t.key} className="lg-nav-link is-soon" title="Bientôt disponible">
                {t.acronym}
              </span>
            )
          )}
        </nav>

        <a href={OFFICIAL_SITE} target="_blank" rel="noopener noreferrer" className="lg-cta">
          Inscrire son événement ↗
        </a>
      </div>
      <span className="lg-progress" aria-hidden="true" ref={barRef} />
    </header>
  );
}
