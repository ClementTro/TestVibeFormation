import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Curseur custom SNPS : un point corail + un anneau qui traîne derrière,
 * qui grossit sur les éléments interactifs. Desktop (pointer fine) only.
 */
export default function SnpsCursor() {
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const dotEl = dot.current;
    const ringEl = ring.current;
    if (!dotEl || !ringEl) return;

    gsap.set([dotEl, ringEl], { xPercent: -50, yPercent: -50, opacity: 0 });

    const show = () => gsap.to([dotEl, ringEl], { opacity: 1, duration: 0.25 });
    const hide = () => gsap.to([dotEl, ringEl], { opacity: 0, duration: 0.25 });
    const move = (e) => {
      gsap.to(dotEl, { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'none' });
      gsap.to(ringEl, { x: e.clientX, y: e.clientY, duration: 0.42, ease: 'power3.out' });
    };
    const over = (e) => {
      const hot = !!e.target.closest('a, button, input, .sn-theme-card');
      gsap.to(ringEl, { scale: hot ? 1.9 : 1, duration: 0.25, ease: 'power2.out' });
      gsap.to(dotEl, { scale: hot ? 0.4 : 1, duration: 0.25, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mousemove', show, { once: true });
    document.documentElement.addEventListener('mouseleave', hide);
    document.documentElement.addEventListener('mouseenter', show);
    document.addEventListener('mouseover', over);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousemove', show);
      document.documentElement.removeEventListener('mouseleave', hide);
      document.documentElement.removeEventListener('mouseenter', show);
      document.removeEventListener('mouseover', over);
    };
  }, []);

  return (
    <>
      <div className="sn-cursor-dot" ref={dot} aria-hidden="true" />
      <div className="sn-cursor-ring" ref={ring} aria-hidden="true" />
    </>
  );
}
