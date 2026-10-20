import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const PROMPT = 'propose une semaine pour découvrir l’IA près de chez vous…';

/**
 * HERO SIAT — fond crème à la DA du site réel, mais vivant :
 * - canvas « réseau de neurones » interactif : nœuds qui dérivent,
 *   connexions bleu nuit, neurones qui s'activent au passage de la souris,
 *   impulsions de données corail qui voyagent le long des liens ;
 * - titre Rubik 900 avec « DE L'IA » tamponné corail incliné (comme le logo réel) ;
 * - carte « prompt IA » dont la consigne se génère caractère par caractère,
 *   puis la « réponse » du modèle apparaît (fallback statique si motion réduite).
 */
export default function Hero() {
  const root = useRef(null);
  const canvasRef = useRef(null);
  const typedRef = useRef(null);
  const resultRef = useRef(null);

  /* ---------------------------------------------------------
     Réseau de neurones interactif (canvas, dpr + resize + cleanup)
  --------------------------------------------------------- */
  const initNeural = () => {
    const canvas = canvasRef.current;
    const hero = root.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const BLUE = '30, 115, 190'; // #1e73be
    const CORAL = '245, 100, 118'; // #f56476
    const DEEP = '0, 48, 129'; // #003081

    const resize = () => {
      const r = hero.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };
    resize();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = Math.min(
      110,
      Math.max(45, Math.round((canvas.width / dpr) * (canvas.height / dpr) / 15000))
    );
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3 * dpr,
      vy: (Math.random() - 0.5) * 0.3 * dpr,
      r: (1.6 + Math.random() * 2.4) * dpr,
      act: 0, // niveau d'activation du neurone (0 → 1)
    }));
    const mouse = { x: -9999, y: -9999 };
    const pulses = []; // impulsions de données voyageant le long des liens
    let raf = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // dérive douce + activation par la souris + décroissance
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 150 * dpr && dm > 0.001) {
          p.act = Math.min(1, p.act + 0.05 * (1 - dm / (150 * dpr)));
        }
        p.act *= 0.965;
        if (p.x < -12) p.x = w + 12;
        if (p.x > w + 12) p.x = -12;
        if (p.y < -12) p.y = h + 12;
        if (p.y > h + 12) p.y = -12;
      }

      // synapses entre nœuds proches — chauffent au corail quand activées
      const maxD = 115 * dpr;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > maxD * maxD) continue;
          const d = Math.sqrt(d2);
          const heat = Math.max(a.act, b.act);
          ctx.globalAlpha = (1 - d / maxD) * (0.14 + heat * 0.6);
          ctx.strokeStyle = heat > 0.22 ? `rgba(${CORAL}, 1)` : `rgba(${BLUE}, 1)`;
          ctx.lineWidth = (1 + heat * 1.2) * dpr;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          // une impulsion naît parfois sur un lien chaud
          if (heat > 0.4 && pulses.length < 16 && Math.random() < 0.02) {
            pulses.push({ na: a, nb: b, t: 0, sp: 0.011 + Math.random() * 0.013 });
          }
        }
      }

      // liens directs vers le curseur (le « stimulateur »)
      const maxM = 170 * dpr;
      for (const p of pts) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < maxM) {
          ctx.globalAlpha = (1 - d / maxM) * 0.45;
          ctx.strokeStyle = `rgba(${CORAL}, 1)`;
          ctx.lineWidth = 1.1 * dpr;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // les neurones (disques bleu nuit, halos corail quand excités)
      for (const p of pts) {
        ctx.globalAlpha = 0.5 + p.act * 0.5;
        ctx.fillStyle = p.act > 0.35 ? `rgba(${CORAL}, 1)` : `rgba(${DEEP}, 1)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (1 + p.act * 0.9), 0, Math.PI * 2);
        ctx.fill();
        if (p.act > 0.5) {
          ctx.globalAlpha = (p.act - 0.5) * 0.8;
          ctx.strokeStyle = `rgba(${CORAL}, 1)`;
          ctx.lineWidth = 1.4 * dpr;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // impulsions de données le long des synapses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pu = pulses[i];
        pu.t += pu.sp;
        if (pu.t >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const x = pu.na.x + (pu.nb.x - pu.na.x) * pu.t;
        const y = pu.na.y + (pu.nb.y - pu.na.y) * pu.t;
        const fade = Math.sin(Math.PI * pu.t);
        ctx.globalAlpha = fade * 0.28;
        ctx.fillStyle = `rgba(${CORAL}, 1)`;
        ctx.beginPath();
        ctx.arc(x, y, 5.5 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = fade * 0.95;
        ctx.beginPath();
        ctx.arc(x, y, 2.3 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    draw();

    const onMove = (e) => {
      const cr = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - cr.left) * dpr;
      mouse.y = (e.clientY - cr.top) * dpr;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onResize = () => resize();

    hero.addEventListener('mousemove', onMove);
    hero.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener('mousemove', onMove);
      hero.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  };

  /* ---------------------------------------------------------
     Le « prompt » se génère caractère par caractère, façon IA.
     Fallback statique complet si prefers-reduced-motion.
  --------------------------------------------------------- */
  useEffect(() => {
    const typed = typedRef.current;
    const result = resultRef.current;
    if (!typed || !result) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      typed.textContent = PROMPT;
      result.classList.add('is-visible');
      return;
    }

    let i = 0;
    let timer = 0;
    const tick = () => {
      i += 1;
      typed.textContent = PROMPT.slice(0, i);
      if (i < PROMPT.length) {
        timer = setTimeout(tick, 26 + Math.random() * 48);
      } else {
        timer = setTimeout(() => result.classList.add('is-visible'), 420);
      }
    };
    timer = setTimeout(tick, 1050);
    return () => clearTimeout(timer);
  }, []);

  /* ---------------------------------------------------------
     Intro cinétique (une seule passe) + badge rotatif + parallaxe
  --------------------------------------------------------- */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const q = gsap.utils.selector(root.current);
      const lines = q('.ia-line-in');
      const kicker = q('.ia-kicker');
      const date = q('.ia-date');
      const prompt = q('.ia-prompt');
      const ctas = q('.ia-ctas a');
      const badge = q('.ia-badge');
      const hint = q('.ia-scroll');
      const canvas = q('.ia-canvas');

      if (reduced) {
        gsap.set([kicker, date, prompt, ctas, hint, canvas], { opacity: 1, y: 0 });
        gsap.set(lines, { yPercent: 0 });
        return;
      }

      gsap.set(lines, { yPercent: 118 });
      gsap.set(kicker, { y: 22, opacity: 0 });
      gsap.set(date, { y: 22, opacity: 0 });
      gsap.set(prompt, { y: 26, opacity: 0, scale: 0.96 });
      gsap.set(ctas, { y: 24, opacity: 0 });
      gsap.set(badge, { scale: 0, rotation: -120, opacity: 0 });
      gsap.set(hint, { opacity: 0 });
      gsap.set(canvas, { opacity: 0 });

      const start = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to(canvas, { opacity: 1, duration: 1.2, ease: 'power1.inOut' }, 0)
          .to(kicker, { y: 0, opacity: 1, duration: 0.5 }, 0.15)
          .to(lines, { yPercent: 0, duration: 0.9, stagger: 0.12, ease: 'back.out(1.4)' }, 0.3)
          .to(date, { y: 0, opacity: 1, duration: 0.5 }, 0.9)
          .to(prompt, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.6)' }, 1.05)
          .to(ctas, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)' }, 1.25)
          .to(badge, { scale: 1, rotation: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.7)' }, 1.3)
          .to(hint, { opacity: 1, duration: 0.5 }, 1.6);

        // rotation lente du badge (après l'intro pour ne pas la contrarier)
        gsap.to(badge, {
          rotation: 360,
          duration: 22,
          repeat: -1,
          ease: 'none',
          delay: 2.4,
          transformOrigin: '50% 50%',
        });
      };
      if (document.fonts?.ready) document.fonts.ready.then(start);
      else setTimeout(start, 200);
    }, root);

    const cleanupNeural = initNeural();

    // Parallaxe douce du bloc titre à la souris (desktop uniquement)
    let onMove = null;
    if (window.matchMedia('(pointer: fine)').matches && root.current) {
      const content = root.current.querySelector('.ia-hero-content');
      const badge = root.current.querySelector('.ia-badge');
      onMove = (e) => {
        const r = root.current.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        if (content) gsap.to(content, { x: nx * 12, y: ny * 9, duration: 0.9, ease: 'power2.out' });
        if (badge) gsap.to(badge, { x: nx * -22, y: ny * -16, duration: 1.1, ease: 'power2.out' });
      };
      root.current.addEventListener('mousemove', onMove);
    }

    return () => {
      if (onMove && root.current) root.current.removeEventListener('mousemove', onMove);
      cleanupNeural?.();
      ctx.revert();
    };
  }, []);

  return (
    <section className="ia-hero" id="accueil" ref={root}>
      <canvas className="ia-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="container ia-hero-content">
        <span className="ia-kicker">SIAT · Édition 2026 · Toute la France</span>
        <h1 className="ia-title">
          <span className="ia-line">
            <span className="ia-line-in">La semaine</span>
          </span>
          <span className="ia-line">
            <span className="ia-line-in">
              <span className="ia-sticker">de l&rsquo;IA</span> pour tous
            </span>
          </span>
        </h1>
        <p className="ia-date">Du 18 au 24 mai 2026</p>

        {/* Texte réel garanti aux lecteurs d'écran + moteurs */}
        <p className="ia-sr-only">
          Une semaine pour découvrir l&rsquo;intelligence artificielle près de chez vous.
        </p>

        {/* Carte « prompt IA » — la consigne se génère en direct */}
        <div className="ia-prompt" aria-hidden="true">
          <div className="ia-prompt-head">
            <span className="ia-dot ia-dot--coral" />
            <span className="ia-dot ia-dot--tan" />
            <span className="ia-dot ia-dot--blue" />
            <span className="ia-prompt-title">semaine-ia — prompt</span>
          </div>
          <div className="ia-prompt-body">
            <p className="ia-prompt-line">
              <span className="ia-prompt-chev">&gt;</span>{' '}
              <span className="ia-prompt-typed" ref={typedRef} />
              <span className="ia-caret" />
            </p>
            <p className="ia-prompt-res" ref={resultRef}>
              <span className="ia-prompt-check">✓</span>
              Du 18 au 24 mai 2026 — 1 500 évènements partout en France.
            </p>
          </div>
        </div>

        <div className="ia-ctas">
          <a href="#organiser" className="ia-btn">
            Proposer mon évènement
          </a>
          <a href="#manifeste" className="ia-btn ia-btn--ghost">
            Lire le manifeste
          </a>
        </div>
      </div>

      {/* Badge circulaire rotatif */}
      <svg className="ia-badge" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <path
            id="ia-circle"
            d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
          />
        </defs>
        <text className="ia-badge-text">
          <textPath href="#ia-circle" textLength="276" lengthAdjust="spacingAndGlyphs">
            UNE SEMAINE POUR DÉCOUVRIR L&rsquo;IA ✦ 18—24 MAI 2026 ✦
          </textPath>
        </text>
        <text className="ia-badge-star" x="60" y="68" textAnchor="middle">
          ✦
        </text>
      </svg>

      <div className="ia-scroll" aria-hidden="true">
        <span>Scroll</span>
        <i className="ia-scroll-line" />
      </div>
    </section>
  );
}
