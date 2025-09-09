'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * @deprecated Use AnalyticsInitializer component instead
 * This hook is kept for backward compatibility but is no longer needed
 * as tracking is now handled by the AnalyticsInitializer component
 */
export function usePageTracking() {
  // This hook is now a no-op as tracking is handled by AnalyticsInitializer
  const pathname = usePathname();
  return { pathname };
}

import { useAnalytics } from '../context/AnalyticsContext';

/**
 * Hook para tracking manual de eventos específicos
 * Safe to use in components that might be rendered outside of AnalyticsProvider
 */
export function useEventTracking() {
  // Use optional chaining to safely access analytics methods
  const analytics = useAnalytics();

  const noop = () => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Analytics not available. Make sure AnalyticsProvider is properly set up.');
    }
  };

  const trackServiceView = (serviceId: string, serviceName: string) => {
    if (analytics?.trackServiceClick) {
      analytics.trackServiceClick(serviceId, serviceName);
    } else {
      noop();
    }
  };

  const trackWhatsAppClick = (serviceId?: string) => {
    if (analytics?.trackContactClick) {
      analytics.trackContactClick('whatsapp', serviceId);
    } else {
      noop();
    }
  };

  const trackPhoneClick = (serviceId?: string) => {
    if (analytics?.trackContactClick) {
      analytics.trackContactClick('phone', serviceId);
    } else {
      noop();
    }
  };

  const trackCustomEvent = (type: string, data?: any) => {
    if (analytics?.trackEvent) {
      analytics.trackEvent({
        type: type as any,
        ...data
      });
    } else {
      noop();
    }
  };

  return {
    trackServiceView,
    trackWhatsAppClick,
    trackPhoneClick,
    trackCustomEvent
  };
}