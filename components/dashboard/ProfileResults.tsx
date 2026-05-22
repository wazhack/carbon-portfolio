'use client';

import { ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { BenchmarkComparison } from './BenchmarkComparison';
import { TARGET_2050_KG, TARGET_2030_KG, FRANCE_AVERAGE_KG } from '@/lib/carbonData';

export function ProfileResults() {
  const { profile, dispatch } = useAppStore();
  if (!profile) return null;

  const userKg = profile.initialFootprint;

  const userColor =
    userKg <= TARGET_2050_KG    ? 'bg-emerald-500' :
    userKg <= TARGET_2030_KG    ? 'bg-amber-400'   :
    userKg <= FRANCE_AVERAGE_KG ? 'bg-orange-400'  :
    'bg-rose-500';

  const userLabel =
    userKg <= TARGET_2050_KG    ? "Dans l'objectif 2050 ! 🎉"         :
    userKg <= TARGET_2030_KG    ? 'En dessous de la moyenne française' :
    userKg <= FRANCE_AVERAGE_KG ? 'Proche de la moyenne française'     :
    'Au-dessus de la moyenne française';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-5 pt-14 pb-32 overflow-y-auto space-y-6">

        <div>
          <p className="text-sm text-emerald-600 font-semibold mb-1">Votre profil calculé</p>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">
            Votre empreinte annuelle estimée
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Basé sur vos réponses — données ADEME / Nos Gestes Climat
          </p>
        </div>

        {/* Hero empreinte */}
        <div className={cn('rounded-3xl p-6 text-white', userColor)}>
          <p className="text-sm font-medium opacity-80 mb-1">Votre empreinte</p>
          <p className="text-5xl font-bold tracking-tight">
            {(userKg / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}
            <span className="text-2xl font-semibold ml-1 opacity-90">t CO₂e/an</span>
          </p>
          <p className="text-sm mt-3 opacity-90 font-medium">{userLabel}</p>
        </div>

        <BenchmarkComparison userKg={userKg} />

      </div>

      <div className="fixed bottom-0 inset-x-0 flex justify-center pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto bg-white/95 backdrop-blur-lg border-t border-slate-100 px-5 py-4 pb-8">
          <button
            onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-semibold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all duration-200"
          >
            Voir mon tableau de bord
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-center text-[10px] text-slate-300 mt-2">
            Sources : ADEME 2022 · Global Carbon Project 2022 · Accord de Paris
          </p>
        </div>
      </div>
    </div>
  );
}
