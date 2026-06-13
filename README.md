# Lumio — clone 1:1, code 100 % propriétaire

Recréation fidèle du site one-page [Lumio](https://lumio.apollostudio.design/) (showcase
fintech par QClay, généré avec Lovable+Claude). **Tout le code et tous les assets de ce
repo ont été écrits/dessinés de zéro** : aucune ressource ne provient du site original ni
de son CDN. Ce projet sert de base à personnaliser (rebranding agence).

## Lancer

```bash
npm install
npm run dev     # → http://localhost:3000 (ou port suivant disponible)
npm run build   # build statique de production
```

Astuce dev : `/?panel=2` saute directement au panneau N (1 = manifeste, 2 = how-it-works,
3 = intégrations) sans rejouer le scroll.

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4**
- Zéro lib d'animation : CSS + ~600 lignes de TS (`lib/useExperience.ts`)
- Zéro asset binaire : la « vidéo » du hero est un canvas génératif, les logos sont des
  SVG maison ou de la typographie, les mockups sont du HTML/CSS
- 100 % statique : aucun fetch runtime, aucun script tiers

## Architecture

```
app/
  layout.tsx                fonts (Geist, Geist Mono, Instrument Serif), metadata
  page.tsx                  rend <LumioHome/>
  globals.css               tokens de design (couleurs, fonts)
styles/
  lumio.css                 toute la mise en scène (chrome, stage, deck, reveals)
components/
  LumioHome.tsx             racine client : assemble chrome + stage + deck
  Chrome.tsx                promo bar, nav glass, drawer mobile
  HeroBackdrop.tsx          fond « liquid glass » génératif (canvas, 2 passes)
  BrowserMock.tsx           mockup navigateur + dashboard reconstruit en HTML
  BeamFrame.tsx             border-beams (points lumineux sur offset-path)
  SplitText.tsx             découpe lettre à lettre avec délais pré-calculés
  icons.tsx                 tous les SVG (logo, icônes, sparklines) — originaux
  sections/
    ThinkSection.tsx        S2 — manifeste + stats count-up
    HowSection.tsx          S3 — 3 cartes (connect / detect / forecast) + chart animé
    HubSection.tsx          S4 — orbite d'intégrations + roue de filtres
lib/
  useExperience.ts          orchestration : intro, fullpage snap, triggers, orbite, roue
```

### Comment ça marche

- **Stage / deck** : le hero est un rideau `position:fixed` (z-50) ; les 3 panneaux
  vivent dans un deck fixe derrière (z-1). Au scroll (desktop), le deck se translate de
  `-100vh` par panneau pendant que le rideau glisse vers le bas — wheel/clavier/touch
  sont interceptés. Mobile (≤900px) : scroll naturel + déclenchement à l'entrée
  dans le viewport. `prefers-reduced-motion` : tout est visible d'emblée, pas de hijack.
- **Intro** : timeline dans `runIntro()` — logo splash → nav (clip-path) → liens →
  titre lettre à lettre → sous-lignes → CTAs → chute 3D du navigateur → count-ups.
- **Orbite (S4)** : boucle rAF — chaque tuile a un angle de base, la rotation avance de
  360°/32 s ; apparitions en spirale (échelle + rayon + retard angulaire) ; le filtre
  « Banking » permute les tuiles du groupe b avec re-pop en cascade.
- **Roue de filtres** : carrousel vertical rAF (drift auto, pilotage à la souris,
  snap au clic).

## Rebranding (checklist)

1. **Couleurs** : tokens dans `app/globals.css` (`--ink`, `--paper`, `--royal`, …).
2. **Logo** : `LumioMark` + `Brand` dans `components/icons.tsx`.
3. **Copy** : hero dans `LumioHome.tsx`, sections dans `components/sections/*`,
   KPIs du dashboard dans `BrowserMock.tsx`. Le copy actuel est celui de la démo
   fintech — à réécrire pour votre marque avant toute mise en ligne.
4. **Intégrations** : tableau `TILES` + `FILTERS` dans `sections/HubSection.tsx`.
5. **Metadata/SEO** : `app/layout.tsx`.

## Origine du design

Design original : showcase « Lumio » de QClay (publié sur lafys.com), utilisé ici comme
référence visuelle. Le code de ce repo est une réimplémentation indépendante ; les
textes de démonstration restent à remplacer par votre propre contenu avant publication.
