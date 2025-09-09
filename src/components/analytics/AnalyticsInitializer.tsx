'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '@/context/AnalyticsContext';

export function AnalyticsInitializer() {
  const pathname = usePathname();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname, trackPageView]);

  return null; // This component doesn't render anything
}
