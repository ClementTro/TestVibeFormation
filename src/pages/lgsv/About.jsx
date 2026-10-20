import Vine from './Vine.jsx';

const AUDIENCES = [
  'Citoyen·ne·s',
  'Associations',
  'Restaurateurs',
  'Établissements scolaires',
  'Entreprises',
  'Producteurs',
  'Acteurs de la santé',
  'Lieux culturels',
  'Collectivités',
];

export default function About() {
  return (
    <section className="lg-about" id="projet">
      <Vine side="left" seed={7} stem="#004900" leaf="#d5f683" />
      <div className="container lg-about-inner">
        <span className="lg-kicker" data-reveal>
          Qu’est-ce que c’est ?
        </span>
        <h2 className="lg-title" data-reveal>
          Dix jours pour apprendre, cuisiner
          <br />
          <em className="lg-em">et se régaler</em> autrement.
        </h2>
        <p className="lg-lead" data-reveal>
          La Grande Semaine Végétale est le rendez-vous national qui rassemble pendant dix jours des
          événements partout en France pour apprendre à cuisiner, découvrir et adopter une alimentation
          plus végétale. Ateliers, dégustations, conférences, visites de potagers… Trouvez l’événement
          près de chez vous.
        </p>

        <div className="lg-audiences">
          <span className="lg-audiences-label" data-reveal>
            Pour qui ?
          </span>
          <ul className="lg-chips">
            {AUDIENCES.map((a) => (
              <li className="lg-chip" data-reveal key={a}>
                <span aria-hidden="true">✿</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
