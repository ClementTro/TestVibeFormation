import { BASE } from '../data/themes.js';
import Magnetic from './Magnetic.jsx';

export default function FinalCta() {
  return (
    <section className="ln-final">
      <div className="container">
        <span className="ln-kicker" data-reveal>
          La question est simple
        </span>
        <h2 className="ln-final-title" data-reveal>
          Prêt·e à passer
          <br />à l'action&nbsp;?
        </h2>
        <div className="ln-final-cta" data-reveal>
          <Magnetic strength={0.4}>
            <a href={`${BASE}jnr`} className="lh-btn lh-btn--yellow ln-final-btn">
              Trouver un événement
            </a>
          </Magnetic>
        </div>
        <p className="ln-final-note" data-reveal>
          Un événement près de chez toi, des mains expertes, et l'envie de faire durer
          les choses — c'est tout ce qu'il faut.
        </p>
      </div>
    </section>
  );
}
