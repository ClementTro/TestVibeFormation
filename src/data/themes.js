/**
 * La famille des "rendez-vous nationaux" de la vitrine.
 * Un seul endroit à modifier pour ajouter une page thématique plus tard
 * (il suffira aussi d'ajouter l'entrée HTML correspondante dans vite.config.js).
 */
export const BASE = import.meta.env.BASE_URL; // '/TestVibeFormation/'

export const THEMES = [
  {
    key: 'jnr',
    acronym: 'JNR',
    name: 'Journées Nationales de la Réparation',
    tag: "Réparer, c'est déjà agir.",
    date: '15 → 18 octobre 2026',
    href: `${BASE}jnr`,
    live: true,
    color: '#9fdcc3', // menthe
  },
  {
    key: 'snps',
    acronym: 'SNPS',
    name: 'Bientôt révélées',
    tag: "Un nouveau rendez-vous national se prépare dans l'ombre.",
    date: 'Édition 2026 — à venir',
    href: null,
    live: false,
    color: '#ffd500', // jaune
  },
  {
    key: 'siat',
    acronym: 'SIAT',
    name: 'Bientôt révélées',
    tag: "Le mystère reste entier jusqu'à l'annonce officielle.",
    date: 'Édition 2026 — à venir',
    href: null,
    live: false,
    color: '#ff7ac8', // rose
  },
  {
    key: 'lgsv',
    acronym: 'LGSV',
    name: 'Bientôt révélées',
    tag: 'Dernière pièce du puzzle, dévoilée très bientôt.',
    date: 'Édition 2026 — à venir',
    href: null,
    live: false,
    color: '#9d8cff', // violet
  },
];
