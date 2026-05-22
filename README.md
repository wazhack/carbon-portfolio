# 🌿 Mon Portefeuille Carbone

Une **Progressive Web App Mobile-First** pour calculer son empreinte carbone annuelle et simuler l'impact de ses achats en temps réel — inspirée des apps Fintech, avec une touche écologique positive.

> Données basées sur le référentiel **ADEME / [Nos Gestes Climat](https://nosgestesclimat.fr/)**.

---

## Aperçu

| Dashboard | Questionnaire | Simulateur |
|-----------|--------------|------------|
| Jauge SVG + breakdown par poste | 12 questions / 5 sections | Recherche + impact instantané |

---

## Fonctionnalités

- **Questionnaire de profil** — 12 questions organisées en 5 sections (voiture, avion, logement, alimentation, numérique), avec skip logic et auto-avancement
- **Calcul détaillé** — 5 postes calculés séparément avec les facteurs d'émission ADEME (kg CO₂e)
- **Jauge visuelle** — arc SVG animé, couleur dynamique selon le budget restant
- **Breakdown par poste** — barres de progression par catégorie d'émission
- **Simulateur d'achat** — recherche par catégorie, équivalences vulgarisées, boutons "Valider" / "Renoncer"
- **Historique** — liste des achats carbone validés, suppression individuelle
- **Authentification** — Google et GitHub via NextAuth.js, mode invité sans compte
- **Persistance** — état sauvegardé en `localStorage` (pas de backend requis pour le MVP)
- **PWA ready** — manifest.json, thème couleur, standalone display

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | [Next.js 13.5](https://nextjs.org/) (App Router) |
| UI | [React 18](https://react.dev/) + [Tailwind CSS 3](https://tailwindcss.com/) |
| Icônes | [Lucide React](https://lucide.dev/) |
| Auth | [NextAuth.js v4](https://next-auth.js.org/) |
| État | React Context + `useReducer` |
| Langage | TypeScript 5 |
| Runtime | Node.js ≥ 16.8 |

---

## Structure des fichiers

```
carbon-portfolio/
│
├── app/                              # Next.js App Router
│   ├── api/auth/[...nextauth]/       # Route NextAuth
│   ├── login/                        # Page de connexion
│   ├── globals.css                   # Tailwind directives + utilitaires
│   ├── layout.tsx                    # Root layout (SessionProvider, AppProvider)
│   └── page.tsx                      # Page principale (guard auth + navigation)
│
├── components/
│   ├── dashboard/
│   │   ├── CarbonGauge.tsx           # Jauge SVG semicirculaire animée
│   │   ├── EmissionsBreakdown.tsx    # Breakdown par poste (barres %)
│   │   ├── PurchaseHistory.tsx       # Liste des achats validés
│   │   └── QuickStats.tsx            # Cartes stats (total, %, km équivalent)
│   ├── onboarding/
│   │   └── QuickStartQuestionnaire.tsx  # Wizard 12 questions / 5 sections
│   ├── providers/
│   │   └── SessionProvider.tsx       # Wrapper client NextAuth SessionProvider
│   ├── simulator/
│   │   └── PurchaseSimulator.tsx     # Simulateur d'achat (browse + résultat)
│   └── ui/
│       ├── Button.tsx                # Bouton réutilisable (4 variantes)
│       └── Card.tsx                  # Carte blanche avec hover effect
│
├── lib/
│   ├── auth.ts                       # Config NextAuth (providers Google + GitHub)
│   ├── carbonCalculator.ts           # Calculs d'empreinte par poste
│   ├── carbonData.ts                 # Facteurs ADEME + catalogue d'achats (mock)
│   ├── store.tsx                     # Context global + useReducer + localStorage
│   └── utils.ts                      # Helper cn() pour les classes Tailwind
│
├── types/
│   └── index.ts                      # Interfaces TypeScript (UserProfile, Purchase…)
│
├── public/
│   └── manifest.json                 # Manifest PWA
│
├── .env.local.example                # Template des variables d'environnement
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
└── tsconfig.json
```

---

## Modèle de données

### `UserProfile` — profil carbone de l'utilisateur

| Champ | Type | Description |
|-------|------|-------------|
| `carType` | `none \| thermal \| hybrid \| electric \| gpl` | Type de voiture |
| `carKmPerYear` | `number` | km parcourus par an |
| `shortFlightsPerYear` | `number` | Vols A/R < 3h par an |
| `longFlightsPerYear` | `number` | Vols A/R > 3h par an |
| `homeSurfaceM2` | `number` | Surface du logement (m²) |
| `homeType` | `apartment \| house` | Type de logement |
| `energyType` | `electric \| gas \| oil \| wood \| heatpump` | Énergie de chauffage |
| `householdSize` | `number` | Nombre de personnes dans le foyer |
| `dietType` | `vegan \| vegetarian \| flexitarian \| carnivore` | Régime alimentaire |
| `localFoodRatio` | `0 – 1` | Part d'alimentation locale/bio |
| `devices` | `DeviceType[]` | Appareils numériques |
| `streamingHoursPerDay` | `number` | Heures de streaming quotidien |
| `initialFootprint` | `number` | Total calculé (kg CO₂e/an) |
| `breakdown` | `FootprintBreakdown` | Détail par poste |

### Facteurs d'émission utilisés (ADEME)

| Poste | Facteur |
|-------|---------|
| Voiture thermique | 0,218 kg CO₂e / km |
| Voiture électrique (France) | 0,047 kg CO₂e / km |
| Voiture hybride | 0,105 kg CO₂e / km |
| Vol court A/R (< 3h) | 250 kg CO₂e |
| Vol long A/R (> 3h) | 1 100 kg CO₂e |
| Électricité (chauffage, mix FR) | 3,5 kg CO₂e / m² / an |
| Gaz naturel | 19 kg CO₂e / m² / an |
| Fioul | 28 kg CO₂e / m² / an |
| Régime omnivore | 2 500 kg CO₂e / an |
| Régime végétalien | 900 kg CO₂e / an |
| Streaming vidéo | 0,036 kg CO₂e / heure |

---

## Installation et démarrage

### Prérequis

- **Node.js** ≥ 16.8 (testé avec 16.15.1)
- **npm** ≥ 8

### 1. Cloner le projet

```bash
git clone https://github.com/wazhack/carbon-portfolio.git
cd carbon-portfolio
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.local.example .env.local
```

Éditez `.env.local` et renseignez :

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret-ici   # générez avec: openssl rand -base64 32

# Google OAuth — https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# GitHub OAuth — https://github.com/settings/applications/new
GITHUB_ID=
GITHUB_SECRET=
```

> **Sans clés OAuth**, utilisez le bouton **"Continuer sans compte"** sur la page de login pour accéder directement à l'app en mode invité.

### 4. Lancer en développement

```bash
npm run dev
```

L'app est disponible sur [http://localhost:3000](http://localhost:3000).

### 5. Build de production

```bash
npm run build
npm start
```

---

## Configurer les providers OAuth (optionnel)

### Google

1. Allez sur [console.cloud.google.com](https://console.cloud.google.com/apis/credentials)
2. Créez un **OAuth 2.0 Client ID** de type "Web application"
3. Ajoutez `http://localhost:3000/api/auth/callback/google` dans les **Authorized redirect URIs**
4. Copiez Client ID et Client Secret dans `.env.local`

### GitHub

1. Allez sur [github.com/settings/applications/new](https://github.com/settings/applications/new)
2. **Homepage URL** : `http://localhost:3000`
3. **Authorization callback URL** : `http://localhost:3000/api/auth/callback/github`
4. Copiez Client ID et Client Secret dans `.env.local`

---

## Dépendances

### Production

| Package | Version | Rôle |
|---------|---------|------|
| `next` | 13.5.6 | Framework React fullstack |
| `react` | ^18.3 | UI library |
| `react-dom` | ^18.3 | Rendu DOM React |
| `next-auth` | ^4.24.7 | Authentification OAuth |
| `lucide-react` | ^0.395 | Icônes SVG |

### Dev / Build

| Package | Version | Rôle |
|---------|---------|------|
| `typescript` | ^5.4 | Typage statique |
| `tailwindcss` | ^3.4 | CSS utilitaire |
| `postcss` | ^8.4 | Pipeline CSS |
| `autoprefixer` | ^10.4 | Préfixes CSS cross-browser |
| `@types/react` | ^18.3 | Types React |
| `@types/node` | ^20.14 | Types Node.js |

---

## Objectif carbone

L'objectif de **2 tonnes de CO₂e / an / personne** correspond à la trajectoire de l'Accord de Paris pour limiter le réchauffement à +1,5 °C d'ici 2100.

En France, l'empreinte carbone moyenne est d'environ **9 tonnes / an / personne** (scope 3 inclus). Le chemin est long — chaque geste compte.

---

## Roadmap (idées pour la suite)

- [ ] Persistance cloud (Supabase / PlanetScale) liée au compte utilisateur
- [ ] Intégration API officielle Nos Gestes Climat (ADEME)
- [ ] Comparaison avec la moyenne nationale
- [ ] Suggestions de réduction personnalisées
- [ ] Partage de son bilan (carte de résumé)
- [ ] Mode famille (partage du budget entre plusieurs profils)
- [ ] Notifications push (rappels hebdomadaires)

---

## Licence

MIT — libre d'utilisation, de modification et de distribution.
