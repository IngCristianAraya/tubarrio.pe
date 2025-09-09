'use client';

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import { useUserServices } from '@/hooks/useServices';
import ServiceList from '@/components/ServiceList';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, Settings, Plus, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// Página de perfil optimizada con consultas del servidor
const PerfilPage = () => {
  const [user, loading, error] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState<'servicios' | 'estadisticas'>('servicios');
  
  // Hook optimizado que solo consulta servicios del usuario autenticado
  // Usa where('userId', '==', uid) en el servidor - NO filtrado del cliente
  const { 
    services: userServices, 
    loading: servicesLoading, 
    error: servicesError,
    mutate: refreshServices
  } = useUserServices(user?.uid);

  // Redireccionar si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      redirect('/login');
    }
  }, [user, loading]);

  // Mostrar loading mientras se autentica
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Mostrar error de autenticación
  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error de autenticación
            </h1>
            <p className="text-gray-600 mb-6">
              Debes iniciar sesión para ver tu perfil
            </p>
            <Link 
              href="/login"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Estadísticas básicas de los servicios del usuario
  const stats = {
    total: userServices.length,
    activos: userServices.filter(s => s.active !== false).length,
    inactivos: userServices.filter(s => s.active === false).length,
    categorias: new Set(userServices.map(s => s.category)).size
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header del perfil */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.displayName || 'Mi Perfil'}
                </h1>
                <p className="text-gray-600">
                  {user.email}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Link
                href="/admin/servicios/nuevo"
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Servicio
              </Link>
              <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Servicios</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">{stats.activos}</div>
            <div className="text-sm text-gray-600">Activos</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-red-600">{stats.inactivos}</div>
            <div className="text-sm text-gray-600">Inactivos</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">{stats.categorias}</div>
            <div className="text-sm text-gray-600">Categorías</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('servicios')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'servicios'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mis Servicios
              </button>
              <button
                onClick={() => setActiveTab('estadisticas')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'estadisticas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Estadísticas
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'servicios' && (
              <div>
                {servicesError ? (
                  <div className="text-center py-12">
                    <div className="text-red-500 text-lg font-medium mb-2">
                      Error al cargar tus servicios
                    </div>
                    <p className="text-gray-600 mb-4">
                      {servicesError?.message || 'Ha ocurrido un error inesperado'}
                    </p>
                    <button
                      onClick={() => refreshServices()}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : userServices.length === 0 && !servicesLoading ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-lg font-medium mb-2">
                      Aún no tienes servicios publicados
                    </div>
                    <p className="text-gray-400 mb-6">
                      Comienza publicando tu primer servicio para que los usuarios puedan encontrarte
                    </p>
                    <Link
                      href="/admin/servicios/nuevo"
                      className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors inline-flex items-center"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Publicar mi primer servicio
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-medium text-gray-900">
                        Mis Servicios ({userServices.length})
                      </h3>
                      <button
                        onClick={() => refreshServices()}
                        disabled={servicesLoading}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
                      >
                        {servicesLoading ? 'Actualizando...' : 'Actualizar'}
                      </button>
                    </div>
                    
                    {/* Lista optimizada de servicios del usuario */}
                    <ServiceList
                      userId={user.uid}
                      showFilters={false}
                      title=""
                      className=""
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'estadisticas' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Estadísticas de tus servicios
                </h3>
                
                {userServices.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Publica servicios para ver estadísticas detalladas
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Distribución por categoría */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Por Categoría</h4>
                      <div className="space-y-2">
                        {Object.entries(
                          userServices.reduce((acc, service) => {
                            const cat = service.category || 'Sin categoría';
                            acc[cat] = (acc[cat] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([category, count]) => (
                          <div key={category} className="flex justify-between">
                            <span className="text-gray-600">{category}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Estado de servicios */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Estado</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Activos</span>
                          <span className="font-medium text-green-600">{stats.activos}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Inactivos</span>
                          <span className="font-medium text-red-600">{stats.inactivos}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total</span>
                          <span className="font-medium">{stats.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PerfilPage;