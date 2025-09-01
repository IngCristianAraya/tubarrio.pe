'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ForceAuthCheck({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('🚨 FORCE AUTH CHECK:', {
      user: user ? 'AUTHENTICATED' : 'NULL',
      loading,
      isAdmin,
      timestamp: new Date().toISOString()
    });

    // Si no está cargando y no hay usuario, redirigir inmediatamente
    if (!loading && !user) {
      console.log('🚨 FORCING REDIRECT TO LOGIN - NO USER FOUND');
      router.replace('/admin/login');
      return;
    }

    // Si hay usuario pero no es admin, redirigir
    if (!loading && user && !isAdmin) {
      console.log('🚨 FORCING REDIRECT TO LOGIN - USER NOT ADMIN');
      router.replace('/admin/login');
      return;
    }

    if (!loading && user && isAdmin) {
      console.log('✅ USER IS AUTHENTICATED AND ADMIN - ALLOWING ACCESS');
    }
  }, [user, loading, isAdmin, router]);

  // Mostrar loading mientras se verifica
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, no mostrar nada (se está redirigiendo)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Acceso no autorizado. Redirigiendo...</p>
        </div>
      </div>
    );
  }

  // Si hay usuario pero no es admin, no mostrar nada (se está redirigiendo)
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Permisos insuficientes. Redirigiendo...</p>
        </div>
      </div>
    );
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>;
}