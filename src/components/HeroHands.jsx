/**
 * Mains + outils stylisés "pop-art / punk-zine".
 * Silhouettes noires + trame halftone (motif de points SVG).
 * 100% originaux, dessinés à la main en SVG.
 */

function HalftonePattern({ id }) {
  return (
    <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
      <circle cx="5" cy="5" r="2.4" fill="#111" />
    </pattern>
  );
}

/** Main tenant un marteau — arrive du coin haut-gauche */
export function HammerHand({ className }) {
  return (
    <svg className={className} viewBox="0 0 460 460" aria-hidden="true">
      <defs>
        <HalftonePattern id="ht-hammer" />
      </defs>
      {/* tête du marteau */}
      <g transform="rotate(-34 330 60)">
        <rect x="262" y="28" width="136" height="62" rx="14" fill="#111" />
        <rect x="284" y="44" width="40" height="12" rx="6" fill="#ffd500" />
      </g>
      {/* manche */}
      <line x1="170" y1="170" x2="330" y2="60" stroke="#111" strokeWidth="28" strokeLinecap="round" />
      {/* avant-bras venant du coin */}
      <line x1="14" y1="14" x2="170" y2="170" stroke="#111" strokeWidth="104" strokeLinecap="round" />
      <line x1="14" y1="14" x2="170" y2="170" stroke="url(#ht-hammer)" strokeWidth="90" strokeLinecap="round" />
      {/* poing */}
      <circle cx="170" cy="170" r="72" fill="#111" />
      <circle cx="170" cy="170" r="58" fill="url(#ht-hammer)" />
      {/* phalanges qui agrippent le manche */}
      <circle cx="222" cy="138" r="14" fill="#111" />
      <circle cx="234" cy="156" r="14" fill="#111" />
      <circle cx="240" cy="176" r="14" fill="#111" />
      {/* pouce */}
      <circle cx="212" cy="212" r="16" fill="#111" />
    </svg>
  );
}

/** Main tenant un tournevis — arrive du bas-gauche */
export function ScrewdriverHand({ className }) {
  return (
    <svg className={className} viewBox="0 0 460 460" aria-hidden="true">
      <defs>
        <HalftonePattern id="ht-screw" />
      </defs>
      {/* lame */}
      <line x1="255" y1="300" x2="415" y2="300" stroke="#111" strokeWidth="15" strokeLinecap="round" />
      <polygon points="408,288 444,300 408,312" fill="#111" />
      {/* manche du tournevis */}
      <rect x="208" y="276" width="82" height="48" rx="22" fill="#111" />
      <rect x="226" y="288" width="8" height="24" rx="4" fill="#ffd500" />
      <rect x="244" y="288" width="8" height="24" rx="4" fill="#ffd500" />
      <rect x="262" y="288" width="8" height="24" rx="4" fill="#ffd500" />
      {/* avant-bras venant de la gauche */}
      <line x1="-6" y1="300" x2="150" y2="300" stroke="#111" strokeWidth="104" strokeLinecap="round" />
      <line x1="-6" y1="300" x2="150" y2="300" stroke="url(#ht-screw)" strokeWidth="90" strokeLinecap="round" />
      {/* poing */}
      <circle cx="162" cy="300" r="70" fill="#111" />
      <circle cx="162" cy="300" r="56" fill="url(#ht-screw)" />
      {/* phalanges */}
      <circle cx="214" cy="276" r="13" fill="#111" />
      <circle cx="222" cy="300" r="13" fill="#111" />
      <circle cx="214" cy="324" r="13" fill="#111" />
    </svg>
  );
}

/** Main tenant une aiguille + fil — arrive de la droite */
export function NeedleHand({ className }) {
  return (
    <svg className={className} viewBox="0 0 460 460" aria-hidden="true">
      <defs>
        <HalftonePattern id="ht-needle" />
      </defs>
      {/* aiguille */}
      <line x1="255" y1="230" x2="130" y2="270" stroke="#111" strokeWidth="9" strokeLinecap="round" />
      <polygon points="130,270 106,275 126,286" fill="#111" />
      {/* fil ondulé */}
      <path
        d="M114 280 C 78 322 44 258 8 310 S 58 382 18 434"
        stroke="#111"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      {/* avant-bras venant de la droite */}
      <line x1="466" y1="206" x2="310" y2="232" stroke="#111" strokeWidth="104" strokeLinecap="round" />
      <line x1="466" y1="206" x2="310" y2="232" stroke="url(#ht-needle)" strokeWidth="90" strokeLinecap="round" />
      {/* poing */}
      <circle cx="300" cy="240" r="66" fill="#111" />
      <circle cx="300" cy="240" r="52" fill="url(#ht-needle)" />
      {/* doigts qui pincent l'aiguille */}
      <circle cx="252" cy="220" r="12" fill="#111" />
      <circle cx="246" cy="246" r="12" fill="#111" />
    </svg>
  );
}