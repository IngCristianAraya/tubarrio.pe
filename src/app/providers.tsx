'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { ReactNode, Suspense } from 'react';
import { ServicesProvider } from '@/context/ServicesContext';
import { AnalyticsProvider } from '@/context/AnalyticsContext';

type ProvidersProps = {
  children: ReactNode;
};

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Suspense fallback={<LoadingFallback />}>
        <AnalyticsProvider>
          <ServicesProvider>
            {children}
            <Toaster position="bottom-right" />
          </ServicesProvider>
        </AnalyticsProvider>
      </Suspense>
    </ThemeProvider>
  );
}
