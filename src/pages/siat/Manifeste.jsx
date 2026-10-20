import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Le manifeste, découpé mot à mot. Les mots « surlignés » recevront
   un tampon corail au fil du scroll (voir WORDS/HL plus bas). */
const WORDS = [
  'L’intelligence', 'artificielle', 'n’est', 'plus', 'confinée', 'aux', 'laboratoires.',
  'Elle', 'écrit,', 'calcule,', 'traduit,', 'écoute', '—', 'et', 'façonne', 'déjà',
  'nos', 'écoles,', 'nos', 'métiers,', 'nos', 'villages,', 'nos', 'poches.',
  'Sept', 'jours', 'd’ateliers,', 'de', 'rencontres', 'et', 'd’expériences', 'partout', 'en', 'France',
  'pour', 'transformer', 'la', 'curiosité', 'en', 'confiance,', 'la', 'méfiance', 'en', 'savoir-faire.',
  'Comprendre', 'l’IA,', 'c’est', 'pouvoir', 'choisir.',
];
const HL = new Set(['France', 'confiance,', 'savoir-faire.', 'choisir.']);

/**
 * SECTION ÉPINGLÉE — le manifeste se révèle mot à mot pendant que
 * la page défile (desktop, motion autorisée). Les mots-clés se font
 * tamponner d'un sticker corail incliné à leur tour. Sur mobile ou
 * si prefers-reduced-motion : texte entièrement visible, sans épingle.
 */
export default function Manifeste() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
      const words = gsap.utils.toArray('.ia-man-word', root.current);
      const marks = gsap.utils.toArray('.ia-man-mark', root.current);
      if (!words.length) return;

      gsap.set(words, { opacity: 0.16 });
      gsap.set(marks, { scaleX: 0, transformOrigin: '0% 50%' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=' + Math.max(900, words.length * 44),
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });
      words.forEach((w, i) => {
        tl.to(w, { opacity: 1, duration: 0.5, ease: 'none' }, i * 0.44);
      });
      marks.forEach((m) => {
        const i = words.indexOf(m.closest('.ia-man-word'));
        if (i >= 0) tl.to(m, { scaleX: 1, duration: 0.42, ease: 'none' }, i * 0.44 + 0.2);
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set(words, { opacity: 1 });
        gsap.set(marks, { scaleX: 1 });
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="ia-man" id="manifeste" ref={root}>
      <div className="container ia-man-inner">
        <span className="ia-kicker ia-kicker--light" data-reveal>
          Le manifeste
        </span>
        <h2 className="ia-man-title" data-reveal>
          L’IA s’explique, la confiance se construit
        </h2>
        <p className="ia-man-text">
          {WORDS.map((w, i) => (
            <span key={i} className={`ia-man-word${HL.has(w) ? ' ia-man-word--hl' : ''}`}>
              {HL.has(w) ? (
                <>
                  <span className="ia-man-mark" aria-hidden="true" />
                  <span className="ia-man-txt">{w}</span>
                </>
              ) : (
                w
              )}{' '}
            </span>
          ))}
        </p>
        <p className="ia-man-note" data-reveal>
          — Le manifeste de la Semaine de l’IA pour Tous
        </p>
      </div>
    </section>
  );
}
