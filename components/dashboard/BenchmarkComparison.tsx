'use client';

import { Globe, MapPin, Target, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  FRANCE_AVERAGE_KG,
  WORLD_AVERAGE_KG,
  EU_AVERAGE_KG,
  TARGET_2030_KG,
  TARGET_2050_KG,
} from '@/lib/carbonData';

function fmt(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} t`;
  return `${kg} kg`;
}

function pct(value: number, ref: number): number {
  return Math.round((value / ref) * 100);
}

interface Props {
  userKg: number;
}

export function BenchmarkComparison({ userKg }: Props) {
  const maxKg = Math.max(userKg, FRANCE_AVERAGE_KG) * 1.05;

  const vsFrance = pct(userKg, FRANCE_AVERAGE_KG);
  const vsMonde  = pct(userKg, WORLD_AVERAGE_KG);
  const vs2050   = pct(userKg, TARGET_2050_KG);
  const toReduce = Math.max(0, userKg - TARGET_2050_KG);

  const userColor =
    userKg <= TARGET_2050_KG  ? 'bg-emerald-500' :
    userKg <= TARGET_2030_KG  ? 'bg-amber-400'   :
    userKg <= FRANCE_AVERAGE_KG ? 'bg-orange-400' :
    'bg-rose-500';

  const userLabel =
    userKg <= TARGET_2050_KG    ? "Dans l'objectif 2050 ! 🎉"          :
    userKg <= TARGET_2030_KG    ? 'En dessous de la moyenne française'  :
    userKg <= FRANCE_AVERAGE_KG ? 'Proche de la moyenne française'      :
    'Au-dessus de la moyenne française';

  const benchmarks = [
    { label: 'Vous',            sublabel: userLabel,                        kg: userKg,            color: userColor,       icon: <span className="text-base">🙋</span> },
    { label: 'France',          sublabel: 'Moyenne nationale 2022 (ADEME)', kg: FRANCE_AVERAGE_KG, color: 'bg-slate-400',  icon: <MapPin       className="w-4 h-4 text-slate-400"  /> },
    { label: 'Union Européenne',sublabel: 'Moyenne UE27 2022 (Eurostat)',   kg: EU_AVERAGE_KG,     color: 'bg-slate-300',  icon: <Globe        className="w-4 h-4 text-slate-400"  /> },
    { label: 'Monde',           sublabel: 'Moyenne mondiale 2022 (GCP)',    kg: WORLD_AVERAGE_KG,  color: 'bg-slate-300',  icon: <Globe        className="w-4 h-4 text-slate-400"  /> },
    { label: 'Objectif 2030',   sublabel: 'Trajectoire SNBC — France',      kg: TARGET_2030_KG,    color: 'bg-amber-300',  icon: <Target       className="w-4 h-4 text-amber-400"  /> },
    { label: 'Objectif 2050',   sublabel: 'Accord de Paris +2 °C',          kg: TARGET_2050_KG,    color: 'bg-emerald-400',icon: <TrendingDown className="w-4 h-4 text-emerald-500"/> },
  ];

  return (
    <div className="space-y-4">
      {/* ── Barres de comparaison ── */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Comparaison mondiale
        </h2>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {benchmarks.map((row, i) => {
            const barPct = Math.min((row.kg / maxKg) * 100, 100);
            const isUser = i === 0;
            return (
              <div
                key={row.label}
                className={cn('px-4 py-3', i < benchmarks.length - 1 && 'border-b border-slate-50')}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {row.icon}
                    <div>
                      <span className={cn('text-sm font-semibold', isUser ? 'text-slate-900' : 'text-slate-600')}>
                        {row.label}
                      </span>
                      <p className="text-[10px] text-slate-400 leading-none mt-0.5">{row.sublabel}</p>
                    </div>
                  </div>
                  <span className={cn('text-sm font-bold flex-shrink-0 ml-2', isUser ? 'text-slate-900' : 'text-slate-500')}>
                    {fmt(row.kg)}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-700', row.color)}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-300 text-right mt-1.5">
          Sources : ADEME 2022 · GCP 2022 · Accord de Paris
        </p>
      </div>

      {/* ── Insights ── */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Ce que ça signifie
        </h2>
        <div className="space-y-2.5">

          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🇫🇷</span>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {vsFrance < 100
                  ? `${100 - vsFrance} % sous la moyenne française`
                  : `${vsFrance - 100} % au-dessus de la moyenne française`}
              </p>
              <p className="text-xs text-slate-400">
                Un Français émet en moyenne {fmt(FRANCE_AVERAGE_KG)}/an
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🌍</span>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {vsMonde < 100
                  ? `${100 - vsMonde} % sous la moyenne mondiale`
                  : `${vsMonde - 100} % au-dessus de la moyenne mondiale`}
              </p>
              <p className="text-xs text-slate-400">
                La moyenne mondiale est de {fmt(WORLD_AVERAGE_KG)}/an
              </p>
            </div>
          </div>

          <div className={cn('rounded-2xl p-4 flex items-center gap-3', userKg <= TARGET_2050_KG ? 'bg-emerald-50' : 'bg-amber-50')}>
            <span className="text-2xl">{userKg <= TARGET_2050_KG ? '🎯' : '📉'}</span>
            <div>
              {userKg <= TARGET_2050_KG ? (
                <>
                  <p className="text-sm font-semibold text-emerald-800">Vous êtes dans l&apos;objectif 2050 !</p>
                  <p className="text-xs text-emerald-600">Vous émettez {vs2050} % de l&apos;objectif Accord de Paris</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-amber-800">{fmt(toReduce)} à réduire pour atteindre 2050</p>
                  <p className="text-xs text-amber-600">Vous émettez {vs2050} % de l&apos;objectif — cible : {fmt(TARGET_2050_KG)}/an</p>
                </>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🗓️</span>
            <div>
              <p className="text-sm font-semibold text-slate-800">Objectif 2030 : {fmt(TARGET_2030_KG)}/an</p>
              <p className="text-xs text-slate-400">
                {userKg <= TARGET_2030_KG
                  ? 'Vous êtes déjà dans la trajectoire 2030 !'
                  : `Il vous reste ${fmt(userKg - TARGET_2030_KG)} à réduire pour la trajectoire intermédiaire`}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
