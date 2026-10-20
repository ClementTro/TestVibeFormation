import { useState } from 'react';
import SnpsMagnetic from './SnpsMagnetic.jsx';

/**
 * CTA final — le slogan officiel du site + les deux boutons d'action,
 * puis la newsletter. Boutons magnétiques, fond violet → nuit.
 */
export default function SnpsCta() {
  const [msg, setMsg] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setMsg('Merci ! Vous serez informé·e·s des actualités de la SNPS. (Démo — aucune donnée n’est envoyée.)');
  };

  return (
    <section className="sn-cta" id="participer">
      <span className="sn-plus sn-plus--c1" aria-hidden="true">✚</span>
      <span className="sn-plus sn-plus--c2" aria-hidden="true">✚</span>
      <span className="sn-blob sn-blob--c" aria-hidden="true" />

      <div className="sn-container sn-cta-inner">
        <span className="sn-kicker sn-kicker--violet" data-reveal>
          Passer à l&rsquo;action
        </span>
        <h2 className="sn-cta-title" data-reveal>
          je veux prendre part à la{' '}
          <em className="sn-cta-em">semaine nationale de la prévention santé</em>&nbsp;!
        </h2>

        <div className="sn-cta-btns" data-reveal>
          <SnpsMagnetic strength={0.4}>
            <a href="#contact" className="sn-btn sn-btn--yellow">
              Proposer mon évènement
            </a>
          </SnpsMagnetic>
          <SnpsMagnetic strength={0.4}>
            <a href="#contact" className="sn-btn sn-btn--ghost">
              Participer à un évènement
            </a>
          </SnpsMagnetic>
        </div>

        <form className="sn-news" onSubmit={onSubmit} data-reveal>
          <p className="sn-news-lead">
            <label htmlFor="sn-news-email">
              Soyez tenu·e·s informé·e·s des actualités de la Semaine Nationale de la
              Prévention Santé.
            </label>
          </p>
          <div className="sn-news-row">
            <input
              id="sn-news-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="votre@email.fr"
            />
            <button type="submit" className="sn-btn sn-btn--yellow">
              Je m&rsquo;inscris
            </button>
          </div>
          <p className="sn-news-msg" role="status">
            {msg}
          </p>
        </form>
      </div>
    </section>
  );
}
