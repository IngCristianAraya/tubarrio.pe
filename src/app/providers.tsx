'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import * as React from 'react';

import { AuthProvider } from '@/context/AuthContext';
import { ServicesProvider } from '@/context/ServicesContext';
import AnalyticsProvider from '@/context/AnalyticsContext';

type ProvidersProps = {
  children: any;
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
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <AnalyticsProvider>
          <ServicesProvider>
            {children}
            <Toaster position="bottom-right" />
          </ServicesProvider>
        </AnalyticsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
