import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { target: 80, suffix: '%', text: "des participant·es découvrent que réparer coûte moins cher qu'imaginé" },
  { target: 1900, suffix: ' €', text: "économisés par foyer en prolongeant la vie des produits de 3 ans (Ademe)" },
  { target: 500, suffix: '+', text: "ateliers qui ouvrent leurs portes partout en France pendant 4 jours" },
];

function formatNumber(n) {
  return n.toLocaleString('fr-FR');
}

export default function Manifesto() {
  const root = useRef(null);

  // Compteurs animés au premier passage à l'écran
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray('.stat-num', root.current);
      nums.forEach((el, i) => {
        const target = STATS[i].target;
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 80%',
          once: true,
          onEnter: () =>
            gsap.to(obj, {
              val: target,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = formatNumber(Math.round(obj.val)) + STATS[i].suffix;
              },
            }),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section manifesto" id="manifeste" ref={root}>
      <div className="container">
        <span className="kicker" data-reveal>
          Programmation 2026
        </span>
        <h2 className="section-title" data-reveal>
          Et si réparer devenait un réflexe malin&nbsp;?
        </h2>
        <p className="section-lead" data-reveal>
          Bon pour la planète, bon pour le porte-monnaie&nbsp;! Le prix reste l'un des principaux freins à
          la réparation — et pourtant, les Journées Nationales de la Réparation renversent les idées
          reçues. Moins de déchets, moins de gaspillage, moins de ressources extraites&nbsp;: derrière
          chaque objet réparé se cachent souvent des centaines d'euros économisés.
        </p>

        <div className="stats">
          {STATS.map((s, i) => (
            <div className="stat" key={i} data-reveal>
              <span className="stat-num">0{s.suffix}</span>
              <p>{s.text}</p>
            </div>
          ))}
        </div>

        <div className="manifesto-cta" data-reveal>
          <a href="#" className="btn btn--ink">
            Découvrir notre manifeste
          </a>
        </div>
      </div>
    </section>
  );
}