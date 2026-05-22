'use client';

import { ANNUAL_BUDGET_KG } from '@/lib/carbonData';
import { getBudgetStatus, formatCarbonKg } from '@/lib/carbonCalculator';
import { cn } from '@/lib/utils';

interface CarbonGaugeProps {
  spent: number;
  remaining: number;
}

// SVG semicircle gauge: arc from (20,120) to (220,120) through the top
// Path: M 20 120 A 100 100 0 0 0 220 120  (sweep=0 = counterclockwise = top arc)
// Arc length = π × 100 ≈ 314.16 px

const ARC_PATH = 'M 20 120 A 100 100 0 0 0 220 120';
const ARC_LENGTH = Math.PI * 100; // ~314.16

const STATUS_CONFIG = {
  safe: {
    hex: '#10b981',
    textClass: 'text-emerald-500',
    bgClass: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    msgClass: 'text-emerald-600',
    msg: '✨ Vous êtes dans les objectifs 2030 !',
  },
  warning: {
    hex: '#f59e0b',
    textClass: 'text-amber-500',
    bgClass: 'bg-gradient-to-br from-amber-50 to-yellow-50',
    msgClass: 'text-amber-600',
    msg: '⚡ Vous approchez la limite du budget.',
  },
  danger: {
    hex: '#f43f5e',
    textClass: 'text-rose-500',
    bgClass: 'bg-gradient-to-br from-rose-50 to-pink-50',
    msgClass: 'text-rose-600',
    msg: '🌡️ Budget dépassé. Chaque geste compte.',
  },
};

export function CarbonGauge({ spent, remaining }: CarbonGaugeProps) {
  const percent = Math.min((spent / ANNUAL_BUDGET_KG) * 100, 100);
  const status = getBudgetStatus(percent);
  const config = STATUS_CONFIG[status];
  const filled = (percent / 100) * ARC_LENGTH;

  return (
    <div className={cn('rounded-3xl p-5 pb-4', config.bgClass)}>
      {/* SVG gauge */}
      <div className="relative flex justify-center">
        <svg
          width={240}
          height={128}
          viewBox="0 0 240 128"
          aria-label={`Budget carbone : ${Math.round(percent)}% utilisé`}
        >
          {/* Track */}
          <path
            d={ARC_PATH}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={18}
            strokeLinecap="round"
          />
          {/* Fill */}
          {filled > 1 && (
            <path
              d={ARC_PATH}
              fill="none"
              stroke={config.hex}
              strokeWidth={18}
              strokeLinecap="round"
              strokeDasharray={`${filled} ${ARC_LENGTH + 20}`}
              style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          )}
        </svg>

        {/* Center text overlay — sits at the base of the arc */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Budget restant
          </span>
          <span className={cn('text-4xl font-bold leading-tight', config.textClass)}>
            {formatCarbonKg(remaining)}
          </span>
          <span className="text-xs text-slate-400 mt-0.5">
            sur {formatCarbonKg(ANNUAL_BUDGET_KG)} / an
          </span>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-4">
        <p className={cn('text-xs font-medium', config.msgClass)}>{config.msg}</p>
        <span className="text-xs font-bold text-slate-500 bg-white/70 px-2 py-0.5 rounded-full ml-2 whitespace-nowrap">
          {Math.round(percent)}%
        </span>
      </div>
    </div>
  );
}
