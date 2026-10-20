# HANDOFF — Fichier de passation de session

> **À lire en premier si tu reprends ce projet.** Ce fichier contient tout le contexte
> nécessaire pour continuer le travail sans repartir de zéro. Dernière mise à jour :
> 20 octobre 2026, ~15h50.

---

## 1. Le projet en une phrase

Refonte "WOW" de https://journeesreparation.fr/ (site WordPress des Journées Nationales
de la Réparation) : une homepage React + Vite animée avec GSAP, hébergée sur GitHub Pages.

- **Repo GitHub** : https://github.com/ClementTro/TestVibeFormation (branche `main`)
- **Site en ligne** : https://clementtro.github.io/TestVibeFormation/
- **Déploiement** : automatique via GitHub Actions à chaque push sur `main`
  (workflow : `.github/workflows/deploy.yml`, GitHub Pages activé en mode "GitHub Actions")
- **L'iframe map du site original est ignorée** (demande explicite de l'utilisateur)

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
3. **[EMPLACEMENT MAINS — voir §5]** : le code prévoit une phase optionnelle
   `.hand--hammer` / `.hand--screwdriver` / `.hand--wrench` qui ne s'active QUE si les
   3 éléments existent dans le DOM (`hasHands`). Sinon la timeline saute directement
   à la phase 4 — **c'est l'état actuel : aucun élément main dans le JSX.**
4. **Réassemblage** des éclats (stagger `from: 'random'`) + pulsation de la lueur jaune
5. **Révélation** : mots du titre en `yPercent` + `back.out`, puis sous-titre et CTA

Autres points clés du Hero :
- `centerPanel()` : mesure le `h1` réel et aligne dessus le panneau jaune (top/width/height
  en px recalculés, listener `resize`). NE PAS revenir à des % fixes — c'était le bug
  de centrage corrigé.
- Bouton "↻ Rejouer" appelle `play()` qui réinitialise tout (kill + gsap.set).
- `prefers-reduced-motion` : états finaux posés directement.
- Parallaxe scroll sur `.hero-visual` et `.hero-content` (scrub).

## 5. ⚠️ LE POINT EN SUSPENS : les mains avec outils (échecs documentés)

L'utilisateur veut, autour du panneau jaune, **3 mains qui "réparent"** — l'une avec un
**marteau**, l'une avec un **tournevis**, l'une avec une **clé à molette**. C'est le seul
point bloquant. Deux approches ont été tentées et REJETÉES explicitement :

| Essai | Fichiers | Verdict utilisateur |
|---|---|---|
| 1. Mains + outils SVG dessinés à la main (silhouettes + trame halftone via `<pattern>`) | supprimé (`HeroHands.jsx`) | « les outils ne vont pas du tout, c'est catastrophique » |
| 2. Photos Pexels réelles (main+marteau/tournevis/clé) en stickers circulaires + filtre halftone CSS | JSX retiré, **photos toujours dans `public/hands/`** | « c'est pire qu'avant, vraiment pas terrible » |

**À ne PAS retenter** : dessiner les mains en SVG à la main, ni coller des photos
en cercles. Il faut un rendu premium.

### Pistes envisagées pour la suite (à discuter avec l'utilisateur) :

1. **Illustrations générées par IA** (Midjourney/DALL·E/Ideogram) : prompt du type
   "pop-art halftone black and white hand holding hammer, white background", puis
   détourage → PNG transparent. Rendu quasi-garanti, cohérent avec le style du site
   original. L'utilisateur peut générer lui-même avec son outil préféré.
2. **Lottie** : animations vectorielles de mains/outils (LottieFiles, chercher
   "hand repair", "tool fix"). Animées dès l'arrivée = très vivant. Vérifier licence.
3. **3D** (three.js / Spline) : mains low-poly stylisées ou gros outils 3D qui
   tournent. Plus lourd, mais très "WOW".
4. **Illustrations premium gratuites** : sets du type Streamline/Storyset — chercher
   des mains réparatrices stylisées de qualité pro.
5. **Commande à un illustrateur** (Fiverr etc.) pour 3 SVG/PSD sur mesure dans le
   style halftone punk-zine du site original.
6. **Pivot créatif sans mains** : l'animation casse/répare seule reste très forte ;
   on peut renforcer l'impact autrement (étincelles canvas au moment de la cassure,
   onomatopées "CRACK !" à la bande dessinée, son).

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
2. Lire ce fichier, puis `src/components/Hero.jsx` (section "EMPLACEMENT MAINS")
3. Proposer à l'utilisateur 2-3 des pistes du §5 AVANT de coder quoi que ce soit
   (les deux derniers essais ont échoué faute de validation visuelle préalable)
4. Pour insérer des mains : ajouter les éléments `.hand--hammer/.hand--screwdriver/
   .hand--wrench` dans le JSX du Hero (dans `.hero-visual`) + CSS `.hand` correspondant ;
   la timeline GSAP les prendra automatiquement en compte (logique `hasHands`)
5. Après chaque modif : `npm run build`, vérifier sur http://localhost:4173/TestVibeFormation/
   (serveur preview possiblement déjà lancé), puis `git push` pour déployer
6. Vérifier le workflow sur https://github.com/ClementTro/TestVibeFormation/actions

Bonne reprise ! 🛠️