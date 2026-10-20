import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PLUS_COLORS = ['#FFED0B', '#64EDFF', '#F70BCA', '#F56476', '#FFFFFF'];

/* Forme d'onde ECG — une période normalisée t ∈ [0, 1) */
const gauss = (t, mu, s) => Math.exp(-((t - mu) ** 2) / (2 * s * s));
const ecgWave = (t) =>
  0.14 * gauss(t, 0.16, 0.03) + // onde P
  -0.1 * gauss(t, 0.375, 0.01) + // creux Q
  1.0 * gauss(t, 0.4, 0.013) + // pic R
  -0.28 * gauss(t, 0.425, 0.016) + // creux S
  0.2 * gauss(t, 0.64, 0.05); // onde T

/**
 * Hero SNPS : violet officiel, croix ✚ flottantes répulsées par la souris,
 * et une ligne ECG cyan qui traverse l'écran — son battement s'emballe
 * avec le scroll (la page a un cœur, il bat plus fort quand on bouge).
 */
export default function SnpsHero() {
  const root = useRef(null);
  const canvasRef = useRef(null);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    const hero = root.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = hero.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };
    resize();

    // Croix ✚ flottantes (identité graphique du site officiel)
    const count = Math.min(30, Math.max(12, Math.round(canvas.width / dpr / 85)));
    const plus = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3 * dpr,
      vy: (Math.random() - 0.5) * 0.3 * dpr,
      s: (7 + Math.random() * 12) * dpr,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.01,
      phase: Math.random() * Math.PI * 2,
      c: PLUS_COLORS[(Math.random() * PLUS_COLORS.length) | 0],
      a: 0.3 + Math.random() * 0.4,
    }));

    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let energy = 0; // 0 → 1 : l'énergie de scroll intensifie le battement
    let lastScroll = window.scrollY;

    const drawPlus = (p) => {
      const pulse = 0.9 + 0.1 * Math.sin(p.phase);
      const t = p.s * pulse;
      const w = p.s * 0.26;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.a * (0.75 + 0.25 * Math.sin(p.phase));
      ctx.fillStyle = p.c;
      ctx.fillRect(-t / 2, -w / 2, t, w);
      ctx.fillRect(-w / 2, -t / 2, w, t);
      ctx.restore();
    };

    const drawEcg = (nowMs) => {
      const w = canvas.width;
      const h = canvas.height;
      const midY = h * 0.72;
      const amp = Math.min(h * 0.13, 120 * dpr) * (0.8 + 0.45 * energy);
      const span = 5.2; // secondes visibles à l'écran
      const bpm = 58 + energy * 36; // repos 58 bpm, s'emballe au scroll
      const period = 60 / bpm;
      const tNow = nowMs / 1000;
      const start = tNow - span;
      const steps = Math.max(48, Math.round(w / (8 * dpr)));

      const trace = () => {
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const t = start + (i / steps) * span;
          const y = midY - ecgWave((t / period) % 1) * amp;
          const x = (i / steps) * w;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      };

      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#64EDFF';
      // passe halo
      ctx.globalAlpha = 0.13 + 0.1 * energy;
      ctx.lineWidth = 8 * dpr;
      trace();
      ctx.stroke();
      // passe fine
      ctx.globalAlpha = 0.65 + 0.25 * energy;
      ctx.lineWidth = 2.4 * dpr;
      trace();
      ctx.stroke();

      // tête lumineuse du tracé
      const headY = midY - ecgWave((tNow / period) % 1) * amp;
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#64EDFF';
      ctx.beginPath();
      ctx.arc(w - 2, headY, 11 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(w - 2, headY, 3.4 * dpr, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (now) => {
      const w = canvas.width;
      const h = canvas.height;

      // hors écran → on garde le rAF mais on ne dessine pas
      const r = canvas.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        ctx.clearRect(0, 0, w, h);

        // le scroll donne de l'énergie au battement
        const dy = Math.abs(window.scrollY - lastScroll);
        lastScroll = window.scrollY;
        energy += (Math.min(1, dy / 24) - energy) * 0.07;

        drawEcg(now);

        for (const p of plus) {
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vr;
          p.phase += 0.025;
          const dxm = p.x - mouse.x;
          const dym = p.y - mouse.y;
          const dm = Math.hypot(dxm, dym);
          if (dm < 150 * dpr && dm > 0.001) {
            const f = (1 - dm / (150 * dpr)) * 0.7 * dpr;
            p.x += (dxm / dm) * f;
            p.y += (dym / dm) * f;
          }
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
          drawPlus(p);
        }
        ctx.globalAlpha = 1;
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    };
    draw(performance.now());

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

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const q = gsap.utils.selector(root.current);
      const words = q('.sn-word');
      const kicker = q('.sn-hero-kicker');
      const sub = q('.sn-hero-sub');
      const ctas = q('.sn-hero-ctas a');
      const badge = q('.sn-badge');
      const heart = q('.sn-badge-heart');
      const hint = q('.sn-scroll');
      const canvas = q('.sn-hero-canvas');

      // ---- Intro cinétique
      if (reduced) {
        gsap.set([kicker, sub, ctas, hint, canvas, badge], { opacity: 1, y: 0 });
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

        // rotation infinie du badge + cœur qui bat
        gsap.to(badge, {
          rotation: 360,
          duration: 18,
          repeat: -1,
          ease: 'none',
          delay: 2,
          transformOrigin: '50% 50%',
        });
        gsap.to(heart, {
          scale: 1.22,
          transformOrigin: '50% 50%',
          duration: 0.5,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          delay: 2,
        });
      };
      if (document.fonts?.ready) document.fonts.ready.then(start);
      else setTimeout(start, 200);

      // ---- Parallaxe du titre à la souris (desktop)
      if (window.matchMedia('(pointer: fine)').matches) {
        const title = root.current.querySelector('.sn-hero-title');
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

    const cleanupCanvas = initCanvas();
    return () => {
      cleanupCanvas?.();
      ctx.revert();
    };
  }, []);

  return (
    <section className="sn-hero" id="accueil" ref={root}>
      <canvas className="sn-hero-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="sn-hero-content">
        <span className="sn-kicker sn-kicker--violet sn-hero-kicker">
          1ère édition · du 1er au 7 juin 2026
        </span>
        <h1 className="sn-hero-title">
          <span className="sn-line">
            <span className="sn-word">semaine</span> <span className="sn-word">nationale</span>
          </span>
          <span className="sn-line">
            <span className="sn-word">de la</span> <span className="sn-word sn-word--lime">prévention</span>
          </span>
          <span className="sn-line">
            <span className="sn-word sn-word--lime">santé</span>
          </span>
        </h1>
        <p className="sn-hero-sub">
          La première édition d&rsquo;un événement national dédié à la prévention santé.
          Partout en France, des initiatives locales pour agir concrètement, au quotidien.
        </p>
        <div className="sn-hero-ctas">
          <a href="#participer" className="sn-btn sn-btn--yellow">
            Proposer mon évènement
          </a>
          <a href="#participer" className="sn-btn sn-btn--ghost">
            Participer à un évènement
          </a>
        </div>
      </div>

      {/* Badge rotatif : la page a un cœur, il bat */}
      <svg className="sn-badge" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <path id="sn-badge-circle" d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
        </defs>
        <text className="sn-badge-text">
          <textPath href="#sn-badge-circle" textLength="276" lengthAdjust="spacingAndGlyphs">
            SEMAINE NATIONALE DE LA PRÉVENTION SANTÉ ✚ ÉDITION 2026 ✚
          </textPath>
        </text>
        <text className="sn-badge-heart" x="60" y="70" textAnchor="middle">
          ♥
        </text>
      </svg>

      <div className="sn-scroll" aria-hidden="true">
        <span>Scroll</span>
        <i className="sn-scroll-line" />
      </div>
    </section>
  );
}
