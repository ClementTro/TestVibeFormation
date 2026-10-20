import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useLenis from '../../hooks/useLenis.js';
import Leaves from './Leaves.jsx';
import Nav from './Nav.jsx';
import Hero from './Hero.jsx';
import Marquee from './Marquee.jsx';
import About from './About.jsx';
import Stats from './Stats.jsx';
import Organizer from './Organizer.jsx';
import Recipes from './Recipes.jsx';
import Partners from './Partners.jsx';
import Footer from './Footer.jsx';

gsap.registerPlugin(ScrollTrigger);

/**
 * LA GRANDE SEMAINE VÉGÉTALE — page de démonstration.
 * DA du site officiel (verts profonds #004900, lime #d5f683, ciels
 * #b8e2ff / #b2e8e0, beurre #fff1ba), poussée vers le spectaculaire :
 * pluie de feuilles interactive + lianes qui grimpe au scroll.
 */
export default function App() {
  useLenis();

  // Reveal générique : tout élément [data-reveal] apparaît au scroll
  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const els = gsap.utils.toArray('[data-reveal]');
    gsap.set(els, { y: 44, opacity: 0 });
    const triggers = ScrollTrigger.batch(els, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: 'power3.out' }),
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div className="lg-root">
      <Leaves />
      <Nav />
      <main className="lg-main">
        <Hero />
        <Marquee
          items={[
            '10 jours pour se régaler autrement',
            'Ateliers',
            'Dégustations',
            'Conférences',
            'Visites de potagers',
            '25 sept → 4 oct 2026',
            'Toute la France',
          ]}
        />
        <About />
        <Stats />
        <Organizer />
        <Recipes />
        <Partners />
      </main>
      <Footer />
    </div>
  );
}
