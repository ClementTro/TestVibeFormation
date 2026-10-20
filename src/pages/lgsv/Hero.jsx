import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const root = useRef(null);

  useLayoutEffect(() => {
    let dead = false;
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const q = gsap.utils.selector(root.current);
      const words = q('.lg-word');
      const kicker = q('.lg-kicker');
      const date = q('.lg-date');
      const sub = q('.lg-sub');
      const ctas = q('.lg-ctas a');
      const orgs = q('.lg-orgs');
      const badge = q('.lg-badge');
      const hint = q('.lg-scroll');

      if (reduced) {
        gsap.set([kicker, date, sub, orgs, hint], { opacity: 1, y: 0 });
        gsap.set(ctas, { opacity: 1, y: 0, scale: 1 });
        gsap.set(words, { yPercent: 0 });
        gsap.set(badge, { opacity: 1, scale: 1, rotation: 0 });
        return;
      }

      gsap.set(words, { yPercent: 120 });
      gsap.set([kicker, date], { y: 24, opacity: 0 });
      gsap.set(sub, { y: 26, opacity: 0 });
      gsap.set(ctas, { y: 26, opacity: 0, scale: 0.9 });
      gsap.set(orgs, { opacity: 0 });
      gsap.set(badge, { scale: 0, rotation: -120, opacity: 0 });
      gsap.set(hint, { opacity: 0 });

      const start = () => {
        if (dead) return;
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.to(kicker, { y: 0, opacity: 1, duration: 0.5 }, 0.1)
          .to(words, { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'back.out(1.55)' }, 0.25)
          .to(date, { y: 0, opacity: 1, duration: 0.55 }, 0.8)
          .to(badge, { scale: 1, rotation: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.7)' }, 0.9)
          .to(sub, { y: 0, opacity: 1, duration: 0.6 }, 0.95)
          .to(ctas, { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.09, ease: 'back.out(1.8)' }, 1.05)
          .to(orgs, { opacity: 1, duration: 0.6 }, 1.3)
          .to(hint, { opacity: 1, duration: 0.5 }, 1.6);

        gsap.to(badge, {
          rotation: 360,
          duration: 24,
          repeat: -1,
          ease: 'none',
          delay: 2.4,
          transformOrigin: '50% 50%',
        });
      };
      if (document.fonts?.ready) document.fonts.ready.then(start);
      else setTimeout(start, 200);

      // Parallaxe douce titre / blobs / badge à la souris (desktop)
      if (window.matchMedia('(pointer: fine)').matches) {
        const title = root.current.querySelector('.lg-title');
        const blobs = gsap.utils.toArray('.lg-blob', root.current);
        const onMove = (e) => {
          const r = root.current.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(title, { x: nx * 14, y: ny * 9, duration: 0.9, ease: 'power2.out' });
          gsap.to(badge, { x: nx * -20, y: ny * -13, duration: 1.1, ease: 'power2.out' });
          blobs.forEach((b, i) => {
            const f = [1.7, -1.3, 2.3][i % 3];
            gsap.to(b, { x: nx * 24 * f, y: ny * 17 * f, duration: 1.4 + i * 0.25, ease: 'power2.out' });
          });
        };
        root.current.addEventListener('mousemove', onMove);
      }
    }, root);

    return () => {
      dead = true;
      ctx.revert();
    };
  }, []);

  return (
    <section className="lg-hero" id="accueil" ref={root}>
      {/* blobs décoratifs à parallaxe */}
      <div className="lg-blob lg-blob--1" aria-hidden="true" />
      <div className="lg-blob lg-blob--2" aria-hidden="true" />
      <div className="lg-blob lg-blob--3" aria-hidden="true" />

      <div className="lg-content">
        <span className="lg-kicker">Le rendez-vous national de l’alimentation végétale</span>
        <h1 className="lg-title">
          <span className="lg-line">
            <span className="lg-word">La</span>{' '}
            <span className="lg-word">Grande</span>
          </span>
          <span className="lg-line">
            <span className="lg-word lg-word--ital">Semaine</span>
          </span>
          <span className="lg-line">
            <span className="lg-word lg-word--hl">Végétale</span>
          </span>
        </h1>

        <p className="lg-date">
          <span aria-hidden="true">✿</span> du 25 septembre au 4 octobre 2026 <span aria-hidden="true">✿</span>
        </p>

        <p className="lg-sub">
          Ateliers, dégustations, conférences, visites de potagers… Trouvez l’événement
          près de chez vous et découvrez une alimentation plus végétale, plus gourmande.
        </p>

        <div className="lg-ctas">
          <a href="#projet" className="lg-btn lg-btn--lime">
            Trouver un événement
          </a>
          <a href="#organisateur" className="lg-btn lg-btn--deep">
            Inscrire son événement
          </a>
        </div>

        <p className="lg-orgs">
          Organisée par <strong>AVF</strong> · <strong>Make Org Foundation</strong> · <strong>InterVeg</strong>
        </p>
      </div>

      {/* Badge circulaire rotatif */}
      <svg className="lg-badge" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <path id="lg-circle" d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
        </defs>
        <text className="lg-badge-text">
          <textPath href="#lg-circle" textLength="276" lengthAdjust="spacingAndGlyphs">
            LA GRANDE SEMAINE VÉGÉTALE ✿ ÉDITION 2026 ✿
          </textPath>
        </text>
        <text className="lg-badge-flower" x="60" y="70" textAnchor="middle">
          ✿
        </text>
      </svg>

      <div className="lg-scroll" aria-hidden="true">
        <span>Scroll</span>
        <i className="lg-scroll-line" />
      </div>
    </section>
  );
}
