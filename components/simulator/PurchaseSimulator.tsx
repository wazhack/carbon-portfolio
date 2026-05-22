'use client';

import { useState } from 'react';
import { Search, TrendingDown, Car, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/carbonData';
import { formatCarbonKg, getEquivalentDrivingKm, getPercentOfBudget } from '@/lib/carbonCalculator';
import { PurchaseItem } from '@/types';
import { cn } from '@/lib/utils';

type SimState = 'browsing' | 'result' | 'validated' | 'renounced';

const ALL_ITEMS: PurchaseItem[] = CATEGORIES.flatMap(cat =>
  cat.items.map(item => ({
    ...item,
    categoryId: cat.id,
    categoryName: cat.name,
  }))
);

export function PurchaseSimulator() {
  const { remainingBudget, dispatch } = useAppStore();
  const [simState, setSimState] = useState<SimState>('browsing');
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [selected, setSelected] = useState<PurchaseItem | null>(null);
  const [search, setSearch] = useState('');

  const activeCatData = CATEGORIES.find(c => c.id === activeCat)!;

  const displayItems: PurchaseItem[] =
    search.trim().length > 1
      ? ALL_ITEMS.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
      : activeCatData.items.map(item => ({
          ...item,
          categoryId: activeCat,
          categoryName: activeCatData.name,
        }));

  const handleSelect = (item: PurchaseItem) => {
    setSelected(item);
    setSimState('result');
  };

  const handleValidate = () => {
    if (!selected) return;
    dispatch({ type: 'ADD_PURCHASE', payload: selected });
    setSimState('validated');
  };

  const handleReset = () => {
    setSelected(null);
    setSimState('browsing');
    setSearch('');
  };

  // ─── Validated screen ───────────────────────────────────────────────────────
  if (simState === 'validated' && selected) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-5 text-center animate-fade-in">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Achat enregistré</h2>
        <p className="text-slate-500 text-sm mb-1">
          <span className="font-bold text-rose-500">
            -{formatCarbonKg(selected.carbonKg)}
          </span>{' '}
          déduits de votre budget.
        </p>
        <p className="text-slate-400 text-xs mb-8">
          Budget restant : {formatCarbonKg(remainingBudget)}
        </p>
        <Button onClick={handleReset} variant="secondary">
          Simuler un autre achat
        </Button>
      </div>
    );
  }

  // ─── Renounced screen ────────────────────────────────────────────────────────
  if (simState === 'renounced' && selected) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-5 text-center animate-fade-in">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
          <span className="text-4xl">🌿</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Bravo, beau réflexe !</h2>
        <p className="text-slate-500 text-sm mb-1">
          Vous avez renoncé à cet achat et économisé{' '}
          <span className="font-bold text-emerald-600">
            {formatCarbonKg(selected.carbonKg)}
          </span>
          .
        </p>
        <p className="text-slate-400 text-xs mb-1">
          {"C'est l'équivalent de"}{' '}
          <span className="font-semibold text-slate-600">
            {getEquivalentDrivingKm(selected.carbonKg).toLocaleString('fr-FR')} km
          </span>{' '}
          en voiture thermique épargnés.
        </p>
        <p className="text-2xl mt-2 mb-8">🌍</p>
        <Button onClick={handleReset} variant="secondary">
          Explorer d&apos;autres achats
        </Button>
      </div>
    );
  }

  // ─── Simulation result ───────────────────────────────────────────────────────
  if (simState === 'result' && selected) {
    const percent = getPercentOfBudget(selected.carbonKg);
    const drivingKm = getEquivalentDrivingKm(selected.carbonKg);
    const isOverBudget = selected.carbonKg > remainingBudget;

    const impactLevel = percent > 15 ? 'high' : percent > 5 ? 'medium' : 'low';
    const impactColors = {
      high: { bar: 'bg-rose-400', text: 'text-rose-500', bg: 'bg-rose-50' },
      medium: { bar: 'bg-amber-400', text: 'text-amber-500', bg: 'bg-amber-50' },
      low: { bar: 'bg-emerald-400', text: 'text-emerald-500', bg: 'bg-emerald-50' },
    }[impactLevel];

    return (
      <div className="space-y-4 animate-slide-up">
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-0">
          <div className="flex items-center gap-4 mb-5">
            <span className="text-5xl" aria-hidden="true">{selected.emoji}</span>
            <div>
              <p className="font-bold text-slate-800 text-lg leading-tight">{selected.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{selected.categoryName}</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 bg-white rounded-2xl">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <span className="text-sm text-slate-600 font-medium">Impact carbone</span>
              </div>
              <span className="font-bold text-rose-500">{formatCarbonKg(selected.carbonKg)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-2xl">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-600 font-medium">Équivaut à</span>
              </div>
              <span className="font-bold text-slate-700">
                {drivingKm.toLocaleString('fr-FR')} km
                <span className="text-xs font-normal text-slate-400"> en voiture</span>
              </span>
            </div>

            <div className="p-3 bg-white rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 font-medium">Part du budget annuel</span>
                <span className={cn('font-bold text-sm', impactColors.text)}>{percent}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-700', impactColors.bar)}
                  style={{ width: `${Math.min(percent * 4, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {isOverBudget && (
            <div className="mt-3 p-3 bg-rose-50 rounded-2xl border border-rose-100">
              <p className="text-xs text-rose-600 font-medium">
                ⚠️ Cet achat dépasse votre budget restant ({formatCarbonKg(remainingBudget)})
              </p>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="lg" onClick={() => setSimState('renounced')} fullWidth>
            <XCircle className="w-4 h-4" /> Renoncer
          </Button>
          <Button
            variant={isOverBudget ? 'danger' : 'primary'}
            size="lg"
            onClick={handleValidate}
            fullWidth
          >
            <CheckCircle className="w-4 h-4" /> Valider
          </Button>
        </div>
      </div>
    );
  }

  // ─── Browsing ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher smartphone, jeans, vol…"
          className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all"
        />
      </div>

      {search.trim().length <= 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0',
                activeCat === cat.id
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
              )}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {displayItems.length === 0 && (
          <div className="text-center py-10 text-slate-300 text-sm">
            Aucun résultat pour &ldquo;{search}&rdquo;
          </div>
        )}
        {displayItems.map(item => (
          <Card key={item.id} onClick={() => handleSelect(item)}>
            <div className="flex items-center gap-3">
              <span className="text-2xl flex-shrink-0" aria-hidden="true">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                <p className="text-[11px] text-slate-400">{item.categoryName}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-slate-700">{formatCarbonKg(item.carbonKg)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
