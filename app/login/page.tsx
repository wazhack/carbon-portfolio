'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Leaf, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Message de confirmation après inscription
  const registered = typeof window !== 'undefined'
    && new URLSearchParams(window.location.search).get('registered') === '1';

  useEffect(() => {
    if (status === 'authenticated') router.push('/');
  }, [status, router]);

  if (status === 'loading') return null;

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError('Email ou mot de passe incorrect.');
      return;
    }

    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-200 mb-5">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 text-center">
          Mon Portefeuille Carbone
        </h1>
        <p className="text-slate-400 text-sm mt-2 text-center leading-relaxed">
          Calculez votre empreinte,<br />simulez vos achats, agissez.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {/* Message après inscription */}
        {registered && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-sm text-emerald-700 font-medium">
            Compte créé ! Connectez-vous maintenant.
          </div>
        )}

        {/* Formulaire email / mot de passe */}
        <form onSubmit={handleCredentials} className="space-y-3">
          <div>
            <input
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="Email"
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all"
            />
          </div>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Mot de passe"
              className="w-full px-4 py-3.5 pr-12 bg-white border border-slate-200 rounded-2xl text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPwd(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-sm text-rose-500 bg-rose-50 px-4 py-2.5 rounded-2xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold rounded-2xl transition-all duration-200 active:scale-[0.98]"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-emerald-600 font-medium hover:underline">
            Créer un compte
          </Link>
        </p>

        {/* Séparateur */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-300">ou</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Google */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-3 p-4 bg-white border-2 border-slate-200 rounded-2xl font-semibold text-slate-700 hover:border-slate-300 hover:shadow-sm transition-all duration-200 active:scale-95"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>

        {/* Mode invité */}
        <button
          onClick={() => {
            localStorage.setItem('mpc-guest', '1');
            router.push('/');
          }}
          className="w-full py-3 text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          Continuer sans compte →
        </button>
      </div>

      <p className="text-xs text-slate-300 mt-6 text-center max-w-xs leading-relaxed">
        Vos données restent privées et ne sont jamais partagées.
      </p>
    </div>
  );
}
