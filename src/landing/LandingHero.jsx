import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { BASE } from '../data/themes.js';

const PARTICLE_COLORS = ['#9fdcc3', '#ffd500', '#fffdf6', '#ffe14d'];

export default function LandingHero() {
  const root = useRef(null);
  const canvasRef = useRef(null);

  /* ---------------------------------------------------------
     Constellation interactive : des carrés qui dérivent,
     reliés par des fils de menthe, et repoussés par la souris
     (qui tisse aussi ses propres fils jaunes).
  --------------------------------------------------------- */
  const initParticles = () => {
    const canvas = canvasRef.current;
    const hero = root.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = hero.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };
    resize();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = Math.min(
      130,
      Math.max(40, Math.round((canvas.width / dpr) * (canvas.height / dpr) / 16000))
    );
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35 * dpr,
      vy: (Math.random() - 0.5) * 0.35 * dpr,
      s: (1.4 + Math.random() * 2.2) * dpr,
      c: PARTICLE_COLORS[(Math.random() * PARTICLE_COLORS.length) | 0],
    }));
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // dérive + répulsion douce autour de la souris
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 120 * dpr && dm > 0.001) {
          const f = (1 - dm / (120 * dpr)) * 0.6 * dpr;
          p.x += (dxm / dm) * f;
          p.y += (dym / dm) * f;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      // fils entre particules proches
      const maxD = 100 * dpr;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < maxD) {
            ctx.globalAlpha = (1 - d / maxD) * 0.28;
            ctx.strokeStyle = '#9fdcc3';
            ctx.lineWidth = 1 * dpr;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // fils jaunes vers la souris
      const maxM = 150 * dpr;
      for (const p of pts) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < maxM) {
          ctx.globalAlpha = (1 - d / maxM) * 0.3;
          ctx.strokeStyle = '#ffd500';
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // les carrés
      ctx.globalAlpha = 1;
      for (const p of pts) {
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
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
    const onResize = () => {
      resize();
    };

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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const q = gsap.utils.selector(root.current);
      const words = q('.lh-word');
      const kicker = q('.lh-kicker');
      const sub = q('.lh-sub');
      const ctas = q('.lh-ctas a');
      const badge = q('.lh-badge');
      const hint = q('.lh-scroll');
      const canvas = q('.lh-canvas');

      // ---- Intro cinétique
      if (reduced) {
        gsap.set([kicker, sub, ctas, hint, canvas], { opacity: 1, y: 0 });
        gsap.set(words, { yPercent: 0 });
        return;
      }
      gsap.set(words, { yPercent: 120 });
      gsap.set(kicker, { y: 24, opacity: 0 });
      gsap.set(sub, { y: 26, opacity: 0 });
      gsap.set(ctas, { y: 26, opacity: 0, scale: 0.85 });
      gsap.set(badge, { scale: 0, rotation: -120, opacity: 0 });
      gsap.set(hint, { opacity: 0 });
      gsap.set(canvas, { opacity: 0 });

      const start = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to(canvas, { opacity: 1, duration: 1.1, ease: 'power1.inOut' }, 0)
          .to(kicker, { y: 0, opacity: 1, duration: 0.5 }, 0.15)
          .to(words, { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'back.out(1.55)' }, 0.28)
          .to(badge, { scale: 1, rotation: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.7)' }, 0.85)
          .to(sub, { y: 0, opacity: 1, duration: 0.6 }, 0.95)
          .to(ctas, { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.09, ease: 'back.out(1.8)' }, 1.1)
          .to(hint, { opacity: 1, duration: 0.5 }, 1.5);

        // rotation infinie du badge (après l'intro pour ne pas la contrarier)
        gsap.to(badge, {
          rotation: 360,
          duration: 18,
          repeat: -1,
          ease: 'none',
          delay: 2,
          transformOrigin: '50% 50%',
        });
      };
      if (document.fonts?.ready) document.fonts.ready.then(start);
      else setTimeout(start, 200);

      // ---- Parallaxe du titre à la souris (desktop)
      if (window.matchMedia('(pointer: fine)').matches) {
        const title = root.current.querySelector('.lh-title');
        const onMove = (e) => {
          const r = root.current.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(title, { x: nx * 18, y: ny * 12, duration: 0.9, ease: 'power2.out' });
          gsap.to(badge, { x: nx * -26, y: ny * -18, duration: 1.1, ease: 'power2.out' });
        };
        root.current.addEventListener('mousemove', onMove);
      }
    }, root);

    const cleanupParticles = initParticles();
    return () => {
      cleanupParticles?.();
      ctx.revert();
    };
  }, []);

  return (
    <section className="lh-hero" id="accueil" ref={root}>
      <canvas className="lh-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="lh-content">
        <span className="lh-kicker">La vitrine officielle · Édition 2026</span>
        <h1 className="lh-title">
          <span className="lh-line">
            <span className="lh-word">Les</span> <span className="lh-word lh-word--mint">Journées</span>
          </span>
          <span className="lh-line">
            <span className="lh-word">Nationales</span>
            <span className="lh-word lh-star" aria-hidden="true">
              ✱
            </span>
          </span>
        </h1>
        <p className="lh-sub">
          Un seul mouvement, une famille de rendez-vous nationaux. Chaque édition transforme
          la France en terrain de jeu — et tout commence par un geste simple&nbsp;: réparer.
        </p>
        <div className="lh-ctas">
          <a href={`${BASE}jnr`} className="lh-btn lh-btn--yellow">
            Voir la démo JNR
          </a>
          <a href="#rendezvous" className="lh-btn lh-btn--ghost">
            La famille de rendez-vous
          </a>
        </div>
      </div>

      {/* Badge rotatif */}
      <svg className="lh-badge" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <path id="lh-circle" d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
        </defs>
        <text className="lh-badge-text">
          <textPath href="#lh-circle" textLength="276" lengthAdjust="spacingAndGlyphs">
            LES JOURNÉES NATIONALES ✱ ÉDITION 2026 ✱
          </textPath>
        </text>
        <text className="lh-badge-star" x="60" y="66" textAnchor="middle">
          ↓
        </text>
      </svg>

      <div className="lh-scroll" aria-hidden="true">
        <span>Scroll</span>
        <i className="lh-scroll-line" />
      </div>
    </section>
  );
}
