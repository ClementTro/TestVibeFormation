import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useLenis from '../hooks/useLenis.js';
import LandingNav from './LandingNav.jsx';
import LandingHero from './LandingHero.jsx';
import Marquee from './Marquee.jsx';
import RendezVous from './RendezVous.jsx';
import LandingStats from './LandingStats.jsx';
import FinalCta from './FinalCta.jsx';
import LandingFooter from './LandingFooter.jsx';
import Cursor from './Cursor.jsx';

gsap.registerPlugin(ScrollTrigger);

/**
 * LA VITRINE — "Les Journées Nationales"
 * Page d'accueil globale : noir spectaculaire + jaune/menthe,
 * particules interactives, scroll horizontal épinglé, compteurs, curseur custom.
 */
export default function LandingApp() {
  useLenis();

  // Reveal générique : tout élément [data-reveal] apparaît au scroll
  useLayoutEffect(() => {
    const els = gsap.utils.toArray('[data-reveal]');
    gsap.set(els, { y: 48, opacity: 0 });
    const triggers = ScrollTrigger.batch(els, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { y: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: 'power3.out' }),
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div className="ln-root">
      <LandingNav />
      <main>
        <LandingHero />
        <Marquee />
        <RendezVous />
        <LandingStats />
        <FinalCta />
      </main>
      <LandingFooter />
      <Cursor />
    </div>
  );
}
