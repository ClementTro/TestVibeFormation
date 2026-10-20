# HANDOFF — Fichier de passation de session

> **À lire en premier si tu reprends ce projet.** Ce fichier contient tout le contexte
> nécessaire pour continuer le travail sans repartir de zéro. Dernière mise à jour :
> 20 octobre 2026, ~19h20 (architecture multi-pages).

---

## 1. Le projet en une phrase

Vitrine multi-pages "Les Journées Nationales" + page thématique JNR (clone de
https://journeesreparation.fr/) : React + Vite animé avec GSAP, hébergé sur GitHub Pages.

- **Repo GitHub** : https://github.com/ClementTro/TestVibeFormation (branche `main`)
- **Site en ligne** : https://clementtro.github.io/TestVibeFormation/
- **Déploiement** : automatique via GitHub Actions à chaque push sur `main`
  (workflow : `.github/workflows/deploy.yml`, GitHub Pages activé en mode "GitHub Actions")
- **L'iframe map du site original est ignorée** (demande explicite de l'utilisateur)

## 1bis. ⚠️ ARCHITECTURE MULTI-PAGES (depuis le 20/10 soir)

- **`/`** → LA VITRINE globale "Les Journées Nationales" (`index.html` →
  `src/landing/landing-main.jsx` → `LandingApp.jsx`, style `src/styles/landing.css`,
  design nuit noir + jaune/menthe). C'est LA page d'accueil.
- **`/jnr`** → la page thématique JNR, l'ancienne home clone (`jnr.html` →
  `src/main.jsx` → `App.jsx`, style `global.css`, menthe néo-brutaliste).
  GitHub Pages sert `jnr.html` sur l'URL propre `/jnr` (extensions .html masquées).
- **SNPS / SIAT / LGSV** : présents dans les navbars en liens "bientôt" (`.is-soon`),
  pages à créer PLUS TARD quand l'utilisateur donnera leur contenu. Pour en ajouter une :
  1. créer `snps.html` sur le modèle de `jnr.html`, 2. ajouter l'entrée dans
  `build.rollupOptions.input` de `vite.config.js`, 3. mettre `live: true` + `href`
  dans `src/data/themes.js`. Ce fichier THEMES pilote TOUTES les navbars et la
  section rendez-vous — c'est le seul endroit à éditer.
- Chaque page garde SA navbar stylée (voulu par l'utilisateur) : navbar nuit sur la
  vitrine (`src/landing/LandingNav.jsx`), navbar menthe sur JNR (`src/components/Header.jsx`
  avec JNR actif en pastille + logo qui ramène à la vitrine).
- La vitrine contient : constellation de particules interactive (canvas, répulsion
  souris), titre cinétique + badge circulaire rotatif (textPath), parallaxe souris,
  marquee infini, section rendez-vous en scroll horizontal ÉPINGLÉ (gsap.matchMedia,
  pin desktop / scroll-snap tactile), compteurs, CTA géant magnétique, curseur custom
  (point jaune + anneau, desktop only), boutons magnétiques (`Magnetic.jsx`).

## 2. Stack & commandes

- **Vite 5 + React 18** (JSX, pas de TypeScript)
- **GSAP 3 + ScrollTrigger** : toutes les animations
- **Lenis** : smooth scroll (+ intégration gsap.ticker, voir `src/hooks/useLenis.js`)
- **Fonts** : Archivo Black (titres) + Space Grotesk (texte), via Google Fonts dans `index.html`
- **`vite.config.js`** : `base: '/TestVibeFormation/'` — OBLIGATOIRE pour GitHub Pages,
  les chemins d'assets publics dans le JSX doivent être RELATIFS (`src="hands/x.jpg"`,
  jamais de `/` initial)

```bash
npm run dev      # dev server local
npm run build    # build production (dist/)
npm run preview  # servir dist/ en local (http://localhost:4173/TestVibeFormation/)
git push         # déploie automatiquement le site en ligne
```

## 3. État actuel (ce qui est FAIT et FONCTIONNE)

### Design system (`src/styles/global.css`)
- Palette néo-brutaliste : menthe `#9fdcc3`, jaune `#ffd500`, noir `#101010`, blanc cassé `#fffdf6`
- Boutons pilule à bordure 3px noire + ombre dure (`box-shadow: 6px 6px 0`)
- Variables CSS dans `:root` (`--mint`, `--yellow`, `--border`, `--shadow`, etc.)

### Sections de la homepage (toutes opérationnelles)
1. **Header sticky** (`src/components/Header.jsx`) : logo JNR, nav, réseaux, CTA
2. **Hero** (`src/components/Hero.jsx`) : ⭐ LE morceau principal (détail §4)
3. **Manifeste** (`Manifesto.jsx`) : compteurs animés 80% / 1 900 € / 500+ via ScrollTrigger
4. **Actualités** (`News.jsx`) : 3 cartes néo-brutalistes avec hover lift
5. **Partenaires** (`Partners.jsx`) : double marquee infini (2 rangées, sens opposés)
6. **Newsletter** (`Newsletter.jsx`) : carte jaune, état "merci" après submit
7. **Footer** noir (`Footer.jsx`) : liens + mention "refonte de démonstration non officielle"

### Animations transverses (`src/App.jsx`)
- `[data-reveal]` : reveal au scroll (batch ScrollTrigger), utilisé sur tous les titres/cartes
- Lenis actif partout + ancres `#...` gérées avec offset -90px

### Hébergement
- GitHub Pages activé en mode workflow (fait via API le 20/10, token git credential local)
- À chaque push : build + deploy auto, ~2 min de propagation. Ctrl+F5 pour le cache.

## 4. Le Hero — architecture de l'animation (VALIDÉE par l'utilisateur)

`src/components/Hero.jsx` — une timeline GSAP d'environ 4-5 s au chargement :

1. **Pop-in** du panneau jaune (9 éclats `div` masqués par `clip-path` polygonal, voir
   la constante `SHARDS`) avec `back.out`
2. **Cassure** : flash blanc + screen-shake (`keyframes` sur `.hero-shake`) + EXPLOSION
   des 9 éclats (x/y/rotation/blur aléatoires, stagger `from: 'center'`)
3. **[FAIT le 20/10 après-midi]** : renforcement "sans mains" validé par tests navigateur :
   - **Onomatopées BD** : sticker « CRACK ! » (jaune, coin haut-gauche du panneau) qui
     claque au moment du flash, et sticker « RÉPARÉ ! » (blanc, coin bas-droite) au
     réassemblage. CSS `.pop` / `.pop--crack` / `.pop--fixed`, animées dans la timeline.
   - **Étincelles canvas** : `.hero-sparks` (canvas plein hero, z-index 6), moteur de
     particules maison (carrés + traits, gravité/friction, couleurs de la palette).
     2 gerbes : 90 particules à l'explosion, 40 à la réparation.
   - ⚠️ Piège résolu : un `<canvas>` en `position:absolute; inset:0` garde sa taille
     intrinsèque 300×150 (élément remplacé) — il FAUT `width:100%; height:100%` en CSS.
   - La logique `hasHands` reste en place : ajouter `.hand--*` réactiverait la phase mains.
4. **Réassemblage** des éclats (stagger `from: 'random'`) + pulsation de la lueur jaune
5. **Révélation** : mots du titre en `yPercent` + `back.out`, puis sous-titre et CTA

Autres points clés du Hero :
- `centerPanel()` : mesure le `h1` réel et aligne dessus le panneau jaune (top/width/height
  en px recalculés, listener `resize`). NE PAS revenir à des % fixes — c'était le bug
  de centrage corrigé.
- Bouton "↻ Rejouer" appelle `play()` qui réinitialise tout (kill + gsap.set).
- `prefers-reduced-motion` : états finaux posés directement.
- Parallaxe scroll sur `.hero-visual` et `.hero-content` (scrub).

## 5. Le point mains : EN SUSPENS, l'utilisateur a choisi la voie "sans mains"

Le 20/10 après-midi, face au choix « sans mains plus percutant » vs illustrations,
l'utilisateur a choisi **la voie "sans mains"** (piste 6 ci-dessous, désormais FAITE).
Les mains restent possibles plus tard si l'utilisateur change d'avis — le code du Hero
garde la logique `hasHands` prête à les accueillir. Deux approches ont été tentées et
REJETÉES explicitement :

| Essai | Fichiers | Verdict utilisateur |
|---|---|---|
| 1. Mains + outils SVG dessinés à la main (silhouettes + trame halftone via `<pattern>`) | supprimé (`HeroHands.jsx`) | « les outils ne vont pas du tout, c'est catastrophique » |
| 2. Photos Pexels réelles (main+marteau/tournevis/clé) en stickers circulaires + filtre halftone CSS | JSX retiré, **photos toujours dans `public/hands/`** | « c'est pire qu'avant, vraiment pas terrible » |

**À ne PAS retenter** : dessiner les mains en SVG à la main, ni coller des photos
en cercles. Il faut un rendu premium.

### Pistes envisagées pour la suite (à discuter avec l'utilisateur) :

1. ~~**Pivot créatif sans mains**~~ : ✅ FAIT le 20/10 — étincelles canvas + onomatopées
   « CRACK ! » / « RÉPARÉ ! » (voir §4 point 3). L'utilisateur a choisi cette voie.
2. **Illustrations générées par IA** (Midjourney/DALL·E/Ideogram) : prompt du type
   "pop-art halftone black and white hand holding hammer, white background", puis
   détourage → PNG transparent. L'utilisateur peut générer lui-même. Option gardée
   en réserve s'il veut des mains un jour.
3. **Lottie** : animations vectorielles de mains/outils (LottieFiles, chercher
   "hand repair", "tool fix"). Animées dès l'arrivée = très vivant. Vérifier licence.
4. **3D** (three.js / Spline) : mains low-poly stylisées ou gros outils 3D qui
   tournent. Plus lourd, mais très "WOW".
5. **Illustrations premium gratuites** : sets du type Streamline/Storyset.
6. **Commande à un illustrateur** (Fiverr etc.) pour 3 SVG/PSD sur mesure dans le
   style halftone punk-zine du site original.

### Assets disponibles dans `public/hands/` (photos Pexels, licence libre)
- `hammer-a.jpg` — main frappant un clou (action)
- `hammer-b.jpg` — mains burinées + marteau, ambiance sombre
- `screwdriver-a.jpg` — mains N&B + tournevis (style punk)
- `wrench-a.jpg` — main N&B serrant une clé à molette
- `wrench-b.jpg` — main + clé brillante (couleur)
→ Réutilisables si besoin, ou supprimables. Sources : images.pexels.com
  (IDs : 8447781, 35978940, 37634572, 29459133, 33073853).

## 6. Préférences de l'utilisateur (observées)

- Non-technique : expliquer les choix en langage simple, recommander plutôt que demander
- Veut du "WOW", des libs UI/UX "qui déchirent" — validé : GSAP + Lenis (pas de Three.js)
- Design : fidèle à l'original (menthe/jaune/noir, néo-brutaliste) mais plus percutant
- Répond toujours en français
- A validé : l'animation cassure→réparation du panneau, le centrage panneau/titre
  (vérifié au pixel via getBoundingClientRect), le reste de la homepage

## 7. Checklist pour reprendre

1. `npm install` puis `npm run dev` (ou `preview` après `build`)
2. Lire ce fichier, puis `src/components/Hero.jsx` (le moteur d'étincelles est en tête
   de composant, la timeline dans `play()`)
3. ~~Proposer les pistes du §5~~ : fait le 20/10 — voie "sans mains" choisie et livrée.
   Si l'utilisateur veut revenir aux mains, revoir §5 (pistes 2 à 6) et VALIDER un
   visuel avec lui AVANT de coder (les deux échecs documentés §5).
4. Pour insérer des mains : ajouter les éléments `.hand--hammer/.hand--screwdriver/
   .hand--wrench` dans le JSX du Hero (dans `.hero-visual`) + CSS `.hand` correspondant ;
   la timeline GSAP les prendra automatiquement en compte (logique `hasHands`)
5. Après chaque modif : `npm run build`, vérifier sur http://localhost:4173/TestVibeFormation/
   (serveur preview possiblement déjà lancé), puis `git push` pour déployer
6. Vérifier le workflow sur https://github.com/ClementTro/TestVibeFormation/actions

Bonne reprise ! 🛠️