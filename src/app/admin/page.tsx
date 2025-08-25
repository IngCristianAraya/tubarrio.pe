'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from '@firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

interface Stats {
  totalServices: number;
  activeServices: number;
  categories: string[];
  recentServices: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalServices: 0,
    activeServices: 0,
    categories: [],
    recentServices: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!db) {
        throw new Error('Firebase no está configurado');
      }

      // Obtener todos los servicios
      const servicesRef = collection(db, 'services');
      const servicesSnapshot = await getDocs(servicesRef);
      const services = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calcular estadísticas
      const totalServices = services.length;
      const activeServices = services.filter(service => (service as { active?: boolean }).active !== false).length;
      const categories = [...new Set(services.map(service => service.category).filter(Boolean))];
      const recentServices = services
        .sort((a: any, b: any) => ((b.createdAt?.toDate?.() || new Date()).getTime() - (a.createdAt?.toDate?.() || new Date()).getTime()))
        .slice(0, 5);

      setStats({
        totalServices,
        activeServices,
        categories,
        recentServices
      });
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando estadísticas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error al cargar el dashboard</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button
          onClick={loadStats}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen general de tu plataforma</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🏪</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Servicios</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Servicios Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">📂</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categorías</p>
              <p className="text-2xl font-bold text-blue-600">{stats.categories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tasa Activos</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalServices > 0 ? Math.round((stats.activeServices / stats.totalServices) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Analytics de la Plataforma</h2>
        <AnalyticsDashboard />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/servicios/nuevo"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-xl mr-3">➕</span>
            <div>
              <p className="font-medium text-gray-900">Agregar Servicio</p>
              <p className="text-sm text-gray-600">Crear un nuevo servicio</p>
            </div>
          </Link>

          <Link
            href="/admin/servicios"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-xl mr-3">📋</span>
            <div>
              <p className="font-medium text-gray-900">Gestionar Servicios</p>
              <p className="text-sm text-gray-600">Ver y editar servicios</p>
            </div>
          </Link>

          <button
            onClick={loadStats}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-xl mr-3">🔄</span>
            <div>
              <p className="font-medium text-gray-900">Actualizar Datos</p>
              <p className="text-sm text-gray-600">Refrescar estadísticas</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Services */}
      {stats.recentServices.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Servicios Recientes</h2>
          <div className="space-y-3">
            {stats.recentServices.map((service, index) => (
              <div key={service.id || index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-sm">🏪</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{service.name || 'Sin nombre'}</p>
                    <p className="text-sm text-gray-600">{service.category || 'Sin categoría'}</p>
                  </div>
                </div>
                <Link
                  href={`/admin/servicios/${service.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Ver →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}