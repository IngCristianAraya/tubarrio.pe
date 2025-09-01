'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2, Shield, AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  redirectTo = '/login',
  fallback
}: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Si no hay usuario, redirigir al login
      if (!user) {
        const currentPath = window.location.pathname;
        const loginPath = requireAdmin ? '/admin/login' : redirectTo;
        
        // Agregar el redirect como query parameter
        const redirectUrl = `${loginPath}?redirect=${encodeURIComponent(currentPath)}`;
        
        // Usar router para redirección
        router.replace(redirectUrl);
        return;
      }

      // Si requiere admin pero el usuario no es admin
      if (requireAdmin && !isAdmin) {
        router.replace('/admin/login?error=unauthorized');
        return;
      }
    }
  }, [user, loading, isAdmin, requireAdmin, router, redirectTo]);

  // Si no está cargando y no hay usuario, no mostrar contenido
  if (!loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Acceso no autorizado
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Redirigiendo al login...
          </p>
        </div>
      </div>
    );
  }

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Verificando acceso...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Por favor espera mientras verificamos tu autenticación
          </p>
        </div>
      </div>
    );
  }

  // Si no hay usuario después de cargar, no mostrar nada (se redirigirá)
  if (!user) {
    return null;
  }

  // Si requiere admin pero el usuario no es admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No tienes permisos de administrador para acceder a esta página.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Ir al Inicio
            </button>
            <button
              onClick={() => router.push('/admin/login')}
              className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-4 rounded-lg transition-colors"
            >
              Iniciar Sesión como Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si todo está bien, mostrar el contenido protegido
  return <>{children}</>;
}

// Componente específico para rutas de admin
export function AdminRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute requireAdmin={true} redirectTo="/admin/login" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

// Componente para rutas que requieren autenticación básica
export function AuthRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute requireAdmin={false} redirectTo="/login" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}