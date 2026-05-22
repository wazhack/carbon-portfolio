// Facteurs d'émission — Source : ADEME / Nos Gestes Climat (nosgestesclimat.fr)
import { Category } from '@/types';

export const ANNUAL_BUDGET_KG = 2000; // kg CO₂e — objectif 2t/an/personne (2050)

// ─── Références mondiales ─────────────────────────────────────────────────────
// Sources : ADEME (2022), Global Carbon Project (2022), SNBC France
export const FRANCE_AVERAGE_KG = 9200;  // kg CO₂e/an/personne — France (ADEME 2022, scope 3)
export const WORLD_AVERAGE_KG  = 6000;  // kg CO₂e/an/personne — Monde (GCP 2022)
export const EU_AVERAGE_KG     = 7200;  // kg CO₂e/an/personne — UE27 (Eurostat 2022)
export const TARGET_2030_KG    = 4000;  // trajectoire SNBC — objectif intermédiaire France 2030
export const TARGET_2050_KG    = 2000;  // objectif net-zéro — Accord de Paris +2 °C

// ─── Transport — voiture ──────────────────────────────────────────────────────
// kg CO₂e / km (fabrication amortie + usage)
export const CAR_EMISSION_FACTOR: Record<string, number> = {
  thermal: 0.218,  // essence/diesel moyen
  hybrid:  0.105,  // hybride rechargeable
  electric: 0.047, // électrique (mix FR, nucléaire)
  gpl:     0.158,
  none:    0,
};

// ─── Transport — avion ────────────────────────────────────────────────────────
// kg CO₂e par vol A/R, forçage radiatif × 2 inclus
export const SHORT_FLIGHT_CO2 = 250;  // vol < 3 h  (~1 500 km A/R) ex : Paris-Barcelone
export const LONG_FLIGHT_CO2  = 1100; // vol > 3 h  (~8 000 km A/R) ex : Paris-New York

// ─── Logement ─────────────────────────────────────────────────────────────────
// kg CO₂e / m² / an
export const ENERGY_CO2_PER_M2: Record<string, number> = {
  electric: 3.5,  // réseau électrique FR (mix nucléaire bas carbone)
  gas:      19,   // gaz naturel
  oil:      28,   // fioul domestique
  wood:     5,    // bois / granulés (biomasse)
  heatpump: 2,    // pompe à chaleur électrique
};

// Maison individuelle consomme ~30 % de plus qu'un appartement (pertes toiture+murs)
export const HOUSE_ENERGY_FACTOR = 1.3;

// ─── Alimentation ─────────────────────────────────────────────────────────────
// kg CO₂e / an
export const DIET_EMISSIONS: Record<string, number> = {
  vegan:        900,
  vegetarian:   1300,
  flexitarian:  1800,
  carnivore:    2500,
};

// Réduction max si alimentation locale / bio (ADEME : −5 à −15 %)
export const LOCAL_FOOD_REDUCTION_RATE = 0.15;

// ─── Numérique ────────────────────────────────────────────────────────────────
export const STREAMING_CO2_PER_HOUR = 0.036; // kg CO₂e / h (ADEME 2022)

// Appareils partagés avec le foyer (÷ householdSize dans le calcul)
export const SHARED_DEVICES = new Set(['tv', 'console', 'washer', 'dryer', 'dishwasher', 'fridge', 'freezer']);

// Durée de vie standard par appareil (années) — source ADEME
export const DEVICE_LIFESPAN: Record<string, number> = {
  smartphone: 3, laptop: 5, tablet: 5, tv: 7, console: 7,
  washer: 11, dryer: 12, dishwasher: 12, fridge: 15, freezer: 15,
};

// Multiplicateur CO₂ selon l'âge moyen du parc (amortissement fabrication)
// Logique : CO₂ annuel = fabrication/lifespan + énergie
// Si entièrement amorti, seule la part énergie reste (~30 % du total)
export const DEVICE_AGE_MULTIPLIER: Record<string, number> = {
  'new':       1.0,  // < 2 ans — fabrication + énergie à plein
  'mid':       0.85, // 2–5 ans — quelques appareils proches de la fin
  'old':       0.55, // 5–10 ans — majorité partiellement ou totalement amortis
  'very-old':  0.30, // > 10 ans — fabrication entièrement amortie, énergie seule
};

// kg CO₂e / an (fabrication amortie + consommation électrique)
export const DEVICE_ANNUAL_CO2: Record<string, number> = {
  // Numérique
  smartphone: 30,  // amortissement 3 ans
  laptop:     55,  // amortissement 5 ans
  tablet:     28,
  tv:         40,  // amortissement 7 ans
  console:    35,
  // Électroménager (fabrication amortie + conso électrique, mix FR)
  washer:     25,  // machine à laver — amortissement 11 ans
  dryer:      35,  // sèche-linge — conso élevée
  dishwasher: 25,  // lave-vaisselle — amortissement 12 ans
  fridge:     28,  // réfrigérateur/congélateur — usage permanent
};

// ─── Catalogue d'achats ───────────────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  {
    id: 'electronics',
    name: 'Électronique',
    emoji: '📱',
    items: [
      { id: 'smartphone', name: 'Smartphone neuf',       carbonKg: 70,  emoji: '📱' },
      { id: 'laptop',     name: 'Ordinateur portable',   carbonKg: 300, emoji: '💻' },
      { id: 'tv',         name: 'Télévision 55"',        carbonKg: 200, emoji: '📺' },
      { id: 'tablet',     name: 'Tablette numérique',    carbonKg: 100, emoji: '📟' },
      { id: 'earbuds',    name: 'Écouteurs sans-fil',    carbonKg: 15,  emoji: '🎧' },
    ],
  },
  {
    id: 'fashion',
    name: 'Mode',
    emoji: '👕',
    items: [
      { id: 'tshirt',    name: 'T-shirt coton',          carbonKg: 10,  emoji: '👕' },
      { id: 'jeans',     name: 'Jean denim',             carbonKg: 33,  emoji: '👖' },
      { id: 'coat',      name: 'Manteau',                carbonKg: 50,  emoji: '🧥' },
      { id: 'sneakers',  name: 'Sneakers',               carbonKg: 15,  emoji: '👟' },
      { id: 'dress',     name: 'Robe',                   carbonKg: 20,  emoji: '👗' },
    ],
  },
  {
    id: 'food',
    name: 'Repas',
    emoji: '🍽️',
    items: [
      { id: 'burger',  name: 'Burger viande',            carbonKg: 5,   emoji: '🍔' },
      { id: 'pizza',   name: 'Pizza fromage',            carbonKg: 1.5, emoji: '🍕' },
      { id: 'salad',   name: 'Salade composée',          carbonKg: 0.3, emoji: '🥗' },
      { id: 'steak',   name: 'Steak bœuf 200g',         carbonKg: 6,   emoji: '🥩' },
      { id: 'fish',    name: 'Plat de poisson',          carbonKg: 1.8, emoji: '🐟' },
    ],
  },
  {
    id: 'appliances',
    name: 'Électroménager',
    emoji: '🏠',
    items: [
      { id: 'washer',      name: 'Machine à laver',       carbonKg: 200, emoji: '🫧' },
      { id: 'dryer',       name: 'Sèche-linge',           carbonKg: 200, emoji: '🌀' },
      { id: 'dishwasher',  name: 'Lave-vaisselle',        carbonKg: 230, emoji: '🍽️' },
      { id: 'fridge',      name: 'Réfrigérateur',         carbonKg: 270, emoji: '🧊' },
      { id: 'freezer',     name: 'Congélateur',           carbonKg: 180, emoji: '❄️' },
      { id: 'oven',        name: 'Four électrique',       carbonKg: 120, emoji: '🔥' },
      { id: 'microwave',   name: 'Micro-ondes',           carbonKg: 60,  emoji: '📡' },
      { id: 'hob',         name: 'Plaque de cuisson',     carbonKg: 80,  emoji: '🍳' },
      { id: 'vacuumbot',   name: 'Aspirateur robot',      carbonKg: 50,  emoji: '🤖' },
      { id: 'aircon',      name: 'Climatiseur',           carbonKg: 300, emoji: '❄️' },
    ],
  },
  {
    id: 'travel',
    name: 'Voyage',
    emoji: '✈️',
    items: [
      { id: 'flight-nyc',       name: 'Vol Paris → New York',     carbonKg: 900, emoji: '✈️' },
      { id: 'flight-barca',     name: 'Vol Paris → Barcelone',    carbonKg: 150, emoji: '✈️' },
      { id: 'train-marseille',  name: 'TGV Paris → Marseille',   carbonKg: 3,   emoji: '🚄' },
      { id: 'car-nice',         name: 'Voiture Paris → Nice',     carbonKg: 165, emoji: '🚗' },
    ],
  },
];
