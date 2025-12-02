'use client';

import { usePageTracking } from '@/hooks/usePageTracking';
import { ReactNode } from 'react';

interface PageTrackerProps {
  children: ReactNode;
}

/**
 * Componente que automáticamente trackea las vistas de página
 * Se debe usar en componentes del lado del cliente
 * TEMPORALMENTE DESHABILITADO para evitar bucle de errores
 */
export function PageTracker({ children }: PageTrackerProps) {
  // TEMPORALMENTE DESHABILITADO: Este hook causaba bucle de errores
  // usePageTracking();

  return <>{children}</>;
}