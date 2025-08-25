'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    try {
      // Si estamos en la página de login, no verificar autenticación
      if (pathname === '/admin/login') {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      const isAuth = localStorage.getItem('admin_authenticated');
      const loginTime = localStorage.getItem('admin_login_time');
      
      if (!isAuth || !loginTime) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Verificar si la sesión ha expirado (24 horas)
      const currentTime = Date.now();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
      
      if (currentTime - parseInt(loginTime) > sessionDuration) {
        // Sesión expirada
        localStorage.removeItem('admin_authenticated');
        localStorage.removeItem('admin_login_time');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (isAuthenticated && pathname === '/admin/login') {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado y no está en login, no mostrar nada (se redirigirá)
  if (!isAuthenticated && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}