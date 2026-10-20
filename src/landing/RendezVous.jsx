import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { THEMES } from '../data/themes.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * La famille de rendez-vous, en scroll horizontal épinglé (desktop)
 * ou en carrousel tactile (mobile / motion réduite).
 */
export default function RendezVous() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
      const track = root.current.querySelector('.rv-track');
      const bar = root.current.querySelector('.rv-progress-bar');
      if (!track || !bar) return;

      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 60);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => '+=' + dist(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to(track, { x: () => -dist(), ease: 'none' }, 0).fromTo(
        bar,
        { scaleX: 0 },
        { scaleX: 1, ease: 'none' },
        0
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set(track, { x: 0 });
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="ln-rv" id="rendezvous" ref={root}>
      <div className="container rv-head">
        <span className="ln-kicker" data-reveal>
          La famille
        </span>
        <h2 className="ln-title" data-reveal>
          Une bannière, quatre rendez-vous
        </h2>
        <p className="ln-lead" data-reveal>
          Chaque édition a sa couleur, son ambiance, sa navbar — et désormais sa page.
          Fais défiler, la suite se raconte toute seule.
        </p>
      </div>

      <div className="rv-stage">
        <div className="rv-track">
          {THEMES.map((t) =>
            t.live ? (
              <a
                key={t.key}
                className="rv-panel rv-panel--live"
                href={t.href}
                style={{ '--c': t.color }}
              >
                <span className="rv-status rv-status--live">Disponible</span>
                <span className="rv-acro">{t.acronym}</span>
                <span className="rv-name">{t.name}</span>
                <span className="rv-tag">{t.tag}</span>
                <span className="rv-date">{t.date}</span>
                <span className="rv-cta">Voir la démo →</span>
              </a>
            ) : (
              <div
                key={t.key}
                className="rv-panel"
                style={{
                  '--c': t.color,
                  backgroundImage: `repeating-linear-gradient(-45deg, ${t.color}1f 0 10px, transparent 10px 24px)`,
                }}
              >
                <span className="rv-status">Bientôt</span>
                <span className="rv-acro">{t.acronym}</span>
                <span className="rv-name">{t.name}</span>
                <span className="rv-tag">{t.tag}</span>
                <span className="rv-date">{t.date}</span>
              </div>
            )
          )}
        </div>
      </div>

      <div className="container rv-progress" aria-hidden="true">
        <div className="rv-progress-bar" />
      </div>
    </section>
  );
}
