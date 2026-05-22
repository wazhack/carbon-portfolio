'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Home, Zap, Clock, Leaf, LogOut, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { QuickStartQuestionnaire } from '@/components/onboarding/QuickStartQuestionnaire';
import { ProfileResults } from '@/components/dashboard/ProfileResults';
import { BenchmarkComparison } from '@/components/dashboard/BenchmarkComparison';
import { CarbonGauge } from '@/components/dashboard/CarbonGauge';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { EmissionsBreakdown } from '@/components/dashboard/EmissionsBreakdown';
import { PurchaseHistory } from '@/components/dashboard/PurchaseHistory';
import { PurchaseSimulator } from '@/components/simulator/PurchaseSimulator';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

type TabId = 'dashboard' | 'simulator' | 'history';
const TABS: { id: TabId; label: string; Icon: LucideIcon }[] = [
  { id: 'dashboard',  label: 'Accueil',    Icon: Home },
  { id: 'simulator',  label: 'Simuler',    Icon: Zap  },
  { id: 'history',    label: 'Historique', Icon: Clock },
];

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center animate-pulse">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm text-slate-400">Chargement…</p>
      </div>
    </div>
  );
}

function UserMenu({ name, image }: { name?: string | null; image?: string | null }) {
  const [open, setOpen] = useState(false);
  const { dispatch } = useAppStore();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name ?? ''} className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
            <User className="w-4 h-4 text-emerald-600" />
          </div>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-20 bg-white rounded-2xl shadow-xl border border-slate-100 w-52 py-2 animate-fade-in">
            {name && (
              <div className="px-4 py-2 border-b border-slate-50">
                <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
                <p className="text-xs text-slate-400">Profil connecté</p>
              </div>
            )}
            <button
              onClick={() => {
                dispatch({ type: 'RESET' });
                setOpen(false);
              }}
              className="w-full px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 text-left transition-colors"
            >
              Recalculer mon profil
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 text-left transition-colors"
            >
              <LogOut className="w-4 h-4" /> Se déconnecter
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { view, totalSpent, remainingBudget, profile } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  const isGuest =
    typeof window !== 'undefined' && localStorage.getItem('mpc-guest') === '1';

  useEffect(() => {
    if (status === 'unauthenticated' && !isGuest) router.push('/login');
  }, [status, isGuest, router]);

  if (status === 'loading' && !isGuest) return <LoadingScreen />;
  if (!session && !isGuest) return null;

  const userName = session?.user?.name?.split(' ')[0] ?? undefined;

  if (view === 'onboarding') {
    return <QuickStartQuestionnaire userName={userName} />;
  }

  if (view === 'results') {
    return <ProfileResults />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm leading-none">Mon Portefeuille Carbone</p>
            {userName && (
              <p className="text-[11px] text-slate-400 mt-0.5">Bonjour, {userName}</p>
            )}
          </div>
        </div>
        <UserMenu name={session?.user?.name} image={session?.user?.image} />
      </header>

      {/* ── Content ── */}
      <main className="flex-1 pb-28 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="px-5 space-y-5 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Mon Budget CO₂</h1>
              <p className="text-slate-400 text-sm mt-0.5">Objectif : 2 t CO₂e / an · personne</p>
            </div>
            <CarbonGauge spent={totalSpent} remaining={remainingBudget} />
            <QuickStats />
            <EmissionsBreakdown />
            {profile && <BenchmarkComparison userKg={profile.initialFootprint} />}
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="px-5 space-y-4 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Simulateur</h1>
              <p className="text-slate-400 text-sm mt-0.5">Mesurez l'impact avant d'acheter</p>
            </div>
            <PurchaseSimulator />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="px-5 space-y-4 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Historique</h1>
              <p className="text-slate-400 text-sm mt-0.5">Vos achats carbone enregistrés</p>
            </div>
            <PurchaseHistory />
          </div>
        )}
      </main>

      {/* ── Bottom nav ── */}
      <nav className="fixed bottom-0 inset-x-0 flex justify-center pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto bg-white/90 backdrop-blur-lg border-t border-slate-100 px-4 pt-2 pb-6">
          <div className="flex justify-around">
            {TABS.map(({ id, label, Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    'flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-200',
                    isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                  )}
                >
                  <div className={cn('p-1.5 rounded-xl transition-all', isActive ? 'bg-emerald-50' : '')}>
                    <Icon className={cn('w-5 h-5 transition-transform duration-200', isActive && 'scale-110')} />
                  </div>
                  <span className={cn('text-[11px]', isActive ? 'font-bold' : 'font-medium')}>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
