'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AdminAuthGuard from '@/components/AdminAuthGuard';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_login_time');
    router.push('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Servicios', href: '/admin/servicios', icon: '🏪' },
    { name: 'Categorías', href: '/admin/categorias', icon: '📂' },
    { name: 'Configuración', href: '/admin/configuracion', icon: '⚙️' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <span className="sr-only">Abrir menú</span>
              ☰
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Panel de Administración - TuBarrio.pe
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Ver sitio público ↗
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-lg border-r border-gray-200
          transition-transform duration-300 ease-in-out
          lg:transition-none
        `}>
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium
                      transition-colors duration-200
                      ${
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Overlay para móvil */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
    </AdminAuthGuard>
  );
}