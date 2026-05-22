import { OnboardingPayload, FootprintBreakdown } from '@/types';
import {
  CAR_EMISSION_FACTOR,
  SHORT_FLIGHT_CO2,
  LONG_FLIGHT_CO2,
  ENERGY_CO2_PER_M2,
  HOUSE_ENERGY_FACTOR,
  DIET_EMISSIONS,
  LOCAL_FOOD_REDUCTION_RATE,
  STREAMING_CO2_PER_HOUR,
  DEVICE_ANNUAL_CO2,
  SHARED_DEVICES,
  DEVICE_AGE_MULTIPLIER,
  ANNUAL_BUDGET_KG,
} from './carbonData';

export function calculateDetailedFootprint(profile: OnboardingPayload): FootprintBreakdown {
  // 1. Transport — voiture
  const car =
    profile.carType === 'none'
      ? 0
      : Math.round(profile.carKmPerYear * CAR_EMISSION_FACTOR[profile.carType]);

  // 2. Transport — avion
  const flight = Math.round(
    profile.shortFlightsPerYear * SHORT_FLIGHT_CO2 +
    profile.longFlightsPerYear  * LONG_FLIGHT_CO2
  );

  // 3. Logement (surface × énergie × type maison / nb personnes du foyer)
  const housingBase = profile.homeSurfaceM2 * (ENERGY_CO2_PER_M2[profile.energyType] ?? 0);
  const housingWithType = housingBase * (profile.homeType === 'house' ? HOUSE_ENERGY_FACTOR : 1);
  const housing = Math.round(housingWithType / profile.householdSize);

  // 4. Alimentation (régime × réduction locale/bio)
  const dietBase = DIET_EMISSIONS[profile.dietType] ?? 0;
  const diet = Math.round(dietBase * (1 - profile.localFoodRatio * LOCAL_FOOD_REDUCTION_RATE));

  // 5. Numérique + électroménager
  // Les appareils partagés (TV, lave-linge, frigo…) sont divisés par le nb de personnes
  // En mode détaillé, un multiplicateur d'âge réduit la part fabrication amortie
  const streaming = Math.round(profile.streamingHoursPerDay * STREAMING_CO2_PER_HOUR * 365);
  const digitalMult   = DEVICE_AGE_MULTIPLIER[profile.digitalAgeGroup   ?? 'new'] ?? 1;
  const applianceMult = DEVICE_AGE_MULTIPLIER[profile.applianceAgeGroup ?? 'new'] ?? 1;
  const devicesKg = profile.devices.reduce((s, d) => {
    const base  = DEVICE_ANNUAL_CO2[d] ?? 0;
    const share = SHARED_DEVICES.has(d) ? base / profile.householdSize : base;
    const mult  = SHARED_DEVICES.has(d) ? applianceMult : digitalMult;
    return s + share * mult;
  }, 0);
  const digital = streaming + Math.round(devicesKg);

  return { car, flight, housing, diet, digital, total: car + flight + housing + diet + digital };
}

export function getBudgetStatus(percentUsed: number): 'safe' | 'warning' | 'danger' {
  if (percentUsed < 50) return 'safe';
  if (percentUsed < 80) return 'warning';
  return 'danger';
}

export function getEquivalentDrivingKm(carbonKg: number): number {
  return Math.round(carbonKg / CAR_EMISSION_FACTOR.thermal);
}

export function getPercentOfBudget(carbonKg: number): number {
  return Math.round((carbonKg / ANNUAL_BUDGET_KG) * 1000) / 10;
}

export function formatCarbonKg(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} t CO₂e`;
  if (kg < 0.1)   return `${Math.round(kg * 1000)} g CO₂e`;
  if (Number.isInteger(kg)) return `${kg} kg CO₂e`;
  return `${kg.toFixed(1)} kg CO₂e`;
}
