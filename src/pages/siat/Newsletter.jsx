import { useState } from 'react';

/**
 * Newsletter (formulaire de démonstration, sans backend : un message
 * de confirmation micro-copié s'affiche) + bloc final « Proposer mon
 * évènement » avec le texte réel du site.
 */
export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (email.trim().includes('@')) setDone(true);
  };

  return (
    <section className="ia-news">
      <div className="container ia-news-grid">
        <div className="ia-news-card" id="newsletter" data-reveal>
          <span className="ia-kicker">Nos actus</span>
          <h2 className="ia-news-title">
            Soyez tenu·e·s informé·e·s des actualités de La Semaine de l’IA Pour Tous.
          </h2>

          {done ? (
            <p className="ia-news-done" aria-live="polite">
              <span className="ia-news-check" aria-hidden="true">
                ✓
              </span>
              C’est noté&nbsp;! À très vite pour les actualités de l’IA pour tous.
            </p>
          ) : (
            <form className="ia-news-form" onSubmit={submit}>
              <label className="ia-sr-only" htmlFor="ia-email">
                Votre adresse e-mail
              </label>
              <input
                id="ia-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="votre@email.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="ia-btn ia-btn--sm">
                Je m’inscris à la newsletter
              </button>
            </form>
          )}
          <p className="ia-news-hint">Un e-mail par mois maximum, zéro spam, désinscription en un clic.</p>
        </div>

        <div className="ia-news-cta" id="organiser" data-reveal>
          <span className="ia-kicker ia-kicker--light">Organiser un événement</span>
          <p className="ia-news-cta-text">
            «&nbsp;Je veux être un acteur de la semaine de l’IA pour tous et souhaite proposer
            un évènement.&nbsp;»
          </p>
          <a href="#contact" className="ia-btn">
            Proposer mon évènement
          </a>
        </div>
      </div>
    </section>
  );
}
