'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '../context/AnalyticsContext';

/**
 * Hook para tracking automático de páginas
 * Se ejecuta automáticamente cuando cambia la ruta
 */
export function usePageTracking() {
  const pathname = usePathname();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    if (pathname) {
      // Tracking automático de la página actual
      trackPageView(pathname);
    }
  }, [pathname, trackPageView]);

  return { pathname };
}

/**
 * Hook para tracking manual de eventos específicos
 */
export function useEventTracking() {
  const { trackServiceClick, trackContactClick, trackEvent } = useAnalytics();

  const trackServiceView = (serviceId: string, serviceName: string) => {
    trackServiceClick(serviceId, serviceName);
  };

  const trackWhatsAppClick = (serviceId?: string) => {
    trackContactClick('whatsapp', serviceId);
  };

  const trackPhoneClick = (serviceId?: string) => {
    trackContactClick('phone', serviceId);
  };

  const trackCustomEvent = (type: string, data?: any) => {
    trackEvent({
      type: type as any,
      ...data
    });
  };

  return {
    trackServiceView,
    trackWhatsAppClick,
    trackPhoneClick,
    trackCustomEvent
  };
}