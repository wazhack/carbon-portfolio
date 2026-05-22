'use client';

import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/lib/store';
import { formatCarbonKg } from '@/lib/carbonCalculator';

const BREAKDOWN_ITEMS = [
  { key: 'car',     label: 'Transport voiture', emoji: '🚗', color: 'bg-blue-400' },
  { key: 'flight',  label: 'Avion',             emoji: '✈️', color: 'bg-sky-400' },
  { key: 'housing', label: 'Logement',          emoji: '🏠', color: 'bg-amber-400' },
  { key: 'diet',    label: 'Alimentation',      emoji: '🍽️', color: 'bg-green-400' },
  { key: 'digital', label: 'Numérique',         emoji: '📱', color: 'bg-purple-400' },
] as const;

export function EmissionsBreakdown() {
  const { profile } = useAppStore();
  if (!profile) return null;

  const { breakdown } = profile;
  const total = breakdown.total || 1; // avoid div/0

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">
        Répartition de base
      </h2>

      <Card className="space-y-4 p-5">
        {BREAKDOWN_ITEMS.map(({ key, label, emoji, color }) => {
          const kg = breakdown[key];
          const pct = Math.round((kg / total) * 100);
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{emoji}</span>
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{pct}%</span>
                  <span className="text-sm font-bold text-slate-800 min-w-[72px] text-right">
                    {formatCarbonKg(kg)}
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Total line */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-sm font-semibold text-slate-600">Total base de vie</span>
          <span className="text-sm font-bold text-slate-900">{formatCarbonKg(total)}</span>
        </div>
      </Card>
    </div>
  );
}
