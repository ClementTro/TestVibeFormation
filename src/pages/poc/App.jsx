const MAP_URL = 'https://b3433d84-3c04-43b7-b357-b6ce2c5210c7.pub.instances.scw.cloud';

const styles = {
  iframe: {
    position: 'fixed',
    inset: 0,
    width: '100vw',
    height: '100vh',
    border: 0,
    display: 'block',
  },
};

/**
 * POC : la carte interactive JNR en plein écran, sans aucune chrome autour.
 */
export default function App() {
  return (
    <iframe
      src={MAP_URL}
      title="Carte interactive des Journées Nationales de la Réparation"
      allowFullScreen
      style={styles.iframe}
    />
  );
}
