'use client';

import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const pathname = usePathname();

  // Si estamos en la página de login, no aplicar protección
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Para todas las demás rutas admin, requerir autenticación y permisos de admin
  return (
    <ProtectedRoute requireAdmin={true}>
      {children}
    </ProtectedRoute>
  );
}