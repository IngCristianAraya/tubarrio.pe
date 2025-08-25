'use client';

import { usePageTracking } from '@/hooks/usePageTracking';
import { ReactNode } from 'react';

interface PageTrackerProps {
  children: ReactNode;
}

/**
 * Componente que automáticamente trackea las vistas de página
 * Se debe usar en componentes del lado del cliente
 */
export function PageTracker({ children }: PageTrackerProps) {
  // Este hook automáticamente trackea la página actual
  usePageTracking();
  
  return <>{children}</>;
}