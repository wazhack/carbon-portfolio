import { NextRequest, NextResponse } from 'next/server';
import type { PurchaseItem } from '@/types';

const ODS_URL =
  'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/base-carbone/records';

const FIELDS = 'nom_base_francais,total_poste_non_decompose,unite_francais,code_de_la_categorie';

// Keyword → emoji mapping
const EMOJI_MAP: [RegExp, string][] = [
  [/voiture|auto|véhicule|moto|scooter/i, '🚗'],
  [/avion|vol\b|aérien/i, '✈️'],
  [/vélo|trottinette|skateboard/i, '🚲'],
  [/train|métro|bus|tramway|transport|ferrovi/i, '🚆'],
  [/bateau|navire|ferry/i, '⛴️'],
  [/bœuf|boeuf|agneau|porc|poulet|dinde|viande|steak|burger/i, '🥩'],
  [/poisson|saumon|thon|crevette|fruit de mer/i, '🐟'],
  [/fromage|lait|beurre|yaourt|produit laitier/i, '🧀'],
  [/légume|tomate|carotte|salade|épinard/i, '🥦'],
  [/fruit\b|pomme|banane|orange|raisin/i, '🍎'],
  [/pain|céréale|riz|pâtes|farine|blé/i, '🌾'],
  [/café|thé|chocolat|cacao/i, '☕'],
  [/smartphone|téléphone|mobile/i, '📱'],
  [/ordinateur|laptop|pc\b/i, '💻'],
  [/tablette|ipad/i, '📱'],
  [/télévision|tv\b|écran/i, '📺'],
  [/console|jeu vidéo/i, '🎮'],
  [/électroménager|lave|réfrigérateur|frigo|four|micro-onde/i, '🏠'],
  [/vêtement|textile|jean|tshirt|t-shirt|manteau|pull|chemise/i, '👕'],
  [/chaussure|basket|botte/i, '👟'],
  [/maison|logement|construction|béton|bâtiment/i, '🏗️'],
  [/électricité|énergie|kwh|gaz|fioul|fuel|chauffage/i, '⚡'],
  [/papier|livre|magazine|carton/i, '📄'],
  [/plastique|emballage/i, '♻️'],
  [/métal|acier|aluminium|cuivre/i, '🔩'],
  [/bois|forêt|papier/i, '🪵'],
  [/streaming|internet|numérique|cloud/i, '💾'],
];

function assignEmoji(name: string): string {
  for (const [re, emoji] of EMOJI_MAP) {
    if (re.test(name)) return emoji;
  }
  return '📦';
}

function parseUnit(rawUnit: string | null | undefined): string | undefined {
  if (!rawUnit) return undefined;
  // "kgCO2e/unité" → "unité", "kgCO2e/kg" → "kg", etc.
  const slash = rawUnit.indexOf('/');
  if (slash !== -1) {
    const unit = rawUnit.slice(slash + 1).trim();
    if (unit && unit !== 'unité') return unit;
  }
  return undefined;
}

interface OdsRecord {
  nom_base_francais?: string | null;
  total_poste_non_decompose?: number | null;
  unite_francais?: string | null;
  code_de_la_categorie?: string | null;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const params = new URLSearchParams({
    q,
    limit: '40',
    lang: 'fr',
    select: FIELDS,
  });

  try {
    const res = await fetch(`${ODS_URL}?${params}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ results: [] }, { status: 502 });
    }

    const data = await res.json();
    const records: OdsRecord[] = data?.results ?? [];

    const results: PurchaseItem[] = records
      .filter((r): r is OdsRecord & { nom_base_francais: string; total_poste_non_decompose: number } => {
        if (!r.nom_base_francais || r.total_poste_non_decompose == null) return false;
        if (r.total_poste_non_decompose <= 0) return false;
        // Keep only records whose French name contains the query
        return r.nom_base_francais.toLowerCase().includes(q.toLowerCase());
      })
      .slice(0, 20)
      .map((r, i) => {
        const name = r.nom_base_francais;
        const catId = r.code_de_la_categorie ?? 'ademe';
        return {
          id: `ademe-${catId}-${i}`,
          name,
          categoryId: catId,
          categoryName: 'Base Carbone® ADEME',
          carbonKg: Math.round(r.total_poste_non_decompose * 100) / 100,
          emoji: assignEmoji(name),
          unit: parseUnit(r.unite_francais),
        };
      });

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] }, { status: 502 });
  }
}
