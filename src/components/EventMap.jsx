const MAP_URL = 'https://b3433d84-3c04-43b7-b357-b6ce2c5210c7.pub.instances.scw.cloud';

/**
 * Carte interactive des événements JNR, intégrée en iframe.
 * L'app carto est hébergée à part (instance Scaleway) et reste
 * pleinement interactive : zoom, recherche, fiches ateliers…
 */
export default function EventMap() {
  return (
    <section className="section map-section" id="carte">
      <div className="container">
        <span className="kicker" data-reveal>
          Carte des ateliers
        </span>
        <h2 className="section-title" data-reveal>
          Trouvez un événement près de chez vous&nbsp;!
        </h2>
        <p className="section-lead" data-reveal>
          Des centaines d'ateliers ouvrent leurs portes partout en France du 15 au 18 octobre 2026.
          Zoomez, explorez et cliquez sur un point pour découvrir l'atelier le plus proche.
        </p>

        <div className="map-frame" data-reveal>
          <iframe
            src={MAP_URL}
            title="Carte interactive des Journées Nationales de la Réparation"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
