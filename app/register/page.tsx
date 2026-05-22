'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? 'Une erreur est survenue.');
      return;
    }

    router.push('/login?registered=1');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-200 mb-5">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 text-center">Créer un compte</h1>
        <p className="text-slate-400 text-sm mt-1 text-center">Mon Portefeuille Carbone</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        {/* Nom */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 ml-1">
            Prénom (optionnel)
          </label>
          <input
            type="text"
            autoComplete="given-name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Marie"
            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 ml-1">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="marie@exemple.fr"
            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all"
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 ml-1">
            Mot de passe <span className="text-slate-300">(8 caractères min.)</span>
          </label>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={8}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
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
        </div>

        {error && (
          <p className="text-sm text-rose-500 bg-rose-50 px-4 py-2.5 rounded-2xl">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold rounded-2xl transition-all duration-200 active:scale-[0.98]"
        >
          {loading ? 'Création du compte…' : 'Créer mon compte'}
        </button>
      </form>

      <p className="text-sm text-slate-400 mt-6">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-emerald-600 font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
