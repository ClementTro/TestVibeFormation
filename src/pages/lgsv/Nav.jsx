import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { label: 'Le projet', href: '#projet' },
  { label: 'Espace organisateur', href: '#organisateur' },
  { label: 'Actualités', href: '#actualites' },
  { label: 'Contact', href: '#contact' },
];

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
        <a href="#accueil" className="lg-logo" aria-label="La Grande Semaine Végétale — retour en haut">
          <span className="lg-logo-badge">LGSV</span>
          <span className="lg-logo-text">La Grande Semaine Végétale</span>
        </a>

        <nav className="lg-nav" aria-label="Navigation principale">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="lg-nav-link">
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#organisateur" className="lg-cta">
          Inscrire son événement
        </a>
      </div>
      <span className="lg-progress" aria-hidden="true" ref={barRef} />
    </header>
  );
}
