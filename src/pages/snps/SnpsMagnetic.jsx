import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Enveloppe "bouton magnétique" (pattern maison, scoped SNPS) :
 * l'élément suit doucement la souris et revient d'un coup de ressort.
 * Desktop (pointer fine) only.
 */
export default function SnpsMagnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;

    const move = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.3, ease: 'power2.out' });
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`sn-magnetic ${className}`}>
      {children}
    </span>
  );
}
