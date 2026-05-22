'use client';

import { Trash2, ShoppingBag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/lib/store';
import { formatCarbonKg } from '@/lib/carbonCalculator';

export function PurchaseHistory() {
  const { purchases, dispatch } = useAppStore();

  if (purchases.length === 0) {
    return (
      <Card className="flex flex-col items-center py-12 text-center">
        <ShoppingBag className="w-12 h-12 text-slate-200 mb-3" />
        <p className="text-slate-400 font-medium">Aucun achat enregistré</p>
        <p className="text-slate-300 text-sm mt-1">
          Simulez votre premier achat dans l'onglet Simuler.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {purchases.map((purchase, i) => (
        <Card
          key={purchase.id}
          className={`flex items-center gap-3 animate-slide-up`}
          style={{ animationDelay: `${i * 50}ms` } as React.CSSProperties}
        >
          <span className="text-2xl flex-shrink-0" aria-hidden="true">
            {purchase.item.emoji}
          </span>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {purchase.item.name}
            </p>
            <p className="text-[11px] text-slate-400">
              {new Date(purchase.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
              })}
              {' · '}
              {purchase.item.categoryName}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
              -{formatCarbonKg(purchase.carbonKg)}
            </span>
            <button
              onClick={() => dispatch({ type: 'REMOVE_PURCHASE', payload: purchase.id })}
              className="p-1.5 hover:bg-rose-50 rounded-xl transition-colors text-slate-300 hover:text-rose-400"
              aria-label="Supprimer cet achat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
