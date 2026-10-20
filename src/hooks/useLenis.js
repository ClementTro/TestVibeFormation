import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll premium (Lenis) + intégration ScrollTrigger + ancres.
 */
export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Défilement fluide sur les ancres (#manifeste, #newsletter...)
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute('href');
      if (hash.length > 1 && document.querySelector(hash)) {
        e.preventDefault();
        lenis.scrollTo(hash, { offset: -90 });
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}