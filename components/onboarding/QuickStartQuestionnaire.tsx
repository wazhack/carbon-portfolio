'use client';

import { useState } from 'react';
import { Check, ChevronLeft, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ModeSelector } from './ModeSelector';
import { useAppStore } from '@/lib/store';
import { OnboardingPayload, DeviceType, QuestionnaireMode } from '@/types';
import { cn } from '@/lib/utils';

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'voiture',      label: 'Voiture',       emoji: '🚗' },
  { id: 'avion',        label: 'Avion',          emoji: '✈️' },
  { id: 'logement',     label: 'Logement',       emoji: '🏠' },
  { id: 'alimentation', label: 'Alimentation',   emoji: '🍽️' },
  { id: 'numerique',    label: 'Numérique',      emoji: '📱' },
];

interface Option { value: string | number; label: string; emoji: string; desc?: string }
interface Question {
  id: keyof OnboardingPayload;
  sectionId: string;
  title: string;
  subtitle: string;
  type: 'single' | 'multi';
  options: Option[];
  skipIf?: (f: Partial<OnboardingPayload>, mode: QuestionnaireMode) => boolean;
}

const QUESTIONS: Question[] = [
  // ── Voiture ─────────────────────────────────────────────────────────────────
  {
    id: 'carType',
    sectionId: 'voiture',
    title: 'Avez-vous une voiture ?',
    subtitle: 'Sélectionnez votre type de motorisation',
    type: 'single',
    options: [
      { value: 'thermal',  emoji: '🚗', label: 'Thermique',    desc: 'Essence ou diesel' },
      { value: 'hybrid',   emoji: '🔋', label: 'Hybride',      desc: 'Essence + électrique' },
      { value: 'electric', emoji: '⚡', label: 'Électrique',   desc: 'Zéro émission directe' },
      { value: 'gpl',      emoji: '🔵', label: 'GPL',          desc: 'Gaz de pétrole liquéfié' },
      { value: 'none',     emoji: '🌿', label: 'Sans voiture', desc: 'Vélo, transports, marche' },
    ],
  },
  {
    id: 'carKmPerYear',
    sectionId: 'voiture',
    title: 'Combien de kilomètres par an ?',
    subtitle: 'Distance totale parcourue en voiture',
    type: 'single',
    skipIf: (f) => f.carType === 'none',
    options: [
      { value: 2500,  emoji: '🏘️', label: 'Moins de 5 000 km',        desc: 'Usage très occasionnel' },
      { value: 10000, emoji: '🛣️', label: '5 000 – 15 000 km',        desc: 'Trajets domicile-travail réguliers' },
      { value: 22000, emoji: '🚀', label: '15 000 – 30 000 km',       desc: 'Usage important' },
      { value: 40000, emoji: '🏎️', label: 'Plus de 30 000 km',        desc: 'Gros rouleur ou usage pro' },
    ],
  },
  // ── Avion ────────────────────────────────────────────────────────────────────
  {
    id: 'shortFlightsPerYear',
    sectionId: 'avion',
    title: 'Vols courts par an',
    subtitle: 'Trajets aller-retour de moins de 3h (ex : Paris-Barcelone)',
    type: 'single',
    options: [
      { value: 0, emoji: '🚫', label: 'Aucun',          desc: "Je ne prends pas l'avion court" },
      { value: 1, emoji: '1️⃣', label: '1 – 2 vols',    desc: "Un week-end ou une escapade" },
      { value: 4, emoji: '📅', label: '3 – 5 vols',    desc: "Plusieurs courts séjours" },
      { value: 7, emoji: '🗓️', label: 'Plus de 5 vols', desc: "Voyageur(se) fréquent(e)" },
    ],
  },
  {
    id: 'longFlightsPerYear',
    sectionId: 'avion',
    title: 'Vols longs par an',
    subtitle: 'Trajets aller-retour de plus de 3h (ex : Paris-New York)',
    type: 'single',
    options: [
      { value: 0, emoji: '🚫', label: 'Aucun',          desc: 'Pas de long courrier' },
      { value: 1, emoji: '1️⃣', label: '1 vol',          desc: 'Un grand voyage' },
      { value: 2, emoji: '2️⃣', label: '2 – 3 vols',    desc: 'Plusieurs destinations lointaines' },
      { value: 4, emoji: '🌍', label: 'Plus de 3 vols', desc: 'Grand voyageur(se)' },
    ],
  },
  // ── Logement ─────────────────────────────────────────────────────────────────
  {
    id: 'homeSurfaceM2',
    sectionId: 'logement',
    title: 'Surface de votre logement',
    subtitle: "Surface totale habitable (hors garage et caves)",
    type: 'single',
    options: [
      { value: 20,  emoji: '🔲', label: 'Moins de 30 m²',  desc: 'Studio ou petite chambre' },
      { value: 45,  emoji: '🏢', label: '30 – 60 m²',      desc: 'T1 bis / T2' },
      { value: 80,  emoji: '🏠', label: '60 – 100 m²',     desc: 'T3 / T4 standard' },
      { value: 130, emoji: '🏡', label: 'Plus de 100 m²',  desc: 'Grande maison ou appartement' },
    ],
  },
  {
    id: 'homeType',
    sectionId: 'logement',
    title: 'Type de logement',
    subtitle: 'Les maisons perdent plus de chaleur que les appartements',
    type: 'single',
    options: [
      { value: 'apartment', emoji: '🏢', label: 'Appartement',        desc: 'En immeuble collectif' },
      { value: 'house',     emoji: '🏠', label: 'Maison individuelle', desc: 'Logement isolé ou mitoyen' },
    ],
  },
  {
    id: 'energyType',
    sectionId: 'logement',
    title: 'Énergie principale de chauffage',
    subtitle: 'Le plus grand poste carbone du logement en France',
    type: 'single',
    options: [
      { value: 'electric',  emoji: '⚡', label: 'Électricité',       desc: 'Radiateurs ou convecteurs' },
      { value: 'gas',       emoji: '🔥', label: 'Gaz naturel',       desc: 'Chaudière à gaz' },
      { value: 'oil',       emoji: '🛢️', label: 'Fioul',             desc: 'Chaudière fioul' },
      { value: 'wood',      emoji: '🪵', label: 'Bois / Granulés',   desc: 'Poêle ou chaudière bois' },
      { value: 'heatpump',  emoji: '🌡️', label: 'Pompe à chaleur',   desc: 'PAC air/air ou air/eau' },
    ],
  },
  {
    id: 'householdSize',
    sectionId: 'logement',
    title: 'Personnes dans votre foyer',
    subtitle: "Les charges du logement sont partagées entre les occupants",
    type: 'single',
    options: [
      { value: 1, emoji: '🙋', label: 'Seul(e)',          desc: 'Je vis seul(e)' },
      { value: 2, emoji: '👫', label: '2 personnes',      desc: 'En couple ou colocataire' },
      { value: 3, emoji: '👨‍👩‍👦', label: '3 – 4 personnes', desc: 'Famille' },
      { value: 5, emoji: '👨‍👩‍👧‍👦', label: '5 ou plus',      desc: 'Grande famille' },
    ],
  },
  // ── Alimentation ─────────────────────────────────────────────────────────────
  {
    id: 'dietType',
    sectionId: 'alimentation',
    title: 'Votre régime alimentaire',
    subtitle: "L'alimentation représente ~25 % de l'empreinte carbone française",
    type: 'single',
    options: [
      { value: 'vegan',        emoji: '🌱', label: 'Végétalien',  desc: 'Aucun produit animal' },
      { value: 'vegetarian',   emoji: '🥕', label: 'Végétarien',  desc: "Œufs et produits laitiers ok" },
      { value: 'flexitarian',  emoji: '🥗', label: 'Flexitarien', desc: 'Viande quelques fois par semaine' },
      { value: 'carnivore',    emoji: '🥩', label: 'Omnivore',    desc: 'Viande ou poisson chaque jour' },
    ],
  },
  {
    id: 'localFoodRatio',
    sectionId: 'alimentation',
    title: 'Part de produits locaux et bio',
    subtitle: "Un régime local et bio réduit jusqu'à 15 % l'impact alimentaire",
    type: 'single',
    options: [
      { value: 0,    emoji: '🏪', label: 'Jamais ou rarement', desc: 'Grande surface standard' },
      { value: 0.25, emoji: '🛒', label: 'Parfois (25 %)',     desc: "Quelques produits de saison" },
      { value: 0.5,  emoji: '🧺', label: 'Souvent (50 %)',     desc: 'Marché ou AMAP régulier' },
      { value: 0.9,  emoji: '🌿', label: 'Presque toujours',   desc: 'Circuit court principalement' },
    ],
  },
  // ── Numérique ─────────────────────────────────────────────────────────────────
  {
    id: 'devices',
    sectionId: 'numerique',
    title: 'Vos équipements numériques',
    subtitle: 'Sélectionnez tous vos appareils (fabrication + usage)',
    type: 'multi',
    options: [
      { value: 'smartphone', emoji: '📱', label: 'Smartphone' },
      { value: 'laptop',     emoji: '💻', label: 'Ordinateur / Laptop' },
      { value: 'tablet',     emoji: '📟', label: 'Tablette' },
      { value: 'tv',         emoji: '📺', label: 'Télévision' },
      { value: 'console',    emoji: '🎮', label: 'Console de jeux' },
    ],
  },
  {
    id: 'devices',
    sectionId: 'numerique',
    title: 'Votre électroménager',
    subtitle: 'Cochez ce que vous possédez — fabrication + consommation électrique',
    type: 'multi',
    options: [
      { value: 'washer',     emoji: '🫧', label: 'Machine à laver' },
      { value: 'dryer',      emoji: '🌀', label: 'Sèche-linge' },
      { value: 'dishwasher', emoji: '🍽️', label: 'Lave-vaisselle' },
      { value: 'fridge',     emoji: '🧊', label: 'Réfrigérateur' },
    ],
  },
  {
    id: 'streamingHoursPerDay',
    sectionId: 'numerique',
    title: 'Streaming vidéo quotidien',
    subtitle: 'Netflix, YouTube, TikTok… par jour en moyenne',
    type: 'single',
    options: [
      { value: 0.5, emoji: '🕐', label: "Moins d'1 heure",  desc: 'Utilisation légère' },
      { value: 2,   emoji: '🕑', label: '1 – 3 heures',     desc: 'Une à deux séries le soir' },
      { value: 5,   emoji: '🕔', label: '3 – 7 heures',     desc: 'Usage important' },
      { value: 9,   emoji: '🕗', label: 'Plus de 7 heures', desc: 'Streaming toute la journée' },
    ],
  },
  // ── Questions mode détaillé uniquement ──────────────────────────────────────
  {
    id: 'digitalAgeGroup',
    sectionId: 'numerique',
    title: 'Ancienneté de vos équipements numériques',
    subtitle: 'La fabrication représente 70–80 % de l\'empreinte d\'un appareil électronique',
    type: 'single',
    skipIf: (_f, mode) => mode !== 'detailed',
    options: [
      { value: 'new',      emoji: '✨', label: 'Moins de 2 ans',   desc: 'Appareils récents, fabrication en cours d\'amortissement' },
      { value: 'mid',      emoji: '🟢', label: '2 à 5 ans',        desc: 'Dans la durée de vie standard' },
      { value: 'old',      emoji: '🟡', label: '5 à 10 ans',       desc: 'Plusieurs appareils proches de la fin de vie' },
      { value: 'very-old', emoji: '🔴', label: 'Plus de 10 ans',   desc: 'Fabrication entièrement amortie, énergie seule reste' },
    ],
  },
  {
    id: 'applianceAgeGroup',
    sectionId: 'numerique',
    title: 'Ancienneté de votre électroménager',
    subtitle: 'Lave-linge, réfrigérateur, sèche-linge… partagés avec le foyer',
    type: 'single',
    skipIf: (_f, mode) => mode !== 'detailed',
    options: [
      { value: 'new',      emoji: '✨', label: 'Moins de 3 ans',   desc: 'Appareils récents' },
      { value: 'mid',      emoji: '🟢', label: '3 à 7 ans',        desc: 'Milieu de vie — fabrication en cours' },
      { value: 'old',      emoji: '🟡', label: '7 à 12 ans',       desc: 'Proches ou dépassant la durée de vie standard' },
      { value: 'very-old', emoji: '🔴', label: 'Plus de 12 ans',   desc: 'Fabrication entièrement amortie' },
    ],
  },
];

// ─── Default form values ───────────────────────────────────────────────────────

const DEFAULT_FORM: OnboardingPayload = {
  carType: 'thermal',
  carKmPerYear: 10000,
  shortFlightsPerYear: 1,
  longFlightsPerYear: 0,
  homeSurfaceM2: 60,
  homeType: 'apartment',
  energyType: 'electric',
  householdSize: 2,
  dietType: 'flexitarian',
  localFoodRatio: 0.25,
  devices: ['smartphone'],
  streamingHoursPerDay: 2,
  mode: 'quick',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getVisibleQuestions(form: Partial<OnboardingPayload>, mode: QuestionnaireMode): Question[] {
  return QUESTIONS.filter(q => !q.skipIf?.(form, mode));
}

function setFormField(
  form: OnboardingPayload,
  id: keyof OnboardingPayload,
  value: string | number
): OnboardingPayload {
  return { ...form, [id]: value };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props { userName?: string }

export function QuickStartQuestionnaire({ userName }: Props) {
  const [mode, setMode] = useState<QuestionnaireMode | null>(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OnboardingPayload>(DEFAULT_FORM);
  const { dispatch } = useAppStore();

  if (!mode) {
    return <ModeSelector onSelect={m => { setMode(m); setForm(f => ({ ...f, mode: m })); }} />;
  }

  const visible = getVisibleQuestions(form, mode);
  const question = visible[step];
  const isLastStep = step === visible.length - 1;

  const sectionIdx = SECTIONS.findIndex(s => s.id === question.sectionId);
  const section = SECTIONS[sectionIdx];

  const currentValue = form[question.id];
  const devicesArr = (form.devices ?? []) as string[];

  // Auto-advance for single-select
  const handleSingleSelect = (value: string | number) => {
    const newForm = setFormField(form, question.id, value);
    setForm(newForm);

    if (isLastStep) {
      dispatch({ type: 'COMPLETE_ONBOARDING', payload: newForm });
    } else {
      setTimeout(() => setStep(s => s + 1), 220);
    }
  };

  // Toggle for multi-select (devices)
  const handleMultiToggle = (value: string) => {
    const next = devicesArr.includes(value)
      ? devicesArr.filter(v => v !== value)
      : [...devicesArr, value];
    setForm(f => ({ ...f, devices: next as DeviceType[] }));
  };

  const handleContinueMulti = () => {
    if (isLastStep) {
      dispatch({ type: 'COMPLETE_ONBOARDING', payload: form });
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Top bar ── */}
      <div className="px-5 pt-12 pb-2 bg-white sticky top-0 z-10 border-b border-slate-50">
        {/* Logo + back */}
        <div className="flex items-center gap-2 mb-4">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="p-2 -ml-2 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Retour"
            >
              <ChevronLeft className="w-5 h-5 text-slate-500" />
            </button>
          )}
          <div className="w-7 h-7 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Leaf className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-sm truncate">
            Mon Portefeuille Carbone
          </span>
          <span className="ml-auto text-[11px] text-slate-300 flex-shrink-0">
            {step + 1} / {visible.length}
          </span>
        </div>

        {/* Section progress bar */}
        <div className="flex gap-1.5 mb-1">
          {SECTIONS.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                'flex-1 h-1 rounded-full transition-all duration-500',
                i < sectionIdx  ? 'bg-emerald-500' :
                i === sectionIdx ? 'bg-emerald-400' :
                                   'bg-slate-200'
              )}
            />
          ))}
        </div>
        <p className="text-[10px] text-slate-400 mt-1 mb-2">
          {section.emoji} {section.label} · section {sectionIdx + 1}/{SECTIONS.length}
        </p>
      </div>

      {/* ── Question ── */}
      <div className="px-5 pt-5 pb-2">
        {userName && step === 0 && (
          <p className="text-sm text-emerald-600 font-medium mb-1">
            Bonjour {userName} 👋
          </p>
        )}
        <h1 className="text-xl font-bold text-slate-900 leading-snug">{question.title}</h1>
        <p className="text-sm text-slate-400 mt-1">{question.subtitle}</p>
      </div>

      {/* ── Options ── */}
      <div key={step} className="flex-1 px-5 pt-3 pb-8 animate-slide-up">

        {/* Single-select */}
        {question.type === 'single' && (
          <div className="space-y-2.5">
            {question.options.map(opt => {
              const isSelected = currentValue === opt.value;
              return (
                <button
                  key={String(opt.value)}
                  onClick={() => handleSingleSelect(opt.value)}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-150 active:scale-[0.98]',
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                  )}
                >
                  <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className={cn('font-semibold text-sm', isSelected ? 'text-emerald-700' : 'text-slate-800')}>
                      {opt.label}
                    </p>
                    {opt.desc && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{opt.desc}</p>
                    )}
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Multi-select (devices) */}
        {question.type === 'multi' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {question.options.map(opt => {
                const isSelected = devicesArr.includes(String(opt.value));
                return (
                  <button
                    key={String(opt.value)}
                    onClick={() => handleMultiToggle(String(opt.value))}
                    className={cn(
                      'relative flex flex-col items-start p-4 rounded-2xl border-2 text-left transition-all duration-150 active:scale-[0.98]',
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className="text-3xl mb-2">{opt.emoji}</span>
                    <p className={cn('font-semibold text-sm', isSelected ? 'text-emerald-700' : 'text-slate-800')}>
                      {opt.label}
                    </p>
                  </button>
                );
              })}
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleContinueMulti}
              className="mt-5"
            >
              {isLastStep ? 'Calculer mon profil' : 'Continuer'}
              <Check className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* ── Footer note ── */}
      <p className="text-center text-[10px] text-slate-300 pb-6 px-5">
        Données basées sur le référentiel ADEME / Nos Gestes Climat
      </p>
    </div>
  );
}
