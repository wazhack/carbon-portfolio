import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { SessionProvider } from '@/components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mon Portefeuille Carbone',
  description: "Calculez votre empreinte carbone et simulez l'impact de vos achats en temps réel.",
  manifest: '/manifest.json',
  themeColor: '#10b981',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Portefeuille CO₂',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SessionProvider>
          <AppProvider>
            <div className="max-w-md mx-auto min-h-screen relative bg-slate-50">
              {children}
            </div>
          </AppProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
