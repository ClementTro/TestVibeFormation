/**
 * Manifeste — fond crème (DA officielle), typographie éditoriale bleu nuit,
 * blobs organiques qui respirent, mots-clés surlignés aux couleurs du kit.
 */
export default function SnpsManifeste() {
  return (
    <section className="sn-manifeste" id="manifeste">
      <span className="sn-blob sn-blob--a" aria-hidden="true" />
      <span className="sn-blob sn-blob--b" aria-hidden="true" />
      <span className="sn-plus sn-plus--m1" aria-hidden="true">✚</span>
      <span className="sn-plus sn-plus--m2" aria-hidden="true">✚</span>

      <div className="sn-container">
        <span className="sn-kicker sn-kicker--ink" data-reveal>
          Le manifeste
        </span>

        <p className="sn-manifeste-lead" data-reveal>
          La <strong>SNPS</strong>, du 1er au 7 juin 2026, est la{' '}
          <mark className="sn-mark sn-mark--yellow">première édition</mark> d&rsquo;un
          événement national dédié à la <mark className="sn-mark sn-mark--magenta">prévention santé</mark>.
          Partout en France, elle met en lumière les initiatives locales qui permettent
          à chacun d&rsquo;agir concrètement pour sa santé, au quotidien.
        </p>

        <p className="sn-manifeste-body" data-reveal>
          Pendant une semaine, les citoyens peuvent découvrir et participer à des actions
          variées autour de la nutrition, de l&rsquo;activité physique, de la santé mentale,
          du sommeil, de la santé environnementale, et d&rsquo;autres sujets liés à la
          prévention santé. L&rsquo;objectif&nbsp;: rendre la prévention{' '}
          <mark className="sn-mark sn-mark--cyan">plus visible</mark>,{' '}
          <mark className="sn-mark sn-mark--coral">plus accessible</mark>, et valoriser
          ce qui existe déjà sur les territoires.
        </p>

        <div className="sn-goals">
          <article className="sn-goal" data-reveal>
            <span className="sn-goal-icon sn-goal-icon--yellow" aria-hidden="true">✚</span>
            <h3 className="sn-goal-title">Plus visible</h3>
            <p>
              Faire sortir la prévention des coulisses et lui donner un rendez-vous
              national, à hauteur de son importance.
            </p>
          </article>
          <article className="sn-goal" data-reveal>
            <span className="sn-goal-icon sn-goal-icon--coral" aria-hidden="true">✚</span>
            <h3 className="sn-goal-title">Plus accessible</h3>
            <p>
              Des actions près de chez soi, ouvertes à toutes et à tous, sans jargon
              ni protocole compliqué.
            </p>
          </article>
          <article className="sn-goal" data-reveal>
            <span className="sn-goal-icon sn-goal-icon--magenta" aria-hidden="true">✚</span>
            <h3 className="sn-goal-title">Valoriser les territoires</h3>
            <p>
              Mettre en lumière ce qui existe déjà partout en France, et donner envie
              d&rsquo;y prendre part.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
