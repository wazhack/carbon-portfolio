// Facteurs d'émission — Source : ADEME / Nos Gestes Climat (nosgestesclimat.fr)
import { Category } from '@/types';

export const ANNUAL_BUDGET_KG = 2000; // kg CO₂e — objectif 2t/an/personne (2030)

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

// kg CO₂e / an (fabrication amortie + consommation électrique)
export const DEVICE_ANNUAL_CO2: Record<string, number> = {
  smartphone: 30,  // amortissement 3 ans
  laptop:     55,  // amortissement 5 ans
  tablet:     28,
  tv:         40,  // amortissement 7 ans
  console:    35,
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
