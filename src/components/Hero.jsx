import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

/**
 * NOTE POUR REPRISE (voir HANDOFF.md à la racine) :
 * la séquence admet une phase "mains qui réparent" entre l'explosion
 * et la réassemblage. Injecter des éléments .hand ( classe CSS + refs
 * hammer/screw/wrench ) ici et la timeline les ajoutera automatiquement.
 */
export default function Hero() {
  const root = useRef(null);
  const tlRef = useRef(null);
  const floatTlRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(0);

  /* ---------------------------------------------------------
     Moteur d'étincelles (canvas) : petits carrés et traits
     néo-brutalistes qui giclent avec gravité + friction.
  --------------------------------------------------------- */
  const sizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
  };

  const sparkLoop = () => {
    rafRef.current = 0;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const ps = particlesRef.current;
    const w = canvas.width;
    const h = canvas.height;
    const dpr = w / (canvas.getBoundingClientRect().width || 1);
    const g = 0.3 * dpr;
    ctx.clearRect(0, 0, w, h);
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i];
      p.life += 1;
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      const t = 1 - p.life / p.ttl;
      if (t <= 0 || p.y > h + 30 * dpr) {
        ps.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, t);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.streak) ctx.fillRect(-p.s * 2.4, -p.s * 0.32, p.s * 4.8, p.s * 0.64);
      else ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s);
      ctx.restore();
    }
    if (ps.length) rafRef.current = requestAnimationFrame(sparkLoop);
    else ctx.clearRect(0, 0, w, h);
  };

  const burst = (x, y, count, power) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const colors = ['#ffd500', '#fffdf6', '#101010', '#7cc9ab', '#ffe14d'];
    const ps = particlesRef.current;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = (2.2 + Math.random() * 7.5) * power * dpr;
      ps.push({
        x: x * dpr,
        y: y * dpr,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 2.4 * dpr * power,
        s: (2 + Math.random() * 4.5) * dpr,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.35,
        ttl: 45 + Math.random() * 35,
        life: 0,
        color: colors[(Math.random() * colors.length) | 0],
        streak: Math.random() < 0.35,
      });
    }
    if (!rafRef.current) rafRef.current = requestAnimationFrame(sparkLoop);
  };

  /** Explosion d'étincelles centrée sur le panneau jaune. */
  const burstAtPanel = (count, power) => {
    const canvas = canvasRef.current;
    const panel = root.current?.querySelector('.panel-wrap');
    if (!canvas || !panel) return;
    const cr = canvas.getBoundingClientRect();
    const pr = panel.getBoundingClientRect();
    burst(
      pr.left + pr.width / 2 - cr.left,
      pr.top + pr.height / 2 - cr.top,
      count,
      power
    );
  };

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
    const wrench = q('.hand--wrench');
    const hands = [hammer, screw, wrench].filter((h) => h.length > 0);
    const hasHands = hands.length === 3;
    const crackPop = q('.pop--crack');
    const fixedPop = q('.pop--fixed');
    const pops = [crackPop, fixedPop];

    // Reset du moteur d'étincelles
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    particlesRef.current = [];
    sizeCanvas();
    const cv = canvasRef.current;
    cv?.getContext('2d')?.clearRect(0, 0, cv.width, cv.height);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- États initiaux
    gsap.set(shards, { x: 0, y: 0, rotation: 0, filter: 'blur(0px)', opacity: 1 });
    gsap.set(panel, { scale: 1, opacity: 1, rotate: 0, yPercent: 0 });
    gsap.set(words, { yPercent: 130, opacity: 0 });
    gsap.set(sub, { y: 30, opacity: 0 });
    gsap.set(ctas, { y: 30, opacity: 0, scale: 0.7 });
    gsap.set(flash, { opacity: 0 });
    gsap.set(shake, { x: 0, y: 0 });
    gsap.set(pops, { scale: 0, opacity: 0, rotation: 0 });
    if (hasHands) {
      gsap.set(hammer, { xPercent: -160, yPercent: -150, rotation: -20 });
      gsap.set(screw, { xPercent: -190, yPercent: 30, rotation: 12 });
      gsap.set(wrench, { xPercent: 170, yPercent: -15, rotation: 18 });
    }

    if (reduced) {
      gsap.set(words, { yPercent: 0, opacity: 1 });
      gsap.set([sub, ctas], { y: 0, opacity: 1, scale: 1 });
      if (hasHands) gsap.set(hands, { xPercent: 0, yPercent: 0, rotation: 0 });
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
      // Phase 1b : craquèlement — flash + secousse + "CRACK !"
      .fromTo(flash, { opacity: 0 }, { opacity: 0.85, duration: 0.06, yoyo: true, repeat: 3, ease: 'none' }, '+=0.2')
      .fromTo(
        crackPop,
        { scale: 0, opacity: 0, rotation: -32 },
        { scale: 1, opacity: 1, rotation: -8, duration: 0.32, ease: 'back.out(2.4)' },
        '<0.02'
      )
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
      // Phase 1c : EXPLOSION — les éclats s'éparpillent + gerbe d'étincelles
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
      .call(() => burstAtPanel(90, 1), [], '<')
      // l'onomatopée s'efface avant la réparation
      .to(crackPop, { scale: 0.4, opacity: 0, duration: 0.22, ease: 'back.in(2)' }, '+=0.45');

    // Phase 2a (optionnelle) : les mains entrent en jeu
    if (hasHands) {
      tl.to(hammer, { xPercent: 0, yPercent: 0, rotation: 0, duration: 1, ease: 'back.out(1.1)' }, '+=0.1');
      tl.to(screw, { xPercent: 0, yPercent: 0, rotation: 0, duration: 1, ease: 'back.out(1.1)' }, '<0.12');
      tl.to(wrench, { xPercent: 0, yPercent: 0, rotation: 0, duration: 1, ease: 'back.out(1.1)' }, '<0.12');
      // coup de marteau
      tl.to(hammer, {
        rotation: -14,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
        transformOrigin: '20% 20%',
      });
    }

    // Phase 2b : réassemblage des éclats
    tl.to(
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
      hasHands ? '<' : '+=0.15'
    )
      // pulsation de la lueur jaune
      .fromTo(
        glow,
        { opacity: 0.8, scale: 1 },
        { opacity: 1, scale: 1.18, duration: 0.35, yoyo: true, repeat: 1, ease: 'sine.inOut' },
        '<'
      )
      // Phase 2c : "RÉPARÉ !" + gerbe d'étincelles de fin
      .fromTo(
        fixedPop,
        { scale: 0, opacity: 0, rotation: 26 },
        { scale: 1, opacity: 1, rotation: 4, duration: 0.38, ease: 'back.out(2.2)' },
        '-=0.3'
      )
      .call(() => burstAtPanel(40, 0.6), [], '<')
      .to(fixedPop, { scale: 0.4, opacity: 0, duration: 0.2, ease: 'back.in(2)' }, '+=0.7')
      // Phase 3 : révélation du contenu
      .to(words, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: 'back.out(1.5)' }, '-=0.05')
      .to(sub, { y: 0, opacity: 1, duration: 0.6 }, '-=0.45')
      .to(ctas, { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.09, ease: 'back.out(1.8)' }, '-=0.35');

    tlRef.current = tl;

    // Respiration légère des mains une fois la réparation faite
    if (hasHands) {
      floatTlRef.current = gsap.to(hands, {
        y: '+=10',
        duration: 1.8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        stagger: 0.35,
        delay: tl.duration() + 0.2,
      });
    }
  };

  /**
   * Centre exactement le panneau jaune (et sa lueur) sur le titre :
   * on mesure la position réelle du <h1> dans le hero et on y aligne le panneau.
   */
  const centerPanel = () => {
    const hero = root.current;
    if (!hero) return;
    const title = hero.querySelector('.hero-title');
    const panel = hero.querySelector('.panel-wrap');
    const glow = hero.querySelector('.hero-glow');
    if (!title || !panel) return;
    const hr = hero.getBoundingClientRect();
    const tr = title.getBoundingClientRect();
    const topPct = ((tr.top + tr.height / 2 - hr.top) / hr.height) * 100;
    panel.style.top = `${topPct}%`;
    panel.style.height = `${Math.round(tr.height * 1.3)}px`;
    panel.style.width = `${Math.round(Math.min(tr.width * 1.18, hr.width * 0.95))}px`;
    if (glow) glow.style.top = `${topPct}%`;
  };

  const onResize = () => {
    centerPanel();
    sizeCanvas();
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Démarrage quand les polices sont prêtes (évite le "jump" de layout)
      const start = () => {
        centerPanel();
        play();
      };
      if (document.fonts?.ready) {
        document.fonts.ready.then(start);
      } else {
        setTimeout(start, 200);
      }
      window.addEventListener('resize', onResize);

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
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      particlesRef.current = [];
      tlRef.current?.kill();
      floatTlRef.current?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section className="hero" id="accueil" ref={root}>
      {/* Couche visuelle : glow + panneau brisé */}
      <div className="hero-shake">
        <div className="hero-visual">
          <div className="hero-glow" />
          <div className="panel-wrap">
            <div className="panel">
              {SHARDS.map((cp, i) => (
                <div key={i} className="shard" style={{ clipPath: cp }} />
              ))}
            </div>
            {/* Onomatopées BD (animées par la timeline GSAP) */}
            <div className="pop pop--crack" aria-hidden="true">
              Crack !
            </div>
            <div className="pop pop--fixed" aria-hidden="true">
              Réparé !
            </div>
          </div>
          {/* Emplacement des mains réparatrices : voir HANDOFF.md */}
        </div>
        <div className="hero-flash" />
        <canvas className="hero-sparks" ref={canvasRef} />
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