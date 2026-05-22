'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { UserProfile, Purchase, PurchaseItem, OnboardingPayload, FootprintBreakdown } from '@/types';
import { ANNUAL_BUDGET_KG } from './carbonData';
import { calculateDetailedFootprint } from './carbonCalculator';

type AppView = 'onboarding' | 'results' | 'dashboard';

const EMPTY_BREAKDOWN: FootprintBreakdown = { car: 0, flight: 0, housing: 0, diet: 0, digital: 0, total: 0 };

interface AppState {
  view: AppView;
  profile: UserProfile | null;
  purchases: Purchase[];
  totalSpent: number;
  remainingBudget: number;
}

type Action =
  | { type: 'COMPLETE_ONBOARDING'; payload: OnboardingPayload }
  | { type: 'GO_TO_DASHBOARD' }
  | { type: 'ADD_PURCHASE'; payload: PurchaseItem }
  | { type: 'REMOVE_PURCHASE'; payload: string }
  | { type: 'RESET' };

const DEFAULT_STATE: AppState = {
  view: 'onboarding',
  profile: null,
  purchases: [],
  totalSpent: 0,
  remainingBudget: ANNUAL_BUDGET_KG,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'COMPLETE_ONBOARDING': {
      const breakdown = calculateDetailedFootprint(action.payload);
      const profile: UserProfile = { ...action.payload, initialFootprint: breakdown.total, breakdown };
      return {
        ...state,
        view: 'results',
        profile,
        totalSpent: breakdown.total,
        remainingBudget: Math.max(0, ANNUAL_BUDGET_KG - breakdown.total),
      };
    }
    case 'GO_TO_DASHBOARD':
      return { ...state, view: 'dashboard' };
    case 'ADD_PURCHASE': {
      const newPurchase: Purchase = {
        id: Date.now().toString(),
        item: action.payload,
        date: new Date().toISOString(),
        carbonKg: action.payload.carbonKg,
      };
      const newTotal = state.totalSpent + action.payload.carbonKg;
      return {
        ...state,
        purchases: [newPurchase, ...state.purchases],
        totalSpent: newTotal,
        remainingBudget: Math.max(0, ANNUAL_BUDGET_KG - newTotal),
      };
    }
    case 'REMOVE_PURCHASE': {
      const purchase = state.purchases.find(p => p.id === action.payload);
      if (!purchase) return state;
      const newTotal = Math.max(0, state.totalSpent - purchase.carbonKg);
      return {
        ...state,
        purchases: state.purchases.filter(p => p.id !== action.payload),
        totalSpent: newTotal,
        remainingBudget: Math.max(0, ANNUAL_BUDGET_KG - newTotal),
      };
    }
    case 'RESET':
      return DEFAULT_STATE;
    default:
      return state;
  }
}

function getInitialState(): AppState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const stored = localStorage.getItem('mpc-v2');
    if (stored) return { ...DEFAULT_STATE, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_STATE;
}

interface AppContextValue extends AppState {
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  useEffect(() => {
    localStorage.setItem('mpc-v2', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used inside AppProvider');
  return ctx;
}
