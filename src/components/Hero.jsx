import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HammerHand, ScrewdriverHand, NeedleHand } from './HeroHands.jsx';

gsap.registerPlugin(ScrollTrigger);

/**
 * 9 éclats polygonaux qui pavent exactement le panneau jaune.
 * Chaque éclat est un div plein écran masqué par clip-path :
 * en le translatant avec GSAP, on déplace son fragment visuel.
 */
const SHARDS = [
  'polygon(0% 0%, 40% 0%, 28% 22%, 0% 30%)',
  'polygon(40% 0%, 75% 0%, 62% 26%, 28% 22%)',
  'polygon(75% 0%, 100% 0%, 100% 34%, 62% 26%)',
  'polygon(0% 30%, 28% 22%, 40% 55%, 0% 62%)',
  'polygon(28% 22%, 62% 26%, 72% 52%, 40% 55%)',
  'polygon(62% 26%, 100% 34%, 100% 66%, 72% 52%)',
  'polygon(0% 62%, 40% 55%, 45% 100%, 0% 100%)',
  'polygon(40% 55%, 72% 52%, 78% 100%, 45% 100%)',
  'polygon(72% 52%, 100% 66%, 100% 100%, 78% 100%)',
];

export default function Hero() {
  const root = useRef(null);
  const tlRef = useRef(null);
  const floatTlRef = useRef(null);

  const play = () => {
    tlRef.current?.kill();
    floatTlRef.current?.kill();

    const q = gsap.utils.selector(root.current);
    const shards = q('.shard');
    const words = q('.hero-title .word');
    const sub = q('.hero-sub');
    const ctas = q('.hero-ctas .btn');
    const flash = q('.hero-flash');
    const glow = q('.hero-glow');
    const panel = q('.panel');
    const shake = q('.hero-shake');
    const hammer = q('.hand--hammer');
    const screw = q('.hand--screwdriver');
    const needle = q('.hand--needle');
    const hands = [hammer, screw, needle];

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- États initiaux
    gsap.set(shards, { x: 0, y: 0, rotation: 0, filter: 'blur(0px)', opacity: 1 });
    gsap.set(panel, { scale: 1, opacity: 1, rotate: 0, yPercent: 0 });
    gsap.set(words, { yPercent: 130, opacity: 0 });
    gsap.set(sub, { y: 30, opacity: 0 });
    gsap.set(ctas, { y: 30, opacity: 0, scale: 0.7 });
    gsap.set(hammer, { xPercent: -160, yPercent: -150, rotation: -20 });
    gsap.set(screw, { xPercent: -190, yPercent: 30, rotation: 12 });
    gsap.set(needle, { xPercent: 170, yPercent: -15, rotation: 18 });
    gsap.set(flash, { opacity: 0 });
    gsap.set(shake, { x: 0, y: 0 });

    if (reduced) {
      gsap.set(words, { yPercent: 0, opacity: 1 });
      gsap.set([sub, ctas], { y: 0, opacity: 1, scale: 1 });
      gsap.set(hands, { xPercent: 0, yPercent: 0, rotation: 0 });
      return;
    }

    // ---- Timeline "casser puis réparer"
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Phase 1a : le panneau jaune pop-in
    tl.fromTo(
      panel,
      { scale: 0.45, opacity: 0, rotate: -8, yPercent: 8 },
      { scale: 1, opacity: 1, rotate: 0, yPercent: 0, duration: 0.8, ease: 'back.out(1.6)' }
    )
      // Phase 1b : craquèlement — flash + secousse
      .fromTo(flash, { opacity: 0 }, { opacity: 0.85, duration: 0.06, yoyo: true, repeat: 3, ease: 'none' }, '+=0.2')
      .to(
        shake,
        {
          keyframes: [
            { x: -9, y: 6, duration: 0.05 },
            { x: 8, y: -4, duration: 0.05 },
            { x: -5, y: 3, duration: 0.05 },
            { x: 0, y: 0, duration: 0.05 },
          ],
        },
        '<'
      )
      // Phase 1c : EXPLOSION — les éclats s'éparpillent
      .to(
        shards,
        {
          x: () => gsap.utils.random(-280, 280),
          y: () => gsap.utils.random(-220, 220),
          rotation: () => gsap.utils.random(-110, 110),
          filter: 'blur(3px)',
          opacity: 0.85,
          duration: 0.9,
          stagger: { each: 0.035, from: 'center' },
        },
        '-=0.05'
      )
      // Phase 2a : les mains entrent en jeu
      .to(hammer, { xPercent: 0, yPercent: 0, rotation: 0, duration: 1, ease: 'back.out(1.1)' }, '+=0.1')
      .to(screw, { xPercent: 0, yPercent: 0, rotation: 0, duration: 1, ease: 'back.out(1.1)' }, '<0.12')
      .to(needle, { xPercent: 0, yPercent: 0, rotation: 0, duration: 1, ease: 'back.out(1.1)' }, '<0.12')
      // Phase 2b : coup de marteau
      .to(hammer, {
        rotation: -14,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
        transformOrigin: '20% 20%',
      })
      // Phase 2c : les mains réassemblent les éclats
      .to(
        shards,
        {
          x: 0,
          y: 0,
          rotation: 0,
          filter: 'blur(0px)',
          opacity: 1,
          duration: 1,
          ease: 'power2.inOut',
          stagger: { each: 0.045, from: 'random' },
        },
        '<'
      )
      // pulsation de la lueur jaune
      .fromTo(
        glow,
        { opacity: 0.8, scale: 1 },
        { opacity: 1, scale: 1.18, duration: 0.35, yoyo: true, repeat: 1, ease: 'sine.inOut' },
        '<'
      )
      // Phase 3 : révélation du contenu
      .to(words, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: 'back.out(1.5)' }, '-=0.55')
      .to(sub, { y: 0, opacity: 1, duration: 0.6 }, '-=0.45')
      .to(ctas, { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.09, ease: 'back.out(1.8)' }, '-=0.35');

    tlRef.current = tl;

    // Respiration légère des mains une fois la réparation faite
    floatTlRef.current = gsap.to(hands, {
      y: '+=10',
      duration: 1.8,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      stagger: 0.35,
      delay: tl.duration() + 0.2,
    });
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Démarrage quand les polices sont prêtes (évite le "jump" de layout)
      const start = () => play();
      if (document.fonts?.ready) {
        document.fonts.ready.then(start);
      } else {
        setTimeout(start, 200);
      }

      // Parallaxe au scroll : le visuel s'éloigne doucement
      gsap.to('.hero-visual', {
        yPercent: 14,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.hero-content', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, root);

    return () => {
      tlRef.current?.kill();
      floatTlRef.current?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section className="hero" id="accueil" ref={root}>
      {/* Couche visuelle : glow + panneau brisé + mains */}
      <div className="hero-shake">
        <div className="hero-visual">
          <div className="hero-glow" />
          <div className="panel-wrap">
            <div className="panel">
              {SHARDS.map((cp, i) => (
                <div key={i} className="shard" style={{ clipPath: cp }} />
              ))}
            </div>
          </div>
          <HammerHand className="hand hand--hammer" />
          <ScrewdriverHand className="hand hand--screwdriver" />
          <NeedleHand className="hand hand--needle" />
        </div>
        <div className="hero-flash" />
      </div>

      {/* Contenu */}
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="line">
            <span className="word">Journées</span> <span className="word">Nationales</span>
          </span>
          <span className="line">
            <span className="word">de la</span> <span className="word">Réparation</span>
          </span>
        </h1>
        <p className="hero-sub">
          Du 15 au 18 octobre 2026, des centaines d'ateliers ouvrent leurs portes partout en France.
        </p>
      </div>

      <div className="hero-ctas">
        <a href="#newsletter" className="btn">
          Trouver un événement
        </a>
        <a href="#newsletter" className="btn btn--white">
          Newsletter réparateur
        </a>
      </div>

      <button className="replay" onClick={play} aria-label="Rejouer l'animation">
        ↻ Rejouer
      </button>
    </section>
  );
}