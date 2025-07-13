'use client';

import { useEffect } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { TenantProvider } from '@/contexts/TenantContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === '/';

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isLoginPage) {
    window.location.href = '/';
    return null;
  }

  if (isLoginPage) {
    return <div className={inter.className}>{children}</div>;
  }

  return (
    <div className={`${inter.className} flex h-screen bg-gray-50`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TenantProvider>
          <AuthProvider>
            <DataProvider>
              <AppLayout>{children}</AppLayout>
            </DataProvider>
          </AuthProvider>
        </TenantProvider>
      </body>
    </html>
  );
}