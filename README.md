# 🌿 Mon Portefeuille Carbone

Une **Progressive Web App Mobile-First** pour calculer son empreinte carbone annuelle et simuler l'impact de ses achats en temps réel — inspirée des apps Fintech, avec une touche écologique positive.

> Données basées sur le référentiel **ADEME / [Nos Gestes Climat](https://nosgestesclimat.fr/)**.

---

## Aperçu

| Écran | Description |
|-------|-------------|
| **Sélecteur de mode** | Estimation rapide (5 min) ou Bilan détaillé (10 min) |
| **Questionnaire** | 14–16 questions / 5 sections avec skip logic et auto-avancement |
| **Résultats** | Empreinte vs France, UE, Monde, objectifs 2030 et 2050 |
| **Dashboard** | Jauge SVG + breakdown par poste + stats |
| **Simulateur** | Catalogue d'achats par catégorie, impact instantané |
| **Historique** | Liste des achats validés, suppression individuelle |

---

## Fonctionnalités

- **Authentification** — email/mot de passe (compte local) ou Google OAuth, mode invité sans compte
- **Questionnaire de profil** — 14-16 questions en 5 sections (voiture, avion, logement, alimentation, numérique + électroménager)
- **Deux modes de calcul** — Estimation rapide (valeurs par défaut) ou Bilan détaillé (ancienneté des appareils pour amortissement réel)
- **Calcul détaillé** — 5 postes calculés séparément avec les facteurs ADEME
  - Appareils partagés (TV, lave-linge, frigo…) divisés par le nombre de personnes du foyer
  - Amortissement de fabrication ajusté selon l'ancienneté des appareils (mode détaillé)
- **Écran de résultats** — comparaison France (9,2 t), UE (7,2 t), Monde (6 t), objectif 2030 (4 t) et 2050 (2 t)
- **Jauge visuelle** — arc SVG animé, couleur dynamique selon le budget restant
- **Breakdown par poste** — barres de progression par catégorie d'émission
- **Simulateur d'achat** — 5 catégories (électronique, mode, repas, électroménager, voyage), recherche, équivalences vulgarisées
- **Persistance** — état sauvegardé en `localStorage` + comptes stockés en base SQLite
- **PWA ready** — manifest.json, thème couleur, standalone display

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | [Next.js 13.5](https://nextjs.org/) (App Router) |
| UI | [React 18](https://react.dev/) + [Tailwind CSS 3](https://tailwindcss.com/) |
| Icônes | [Lucide React](https://lucide.dev/) |
| Auth | [NextAuth.js v4](https://next-auth.js.org/) — Email/Password + Google OAuth |
| Base de données | [Prisma 5](https://prisma.io/) + SQLite (local) |
| État | React Context + `useReducer` |
| Langage | TypeScript 5 |
| Runtime | Node.js ≥ 16.13 |

---

## Structure des fichiers

```
carbon-portfolio/
│
├── app/                              # Next.js App Router
│   ├── api/auth/[...nextauth]/       # Route NextAuth
│   ├── api/auth/register/            # POST — création de compte email
│   ├── login/                        # Page de connexion
│   ├── register/                     # Page d'inscription
│   ├── globals.css                   # Tailwind directives + utilitaires
│   ├── layout.tsx                    # Root layout (SessionProvider, AppProvider)
│   └── page.tsx                      # Page principale (guard auth + navigation)
│
├── components/
│   ├── dashboard/
│   │   ├── CarbonGauge.tsx           # Jauge SVG semicirculaire animée
│   │   ├── EmissionsBreakdown.tsx    # Breakdown par poste (barres %)
│   │   ├── ProfileResults.tsx        # Écran de résultats post-questionnaire
│   │   ├── PurchaseHistory.tsx       # Liste des achats validés
│   │   └── QuickStats.tsx            # Cartes stats (total, %, km équivalent)
│   ├── onboarding/
│   │   ├── ModeSelector.tsx          # Choix estimation rapide / bilan détaillé
│   │   └── QuickStartQuestionnaire.tsx  # Wizard 14–16 questions / 5 sections
│   ├── providers/
│   │   └── SessionProvider.tsx       # Wrapper client NextAuth SessionProvider
│   ├── simulator/
│   │   └── PurchaseSimulator.tsx     # Simulateur d'achat (browse + résultat)
│   └── ui/
│       ├── Button.tsx                # Bouton réutilisable (4 variantes)
│       └── Card.tsx                  # Carte blanche avec hover effect
│
├── lib/
│   ├── auth.ts                       # Config NextAuth (Google + Credentials)
│   ├── carbonCalculator.ts           # Calculs d'empreinte par poste
│   ├── carbonData.ts                 # Facteurs ADEME + catalogue d'achats + benchmarks
│   ├── prisma.ts                     # Client Prisma (singleton)
│   ├── store.tsx                     # Context global + useReducer + localStorage
│   └── utils.ts                      # Helper cn() pour les classes Tailwind
│
├── prisma/
│   ├── schema.prisma                 # Modèles User, Account, Session
│   └── dev.db                        # Base SQLite locale (gitignorée)
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
| `devices` | `DeviceType[]` | Appareils numériques + électroménager |
| `streamingHoursPerDay` | `number` | Heures de streaming quotidien |
| `mode` | `quick \| detailed` | Mode du questionnaire |
| `digitalAgeGroup` | `new \| mid \| old \| very-old` | Ancienneté équipements numériques (mode détaillé) |
| `applianceAgeGroup` | `new \| mid \| old \| very-old` | Ancienneté électroménager (mode détaillé) |
| `initialFootprint` | `number` | Total calculé (kg CO₂e/an) |
| `breakdown` | `FootprintBreakdown` | Détail par poste |

### Références de comparaison

| Référence | Valeur | Source |
|-----------|--------|--------|
| France moyenne | 9 200 kg CO₂e/an | ADEME 2022 (scope 3) |
| UE27 moyenne | 7 200 kg CO₂e/an | Eurostat 2022 |
| Monde moyenne | 6 000 kg CO₂e/an | Global Carbon Project 2022 |
| Objectif 2030 | 4 000 kg CO₂e/an | SNBC France (trajectoire) |
| Objectif 2050 | 2 000 kg CO₂e/an | Accord de Paris +2 °C |

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
| Machine à laver | 25 kg CO₂e / an |
| Sèche-linge | 35 kg CO₂e / an |
| Réfrigérateur | 28 kg CO₂e / an |

---

## Installation et démarrage

### Prérequis

- **Node.js** ≥ 16.13 (testé avec 16.15.1)
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

# Base de données SQLite locale
DATABASE_URL="file:./prisma/dev.db"

# Google OAuth (optionnel) — https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 4. Initialiser la base de données

```bash
npx prisma db push
```

Crée le fichier `prisma/dev.db` avec toutes les tables.

### 5. Lancer en développement

```bash
npm run dev
```

L'app est disponible sur [http://localhost:3000](http://localhost:3000).

> **Sans clés Google**, utilisez le bouton **"Continuer sans compte"** ou créez un compte email directement sur `/register`.

### 6. Build de production

```bash
npm run build
npm start
```

---

## Authentification

### Compte email (local)

1. Accédez à `/register`
2. Entrez votre prénom (optionnel), email et mot de passe (8 caractères min.)
3. Le mot de passe est haché avec **bcrypt** (12 rounds) avant stockage
4. Connectez-vous via `/login`

### Google OAuth (optionnel)

1. Allez sur [console.cloud.google.com](https://console.cloud.google.com/apis/credentials)
2. Créez un **OAuth 2.0 Client ID** de type "Web application"
3. Ajoutez `http://localhost:3000/api/auth/callback/google` dans les **Authorized redirect URIs**
4. Copiez Client ID et Client Secret dans `.env.local`

---

## Dépendances

### Production

| Package | Version | Rôle |
|---------|---------|------|
| `next` | 13.5.6 | Framework React fullstack |
| `react` | ^18.3 | UI library |
| `next-auth` | ^4.24.7 | Authentification OAuth + Credentials |
| `@next-auth/prisma-adapter` | 1.0.7 | Adaptateur Prisma pour NextAuth |
| `prisma` | 5.7 | ORM + migrations |
| `@prisma/client` | 5.7 | Client Prisma généré |
| `bcryptjs` | latest | Hachage de mots de passe |
| `lucide-react` | ^0.395 | Icônes SVG |

### Dev / Build

| Package | Version | Rôle |
|---------|---------|------|
| `typescript` | ^5.4 | Typage statique |
| `tailwindcss` | ^3.4 | CSS utilitaire |
| `@types/bcryptjs` | latest | Types bcryptjs |

---

## Objectif carbone

L'objectif de **2 tonnes de CO₂e / an / personne** correspond à la trajectoire de l'Accord de Paris pour limiter le réchauffement à +2 °C d'ici 2100. En France, l'empreinte carbone moyenne est d'environ **9,2 tonnes / an / personne** (scope 3 inclus, ADEME 2022).

---

## Roadmap

- [ ] Migration vers PostgreSQL pour la production (Supabase / PlanetScale)
- [ ] Enrichissement du catalogue d'achats (données utilisateur)
- [ ] Suggestions de réduction personnalisées
- [ ] Comparaison avec la moyenne nationale sur le dashboard
- [ ] Partage de son bilan (carte de résumé)
- [ ] Mode famille (partage du budget entre plusieurs profils)

---

## Licence

MIT — libre d'utilisation, de modification et de distribution.
