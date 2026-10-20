import { useState } from 'react';

export default function Newsletter() {
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (email.trim()) setDone(true);
  };

  return (
    <section className="section newsletter" id="newsletter">
      <div className="container">
        <div className="nl-card" data-reveal>
          <span className="kicker">Newsletter réparateur·ice</span>
          <h2 className="section-title">
            Tu es réparateur·ice ou pro&nbsp;?
          </h2>
          <p className="section-lead" style={{ marginInline: 'auto' }}>
            Inscris-toi à la newsletter pour ne manquer aucune info sur l'édition 2026&nbsp;!
          </p>

          {done ? (
            <p className="nl-done">Merci ! À très vite 🛠️</p>
          ) : (
            <form className="nl-form" onSubmit={submit}>
              <input
                type="email"
                required
                placeholder="ton@email.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Adresse email"
              />
              <button type="submit" className="btn">
                Je m'inscris à la newsletter
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}