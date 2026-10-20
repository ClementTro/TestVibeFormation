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
    name: 'Semaine Nationale de la Prévention Santé',
    tag: 'Agir concrètement pour sa santé, au quotidien.',
    date: '1er → 7 juin 2026',
    href: `${BASE}snps`,
    live: true,
    color: '#64edff', // cyan DA semaine-preventionsante.fr
  },
  {
    key: 'siat',
    acronym: 'SIAT',
    name: 'La Semaine de l’IA pour Tous',
    tag: 'Découvrir l’intelligence artificielle, près de chez vous.',
    date: '18 → 24 mai 2026',
    href: `${BASE}siat`,
    live: true,
    color: '#f56476', // corail DA semaine-ia.fr
  },
  {
    key: 'lgsv',
    acronym: 'LGSV',
    name: 'La Grande Semaine Végétale',
    tag: 'Dix jours pour se régaler autrement.',
    date: '25 sept → 4 oct 2026',
    href: `${BASE}lgsv`,
    live: true,
    color: '#d5f683', // lime DA lagrandesemainevegetale.fr
  },
];
