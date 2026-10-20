export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <p className="footer-logo">
            Journées Nationales <em>de la Réparation</em>
          </p>
          <p style={{ maxWidth: 380, fontWeight: 600 }}>
            Rendez-vous du 15 au 18 octobre 2026, partout en France. Réparer, c'est déjà agir.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Menu</h4>
            <ul>
              <li>
                <a href="#actualites">Actualités</a>
              </li>
              <li>
                <a href="#manifeste">Organisateurs</a>
              </li>
              <li>
                <a href="#partenaires">Ressources</a>
              </li>
              <li>
                <a href="#">Presse</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Réseaux</h4>
            <ul>
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">LinkedIn</a>
              </li>
              <li>
                <a href="#">Instagram</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Événement</h4>
            <ul>
              <li>
                <a href="#newsletter">Trouver un événement</a>
              </li>
              <li>
                <a href="#newsletter">Newsletter réparateur</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Journées Nationales de la Réparation. Mentions légales.</span>
          <span>Refonte de démonstration non officielle, inspirée de journeesreparation.fr</span>
        </div>
      </div>
    </footer>
  );
}