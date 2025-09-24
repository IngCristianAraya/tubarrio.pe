'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '@/context/AnalyticsContext';

// Definir un tipo seguro para analytics
interface SafeAnalytics {
  trackPageView?: (path: string) => Promise<void>;
}

export function AnalyticsInitializer() {
  const pathname = usePathname();
  const analytics = useAnalytics() as unknown as SafeAnalytics;

  useEffect(() => {
    if (pathname && analytics?.trackPageView) {
      analytics.trackPageView(pathname).catch((error: unknown) => {
        console.error('Error tracking page view:', error);
      });
    }
  }, [pathname, analytics]);

  return null; // This component doesn't render anything
}
