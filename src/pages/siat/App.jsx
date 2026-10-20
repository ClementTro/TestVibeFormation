import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useLenis from '../../hooks/useLenis.js';
import Nav from './Nav.jsx';
import Hero from './Hero.jsx';
import Marquee from './Marquee.jsx';
import Manifeste from './Manifeste.jsx';
import Chiffres from './Chiffres.jsx';
import Pourquoi from './Pourquoi.jsx';
import Partenaires from './Partenaires.jsx';
import Newsletter from './Newsletter.jsx';
import Footer from './Footer.jsx';

gsap.registerPlugin(ScrollTrigger);

/**
 * SIAT — « La Semaine de l'IA pour Tous »
 * Page de démonstration : DA fidèle au site semaine-ia.fr
 * (crème / bleu nuit / corail / jaune, typos Rubik + Palanquin),
 * poussée côté spectacle : réseau de neurones interactif, prompt IA
 * qui se génère en direct, manifeste épinglé mot à mot, compteurs.
 */
export default function App() {
  useLenis();

  // Reveal générique : tout élément [data-reveal] apparaît au scroll
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = gsap.utils.toArray('[data-reveal]');
    if (!els.length) return;
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
    <div className="ia-root">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Manifeste />
        <Chiffres />
        <Pourquoi />
        <Partenaires />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
