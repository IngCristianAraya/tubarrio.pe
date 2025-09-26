'use client';

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AnalyticsDashboardProps {
  days?: number;
}

export function AnalyticsDashboard({ days = 30 }: AnalyticsDashboardProps) {
  return (
    <Alert className="max-w-2xl mx-auto">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Panel de Análisis</AlertTitle>
      <AlertDescription>
        La funcionalidad de análisis está actualmente en desarrollo y no está disponible en este momento. 
        Estamos trabajando para ofrecerte estadísticas detalladas sobre el rendimiento de tu negocio.
      </AlertDescription>
    </Alert>
  );
}