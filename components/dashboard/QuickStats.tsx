'use client';

import { Zap, Leaf, Car } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/lib/store';
import { formatCarbonKg } from '@/lib/carbonCalculator';
import { ANNUAL_BUDGET_KG, CAR_EMISSION_FACTOR } from '@/lib/carbonData';

export function QuickStats() {
  const { totalSpent, profile } = useAppStore();

  const percent = Math.min((totalSpent / ANNUAL_BUDGET_KG) * 100, 100);
  const equivalentKm = Math.round(totalSpent / CAR_EMISSION_FACTOR.thermal);
  const initialFootprintLabel = profile
    ? `dont ${formatCarbonKg(profile.initialFootprint)} de base de vie`
    : null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">
        Votre bilan
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-xl flex-shrink-0">
              <Zap className="w-4 h-4 text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-medium">Total émis</p>
              <p className="text-lg font-bold text-slate-800 leading-tight">
                {formatCarbonKg(totalSpent)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-xl flex-shrink-0">
              <Leaf className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-medium">Consommé</p>
              <p className="text-lg font-bold text-slate-800 leading-tight">
                {Math.round(percent)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-xl flex-shrink-0">
            <Car className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Équivalent voiture</p>
            <p className="text-xl font-bold text-slate-800">
              {equivalentKm.toLocaleString('fr-FR')} km
            </p>
            {initialFootprintLabel && (
              <p className="text-[10px] text-slate-400 mt-0.5">{initialFootprintLabel}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
