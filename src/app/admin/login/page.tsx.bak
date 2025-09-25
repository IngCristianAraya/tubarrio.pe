'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { ArrowLeft, Shield, Lock } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const redirectTo = searchParams.get('redirect') || '/admin';
  const error = searchParams.get('error');

  useEffect(() => {
    // Mostrar error si existe
    if (error === 'unauthorized') {
      toast.error('Sesión expirada. Por favor inicia sesión nuevamente');
    }
  }, [error]);

  // Efecto separado para manejar redirecciones después del login
  useEffect(() => {
    // Solo redirigir si el usuario acaba de autenticarse (no en carga inicial)
    if (user && isAdmin && !loading) {
      // Verificar si venimos de un redirect o si es acceso directo
      const hasRedirectParam = searchParams.get('redirect');
      if (hasRedirectParam) {
        router.push(redirectTo);
      }
    }

    // Si está autenticado pero no es admin
    if (user && !isAdmin && !loading) {
      toast.error('No tienes permisos de administrador');
      router.push('/');
    }
  }, [user, isAdmin, loading, router, redirectTo, searchParams]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  // Si ya está autenticado como admin, no mostrar nada (se redirigirá)
  if (user && isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Link 
          href="/"
          className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver al sitio
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Admin Brand */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Shield className="w-16 h-16 text-blue-400" />
                <Lock className="w-6 h-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-300">
              TuBarrio.pe - Acceso Restringido
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-yellow-400 font-medium text-sm mb-1">
                  Área Segura
                </h3>
                <p className="text-yellow-200 text-xs">
                  Solo personal autorizado puede acceder a esta sección. 
                  Todas las actividades son monitoreadas y registradas.
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <LoginForm redirectTo={redirectTo} />

          {/* Help */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm mb-2">
              ¿Problemas para acceder?
            </p>
            <button
              onClick={() => toast.info('Contacta al administrador del sistema para obtener ayuda')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              Contactar soporte técnico
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-500">
          Sistema protegido por autenticación Firebase
        </p>
      </div>
    </div>
  );
}