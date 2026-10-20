import { useLayoutEffect, useRef } from 'react';

/* Palette « feuillage » dérivée de la DA du site officiel
   (lime #d5f683, verts profonds #004900/#003500, beurre #fff1ba,
   ciel #a5e3ff, menthe #b2e8e0). */
const PALETTE = [
  { fill: '#d5f683', vein: '#3e7a12' },
  { fill: '#9ed46e', vein: '#2c6b1e' },
  { fill: '#3f9b43', vein: '#003500' },
  { fill: '#fff1ba', vein: '#a5831a' },
  { fill: '#a5e3ff', vein: '#3a7ea6' },
  { fill: '#b2e8e0', vein: '#1d7a68' },
  { fill: '#e6f39e', vein: '#6a8f1f' },
];

/**
 * Dessine une feuille botanique : tige, limbe en double bézier,
 * nervure médiane et 3 paires de nervures latérales.
 * flip ≈ « vrille » en trompe-l'œil 3D (échelle horizontale oscillante).
 */
function drawLeaf(ctx, l, time) {
  const s = l.size;
  const flip = Math.abs(Math.sin(time * l.fSpeed + l.fPhase));
  ctx.save();
  ctx.translate(l.x, l.y);
  ctx.rotate(l.rot);
  ctx.scale(0.35 + 0.65 * flip, 1);
  ctx.globalAlpha = l.alpha;

  // tige
  ctx.strokeStyle = l.p.vein;
  ctx.lineWidth = Math.max(1, s * 0.05);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, s * 0.5);
  ctx.lineTo(0, s * 0.78);
  ctx.stroke();

  // limbe
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.5);
  ctx.bezierCurveTo(s * 0.42, -s * 0.3, s * 0.4, s * 0.16, 0, s * 0.52);
  ctx.bezierCurveTo(-s * 0.4, s * 0.16, -s * 0.42, -s * 0.3, 0, -s * 0.5);
  ctx.closePath();
  ctx.fillStyle = l.p.fill;
  ctx.fill();
  ctx.lineWidth = Math.max(1, s * 0.045);
  ctx.strokeStyle = l.p.vein;
  ctx.globalAlpha = l.alpha * 0.4;
  ctx.stroke();

  // nervure médiane + nervures latérales
  ctx.globalAlpha = l.alpha * 0.55;
  ctx.lineWidth = Math.max(0.8, s * 0.035);
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.4);
  ctx.quadraticCurveTo(s * 0.04, 0, 0, s * 0.42);
  ctx.stroke();
  for (let k = 1; k <= 3; k++) {
    const y = -s * 0.26 + k * s * 0.2;
    const len = s * 0.3 * (1 - k * 0.16);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(len * 0.5, y + s * 0.02, len, y - s * 0.07);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(-len * 0.5, y + s * 0.02, -len, y - s * 0.07);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * EFFET SIGNATURE n°1 — pluie de feuilles plein écran.
 * Canvas fixe : les feuilles tombent en dérivant (balancement sinusoïdal,
 * rotation, vrille), et tourbillonnent au passage du curseur.
 * Respecte prefers-reduced-motion (une seule image statique).
 */
export default function Leaves() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const spawn = (anywhere) => ({
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : -50 - Math.random() * 120,
      size: 13 + Math.random() * 20,
      vy: 0.45 + Math.random() * 0.85,
      ivx: 0,
      ivy: 0,
      rot: Math.random() * Math.PI * 2,
      rSpeed: (Math.random() - 0.5) * 0.05,
      swayA: 0.25 + Math.random() * 0.5,
      swayF: 0.6 + Math.random() * 1.4,
      swayP: Math.random() * Math.PI * 2,
      fSpeed: 0.7 + Math.random() * 1.3,
      fPhase: Math.random() * Math.PI * 2,
      alpha: 0.72 + Math.random() * 0.28,
      p: PALETTE[(Math.random() * PALETTE.length) | 0],
    });

    const count = Math.round(
      Math.min(30, Math.max(12, (W * H) / 42000))
    );
    const leaves = Array.from({ length: count }, () => spawn(true));

    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let last = 0;

    const frame = (ts) => {
      const time = ts / 1000;
      const dt = Math.min(3, Math.max(0.25, last ? (ts - last) / 16.667 : 1));
      last = ts;
      ctx.clearRect(0, 0, W, H);

      for (const l of leaves) {
        // balancement sinusoïdal + inertie héritée du passage du curseur
        const sway = Math.sin(time * l.swayF + l.swayP) * l.swayA;
        l.x += (l.ivx + sway) * dt;
        l.y += (l.vy + l.ivy) * dt;
        l.rot += l.rSpeed * dt;

        // tourbillon autour du curseur : poussée radiale + composante tangentielle
        const dx = l.x - mouse.x;
        const dy = l.y - mouse.y;
        const d = Math.hypot(dx, dy);
        const R = 150;
        if (d < R && d > 0.001) {
          const f = 1 - d / R;
          const nx = dx / d;
          const ny = dy / d;
          l.ivx += (nx * 1.3 - ny * 0.85) * f * f * dt;
          l.ivy += (ny * 1.1 + nx * 0.65) * f * f * dt;
        }
        // amortissement des impulsions
        const damp = 1 / (1 + 0.055 * dt);
        l.ivx *= damp;
        l.ivy *= damp;
        l.ivx = Math.max(-5, Math.min(5, l.ivx));
        l.ivy = Math.max(-5, Math.min(5, l.ivy));

        // recyclage
        if (l.y > H + 70) {
          Object.assign(l, spawn(false));
        } else if (l.x < -90) {
          l.x = W + 80;
        } else if (l.x > W + 90) {
          l.x = -80;
        }

        drawLeaf(ctx, l, time);
      }
      raf = requestAnimationFrame(frame);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      for (const l of leaves) drawLeaf(ctx, l, 1.4);
    };

    if (reduced) {
      drawStatic();
    } else {
      raf = requestAnimationFrame(frame);
    }

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onOut = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onResize = () => {
      resize();
      if (reduced) drawStatic();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onOut);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onOut);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas className="lg-leaves" ref={ref} aria-hidden="true" />;
}
