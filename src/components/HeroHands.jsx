/**
 * Mains + outils stylisés "pop-art / punk-zine".
 * Silhouettes noires + trame halftone (motif de points SVG).
 * 100% originaux, dessinés à la main en SVG.
 * Les outils sont volontairement TRÈS grands pour être identifiables d'un coup d'œil.
 */

function HalftonePattern({ id }) {
  return (
    <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
      <circle cx="5" cy="5" r="3.1" fill="#111" />
    </pattern>
  );
}

/** Main tenant un marteau de charpentier — arrive du coin haut-gauche */
export function HammerHand({ className }) {
  return (
    <svg className={className} viewBox="0 0 460 460" aria-hidden="true">
      <defs>
        <HalftonePattern id="ht-hammer" />
      </defs>
      {/* GROSSE tête de marteau : face de frappe + griffe en V */}
      <g transform="rotate(-40 290 115)">
        <rect x="205" y="80" width="180" height="72" rx="10" fill="#111" />
        <rect x="352" y="70" width="42" height="92" rx="8" fill="#111" />
        <path d="M208 84 L146 30 L184 94 Z" fill="#111" />
        <path d="M208 148 L146 202 L184 138 Z" fill="#111" />
        <rect x="248" y="102" width="52" height="14" rx="7" fill="#ffd500" />
      </g>
      {/* manche épais */}
      <line x1="290" y1="115" x2="165" y2="270" stroke="#111" strokeWidth="34" strokeLinecap="round" />
      {/* avant-bras venant du coin */}
      <line x1="10" y1="10" x2="165" y2="270" stroke="#111" strokeWidth="100" strokeLinecap="round" />
      <line x1="10" y1="10" x2="165" y2="270" stroke="url(#ht-hammer)" strokeWidth="84" strokeLinecap="round" />
      {/* poing */}
      <circle cx="165" cy="270" r="62" fill="#111" />
      <circle cx="165" cy="270" r="50" fill="url(#ht-hammer)" />
      {/* phalanges qui agrippent le manche */}
      <circle cx="216" cy="238" r="13" fill="#111" />
      <circle cx="228" cy="256" r="13" fill="#111" />
      <circle cx="232" cy="276" r="13" fill="#111" />
      {/* pouce */}
      <circle cx="208" cy="312" r="15" fill="#111" />
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
      {/* lame longue */}
      <line x1="252" y1="300" x2="425" y2="300" stroke="#111" strokeWidth="18" strokeLinecap="round" />
      <polygon points="418,284 456,300 418,316" fill="#111" />
      {/* gros manche du tournevis */}
      <rect x="196" y="270" width="96" height="60" rx="28" fill="#111" />
      <rect x="216" y="284" width="10" height="32" rx="5" fill="#ffd500" />
      <rect x="238" y="284" width="10" height="32" rx="5" fill="#ffd500" />
      <rect x="260" y="284" width="10" height="32" rx="5" fill="#ffd500" />
      {/* avant-bras venant de la gauche */}
      <line x1="-6" y1="300" x2="150" y2="300" stroke="#111" strokeWidth="100" strokeLinecap="round" />
      <line x1="-6" y1="300" x2="150" y2="300" stroke="url(#ht-screw)" strokeWidth="84" strokeLinecap="round" />
      {/* poing */}
      <circle cx="150" cy="300" r="62" fill="#111" />
      <circle cx="150" cy="300" r="50" fill="url(#ht-screw)" />
      {/* phalanges */}
      <circle cx="202" cy="272" r="13" fill="#111" />
      <circle cx="212" cy="300" r="13" fill="#111" />
      <circle cx="202" cy="328" r="13" fill="#111" />
    </svg>
  );
}

/** Main tenant une clé à molette — arrive de la droite */
export function WrenchHand({ className }) {
  return (
    <svg className={className} viewBox="0 0 460 460" aria-hidden="true">
      <defs>
        <HalftonePattern id="ht-wrench" />
        {/* masque qui découpe la mâchoire ouverte de la clé (fente fine, pas une pince) */}
        <mask id="wrench-jaw">
          <rect width="460" height="460" fill="white" />
          <polygon points="122,248 64,212 80,200 138,242" fill="black" />
        </mask>
      </defs>
      <g transform="rotate(8 300 250)">
        {/* long manche de la clé */}
        <line x1="312" y1="250" x2="128" y2="250" stroke="#111" strokeWidth="34" strokeLinecap="round" />
        {/* tête de la clé à molette : cercle + mâchoire ouverte + molette de réglage */}
        <g mask="url(#wrench-jaw)">
          <circle cx="118" cy="250" r="54" fill="#111" />
          {/* bec supérieur (mâchoire mobile) */}
          <rect x="46" y="180" width="54" height="16" rx="8" fill="#111" transform="rotate(-38 73 188)" />
          {/* bec inférieur (mâchoire fixe) */}
          <rect x="46" y="290" width="54" height="16" rx="8" fill="#111" transform="rotate(38 73 298)" />
          {/* molette de réglage */}
          <circle cx="118" cy="250" r="16" fill="#ffd500" />
          <circle cx="118" cy="250" r="16" fill="none" stroke="#111" strokeWidth="4" />
          <line x1="118" y1="238" x2="118" y2="262" stroke="#111" strokeWidth="4" />
          <line x1="106" y1="250" x2="130" y2="250" stroke="#111" strokeWidth="4" />
        </g>
      </g>
      {/* avant-bras venant de la droite */}
      <line x1="466" y1="212" x2="306" y2="246" stroke="#111" strokeWidth="100" strokeLinecap="round" />
      <line x1="466" y1="212" x2="306" y2="246" stroke="url(#ht-wrench)" strokeWidth="84" strokeLinecap="round" />
      {/* poing */}
      <circle cx="300" cy="250" r="62" fill="#111" />
      <circle cx="300" cy="250" r="50" fill="url(#ht-wrench)" />
      {/* phalanges qui tiennent le manche */}
      <circle cx="250" cy="226" r="13" fill="#111" />
      <circle cx="244" cy="250" r="13" fill="#111" />
      <circle cx="250" cy="274" r="13" fill="#111" />
    </svg>
  );
}