import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useLenis from '../../hooks/useLenis.js';
import SnpsNav from './SnpsNav.jsx';
import SnpsHero from './SnpsHero.jsx';
import SnpsMarquee from './SnpsMarquee.jsx';
import SnpsManifeste from './SnpsManifeste.jsx';
import SnpsThemes from './SnpsThemes.jsx';
import SnpsStats from './SnpsStats.jsx';
import SnpsPartners from './SnpsPartners.jsx';
import SnpsCta from './SnpsCta.jsx';
import SnpsFooter from './SnpsFooter.jsx';
import SnpsCursor from './SnpsCursor.jsx';
import SnpsPulseRail from './SnpsPulseRail.jsx';

gsap.registerPlugin(ScrollTrigger);

/**
 * SNPS — Semaine Nationale de la Prévention Santé (vitrine de démonstration).
 * DA fidèle au site officiel (violet #6746F2, lime, cyan, magenta, Sora/Archivo),
 * version "wow" : ligne ECG qui bat au scroll, moniteur épinglé, compteurs.
 */
export default function SnpsApp() {
  useLenis();

  // Reveal générique : tout élément [data-reveal] apparaît au scroll
  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return; // tout reste visible, statique

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
    <div className="sn-root">
      <SnpsNav />
      <main>
        <SnpsHero />
        <SnpsMarquee />
        <SnpsManifeste />
        <SnpsThemes />
        <SnpsStats />
        <SnpsPartners />
        <SnpsCta />
      </main>
      <SnpsFooter />
      <SnpsCursor />
      <SnpsPulseRail />
    </div>
  );
}
