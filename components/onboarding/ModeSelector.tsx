'use client';

import { Clock, ClipboardList, ArrowRight } from 'lucide-react';
import type { QuestionnaireMode } from '@/types';

interface Props {
  onSelect: (mode: QuestionnaireMode) => void;
}

export function ModeSelector({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-white flex flex-col px-5 pt-14 pb-10">
      <div className="mb-8">
        <p className="text-sm text-emerald-600 font-semibold mb-1">Bienvenue</p>
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">
          Comment voulez-vous estimer votre empreinte ?
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Choisissez le niveau de précision qui vous convient.
        </p>
      </div>

      <div className="space-y-4 flex-1">
        {/* Estimation rapide */}
        <button
          onClick={() => onSelect('quick')}
          className="w-full text-left group"
        >
          <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-5 hover:border-emerald-400 hover:shadow-md transition-all duration-200 active:scale-[0.98]">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-400 mt-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Estimation rapide</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-3">
              Quelques questions simples pour obtenir une estimation de votre empreinte en moins de 5 minutes.
            </p>
            <div className="flex flex-wrap gap-2">
              {['~5 min', '12 questions', 'Données approx.'].map(tag => (
                <span key={tag} className="text-[11px] font-medium bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </button>

        {/* Bilan détaillé */}
        <button
          onClick={() => onSelect('detailed')}
          className="w-full text-left group"
        >
          <div className="rounded-3xl border-2 border-slate-200 bg-slate-50 p-5 hover:border-emerald-300 hover:bg-emerald-50/40 hover:shadow-md transition-all duration-200 active:scale-[0.98]">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-slate-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 mt-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Bilan détaillé</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-3">
              En plus des questions de base, nous vous demanderons l'ancienneté de vos appareils
              pour calculer l'amortissement réel de leur fabrication.
            </p>
            <div className="flex flex-wrap gap-2">
              {['~10 min', '16 questions', 'Amortissement réel', 'Plus précis'].map(tag => (
                <span key={tag} className="text-[11px] font-medium bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </button>
      </div>

      <p className="text-center text-[10px] text-slate-300 mt-6">
        Vous pourrez changer de mode à tout moment via « Recalculer mon profil »
      </p>
    </div>
  );
}
