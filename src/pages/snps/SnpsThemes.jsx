import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Les 5 thématiques du site officiel — chacune a sa couleur du kit
   et son propre rythme cardiaque. */
export const THEMES = [
  {
    key: 'nutrition',
    title: 'nutrition',
    bpm: 64,
    color: '#FFED0B',
    text: 'Bien manger, c’est déjà prévenir. Ateliers cuisine, marches découverte, conférences gourmandes : apprendre à composer son assiette sans se priver de plaisir.',
  },
  {
    key: 'activite',
    title: 'activité physique',
    bpm: 84,
    color: '#F56476',
    text: 'Bouger, un peu, souvent, partout. Initiations sportives, défis entre collègues, sorties à vélo : chaque geste compte, l’important est de se lancer.',
  },
  {
    key: 'mentale',
    title: 'santé mentale',
    bpm: 68,
    color: '#F70BCA',
    text: 'Prendre soin de sa tête, aussi. Ateliers respiration, cercles de parole, outils anti-stress : des espaces pour dire, écouter et souffler.',
  },
  {
    key: 'sommeil',
    title: 'sommeil',
    bpm: 54,
    color: '#64EDFF',
    text: 'Dormir, c’est se réparer. Siestes guidées, chronobiologie, protocoles de réveil : redécouvrir le sommeil comme un soin à part entière.',
  },
  {
    key: 'environnement',
    title: 'santé environnementale',
    bpm: 72,
    color: '#D4FF00',
    text: 'Un environnement sain, un corps en bonne santé. Air, eau, bruit, biodiversité : la prévention commence là où l’on vit.',
  },
];

/* Forme d'onde ECG — une période normalisée t ∈ [0, 1) */
const gauss = (t, mu, s) => Math.exp(-((t - mu) ** 2) / (2 * s * s));
const ecgWave = (t) =>
  0.14 * gauss(t, 0.16, 0.03) +
  -0.1 * gauss(t, 0.375, 0.01) +
  1.0 * gauss(t, 0.4, 0.013) +
  -0.28 * gauss(t, 0.425, 0.016) +
  0.2 * gauss(t, 0.64, 0.05);

/**
 * LES THÉMATIQUES — le moment signature : un moniteur cardiaque épinglé.
 * Le canvas ECG bat en continu, la fréquence cardiaque change selon la
 * thématique active (nutrition 64 bpm, sommeil 54 bpm, activité 84 bpm…),
 * pilotée par la scrub timeline du pin. Mobile / motion réduite : cartes.
 */
export default function SnpsThemes() {
  const root = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const bpmState = useRef(null); // partagé entre la timeline et le canvas

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    /* ---------- Moniteur épinglé (desktop, motion OK) ---------- */
    mm.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
      const stage = stageRef.current;
      const canvas = canvasRef.current;
      if (!stage || !canvas) return;

      /* ----- Canvas ECG : bat en continu, bpm lissé vers la cible ----- */
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const state = { bpm: THEMES[0].bpm, target: THEMES[0].bpm };
      bpmState.current = state;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const resize = () => {
        const r = stage.getBoundingClientRect();
        canvas.width = Math.max(1, Math.round(r.width * dpr));
        canvas.height = Math.max(1, Math.round(r.height * dpr));
      };
      resize();

      let raf = 0;
      const drawEcg = (nowMs) => {
        const w = canvas.width;
        const h = canvas.height;
        const midY = h * 0.78;
        const amp = Math.min(h * 0.09, 92 * dpr);
        const period = 60 / state.bpm;
        const tNow = nowMs / 1000;
        const span = 4.6;
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
        ctx.globalAlpha = 0.12;
        ctx.lineWidth = 8 * dpr;
        trace();
        ctx.stroke();
        ctx.globalAlpha = 0.62;
        ctx.lineWidth = 2.4 * dpr;
        trace();
        ctx.stroke();

        const headY = midY - ecgWave((tNow / period) % 1) * amp;
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = '#64EDFF';
        ctx.beginPath();
        ctx.arc(w - 2, headY, 10 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(w - 2, headY, 3.2 * dpr, 0, Math.PI * 2);
        ctx.fill();
      };

      const draw = (now) => {
        const r = canvas.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          state.bpm += (state.target - state.bpm) * 0.06;
          drawEcg(now);
        }
        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);

      /* ----- Timeline épinglée : thématiques + HUD ----- */
      const panels = gsap.utils.toArray('.sn-theme-panel', stage);
      const dots = gsap.utils.toArray('.sn-dot', stage);
      const bpmNum = stage.querySelector('.sn-bpm-num');
      const bpmLabel = stage.querySelector('.sn-bpm-label');
      const heart = stage.querySelector('.sn-hud-heart');
      const count = stage.querySelector('.sn-themes-count');

      gsap.set(panels, { opacity: 0, y: 60 });
      gsap.set(panels[0], { opacity: 1, y: 0 });

      const setActive = (i) => {
        dots.forEach((d, j) => d.classList.toggle('is-active', j === i));
        if (bpmNum) bpmNum.textContent = THEMES[i].bpm;
        if (bpmLabel) bpmLabel.textContent = 'rythme · ' + THEMES[i].title;
        if (count) count.textContent = '0' + (i + 1) + ' / 05';
        if (heart) heart.style.animationDuration = 60 / THEMES[i].bpm + 's';
        if (bpmState.current) bpmState.current.target = THEMES[i].bpm;
      };
      setActive(0);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => '+=' + Math.round(window.innerHeight * 4.4),
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.round(self.progress * (THEMES.length - 1));
            setActive(i);
          },
        },
      });

      THEMES.forEach((_, i) => {
        if (i === 0) return;
        tl.to(panels[i - 1], { opacity: 0, y: -60, duration: 0.45, ease: 'power2.in' }, (i - 1) + 0.2)
          .to(panels[i], { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, (i - 1) + 0.55);
      });

      return () => {
        cancelAnimationFrame(raf);
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set(panels, { clearProps: 'opacity,y' });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="sn-themes" id="thematiques" ref={root}>
      {/* ---- Écran de monitoring épinglé (desktop, motion OK) ---- */}
      <div className="sn-themes-stage" ref={stageRef}>
        <canvas className="sn-themes-canvas" ref={canvasRef} aria-hidden="true" />
        <div className="sn-themes-grid" aria-hidden="true" />

        <div className="sn-themes-head" aria-hidden="true">
          <span className="sn-themes-kicker">Les thématiques</span>
          <span className="sn-themes-count">01 / 05</span>
        </div>

        <div className="sn-themes-hud" aria-hidden="true">
          <span className="sn-hud-heart">♥</span>
          <span className="sn-bpm-num">{THEMES[0].bpm}</span>
          <span className="sn-bpm-unit">bpm</span>
          <span className="sn-bpm-label">rythme · {THEMES[0].title}</span>
        </div>

        <div className="sn-themes-center">
          {THEMES.map((t, i) => (
            <div
              className={'sn-theme-panel' + (i === 0 ? ' is-first' : '')}
              key={t.key}
              style={{ '--tc': t.color }}
              aria-hidden={i > 0 || undefined}
            >
              <span className="sn-theme-index">0{i + 1}</span>
              <h2 className="sn-theme-title">{t.title}</h2>
              <p className="sn-theme-text">{t.text}</p>
            </div>
          ))}
        </div>

        <div className="sn-themes-dots" aria-hidden="true">
          {THEMES.map((t, i) => (
            <span className={'sn-dot' + (i === 0 ? ' is-active' : '')} key={t.key} style={{ '--tc': t.color }} />
          ))}
        </div>
      </div>

      {/* ---- Version cartes (mobile / motion réduite) ---- */}
      <div className="sn-themes-cards">
        <div className="sn-container">
          <span className="sn-kicker sn-kicker--night" data-reveal>
            Les thématiques
          </span>
          <h2 className="sn-themes-title" data-reveal>
            Une semaine, cinq chants
          </h2>
          <p className="sn-themes-lead" data-reveal>
            Des actions variées autour de la nutrition, de l&rsquo;activité physique, de la
            santé mentale, du sommeil et de la santé environnementale.
          </p>
          <div className="sn-themes-grid-cards">
            {THEMES.map((t, i) => (
              <article className="sn-theme-card" key={t.key} style={{ '--tc': t.color }} data-reveal>
                <header className="sn-theme-card-head">
                  <span className="sn-theme-card-icon" aria-hidden="true">✚</span>
                  <span className="sn-theme-card-bpm">~{t.bpm} bpm</span>
                </header>
                <h3 className="sn-theme-card-title">{t.title}</h3>
                <p className="sn-theme-card-text">{t.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
