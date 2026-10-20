import Marquee from './Marquee.jsx';

const RECIPES = [
  'Risotto de courge butternut',
  'Dahl de lentilles corail',
  'Tajine de pois chiches',
  'Pâtes au pesto de basilic',
  'Velouté de potimarron',
  'Salade de quinoa & herbes',
  'Burger de betterave',
  'Clafoutis aux cerises',
];

export default function Recipes() {
  return (
    <section className="lg-recipes" id="livret">
      <div className="lg-recipes-stage">
        {/* anneau pointillé rotatif */}
        <svg className="lg-ring" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <circle cx="100" cy="100" r="92" stroke="#004900" strokeWidth="1.6" strokeDasharray="3 10" strokeLinecap="round" />
          <circle cx="100" cy="100" r="70" stroke="#004900" strokeWidth="1.2" strokeDasharray="2 8" strokeLinecap="round" opacity="0.5" />
        </svg>

        <div className="lg-recipes-inner" data-reveal>
          <span className="lg-kicker">Le livret de recettes végétales</span>
          <h2 className="lg-title">
            Une cuisine gourmande,
            <br />
            <em className="lg-em">100&nbsp;% végétale</em>.
          </h2>
          <p className="lg-lead lg-lead--center">
            Téléchargez gratuitement notre livret de recettes végétales —
            des idées simples, généreuses et de saison, pour se régaler autrement
            tous les jours.
          </p>
          <a
            className="lg-btn lg-btn--deep lg-btn--big"
            href="https://lagrandesemainevegetale.fr/"
            target="_blank"
            rel="noreferrer"
          >
            Télécharger le livret — c’est gratuit ↗
          </a>
        </div>
      </div>

      <Marquee items={RECIPES} variant="lg-mq--recipes" />
    </section>
  );
}
