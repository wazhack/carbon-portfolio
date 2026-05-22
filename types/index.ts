// ─── Enums ────────────────────────────────────────────────────────────────────

export type CarType = 'none' | 'thermal' | 'hybrid' | 'electric' | 'gpl';
export type HomeType = 'apartment' | 'house';
export type EnergyType = 'electric' | 'gas' | 'oil' | 'wood' | 'heatpump';
export type DietType = 'vegan' | 'vegetarian' | 'flexitarian' | 'carnivore';
export type DeviceType = 'smartphone' | 'laptop' | 'tablet' | 'tv' | 'console';

// ─── User profile ─────────────────────────────────────────────────────────────

export interface UserProfile {
  // Transport — voiture
  carType: CarType;
  carKmPerYear: number;
  // Transport — aérien
  shortFlightsPerYear: number;
  longFlightsPerYear: number;
  // Logement
  homeSurfaceM2: number;
  homeType: HomeType;
  energyType: EnergyType;
  householdSize: number;
  // Alimentation
  dietType: DietType;
  localFoodRatio: number; // 0 – 1
  // Numérique
  devices: DeviceType[];
  streamingHoursPerDay: number;
  // Computed
  initialFootprint: number;
  breakdown: FootprintBreakdown;
}

export type OnboardingPayload = Omit<UserProfile, 'initialFootprint' | 'breakdown'>;

// ─── Footprint breakdown ──────────────────────────────────────────────────────

export interface FootprintBreakdown {
  car: number;
  flight: number;
  housing: number;
  diet: number;
  digital: number;
  total: number;
}

// ─── Purchases ────────────────────────────────────────────────────────────────

export interface PurchaseItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  carbonKg: number;
  emoji: string;
  unit?: string; // unité par défaut, sinon "km", "kg", "kWh"…
}

export interface Purchase {
  id: string;
  item: PurchaseItem;
  date: string;
  carbonKg: number;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  items: Omit<PurchaseItem, 'categoryId' | 'categoryName'>[];
}
