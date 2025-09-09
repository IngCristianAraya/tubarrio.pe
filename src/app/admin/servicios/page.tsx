'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
// Removed Firebase Client SDK imports - now using API endpoints
import Link from 'next/link';
import { useServices } from '@/hooks/useServices';
import { useDebounce } from '@/hooks/useDebounce';
import ServicesTable from '@/components/admin/ServicesTable';
import VirtualizedServicesTable from '@/components/admin/VirtualizedServicesTable';

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  phone: string;
  whatsapp: string;
  address: string;
  image: string;
  images?: string[];
  active: boolean;
  createdAt?: any;
}

export default function ServicesPage() {
  const [localServices, setLocalServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [useVirtualization, setUseVirtualization] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 12;
  
  // 🚀 OPTIMIZACIÓN: Debounce para búsqueda
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // 🚀 OPTIMIZACIÓN: Usar hook optimizado de servicios
  const { services, loading: servicesLoading, error: servicesError, mutate } = useServices({ limit: 1000 });

  // Actualizar servicios locales cuando cambien los datos del hook
  useEffect(() => {
    if (services) {
      // Ordenar por fecha de creación (más recientes primero)
      const sortedServices = [...services].sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      setLocalServices(sortedServices);
    }
  }, [services]);



  // 🚀 OPTIMIZACIÓN: useCallback para evitar re-renders innecesarios
  const toggleServiceStatus = useCallback(async (serviceId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: !currentStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el estado del servicio');
      }
      
      // Revalidar datos después de cambiar estado
      mutate();
    } catch (err) {
      console.error('Error actualizando estado:', err);
      alert('Error al actualizar el estado del servicio');
    }
  }, []);

  // 🚀 OPTIMIZACIÓN: useCallback para evitar re-renders innecesarios
  const deleteService = useCallback(async (serviceId: string) => {
    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el servicio');
      }
      
      setDeleteConfirm(null);
      
      // Revalidar datos después de eliminar
      mutate();
    } catch (err) {
      console.error('Error eliminando servicio:', err);
      alert('Error al eliminar el servicio');
    }
  }, []);

  // 🚀 OPTIMIZACIÓN: Memoización de filtros costosos
  const filteredServices = useMemo(() => {
    return localServices.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || service.category === categoryFilter;
      const matchesStatus = statusFilter === '' || 
                           (statusFilter === 'active' && service.active !== false) ||
                           (statusFilter === 'inactive' && service.active === false);
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [localServices, debouncedSearchTerm, categoryFilter, statusFilter]);

  // 🚀 OPTIMIZACIÓN: Memoización de cálculos de paginación
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
    const startIndex = (currentPage - 1) * servicesPerPage;
    const endIndex = startIndex + servicesPerPage;
    const currentServices = filteredServices.slice(startIndex, endIndex);
    
    return { totalPages, startIndex, endIndex, currentServices };
  }, [filteredServices, currentPage, servicesPerPage]);
  
  const { totalPages, startIndex, endIndex, currentServices } = paginationData;

  // Resetear página cuando cambian los filtros (usando debouncedSearchTerm)
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, categoryFilter, statusFilter]);

  // 🚀 OPTIMIZACIÓN: Memoización de categorías únicas
  const categories = useMemo(() => {
    return Array.from(new Set(localServices.map(service => service.category).filter(Boolean)));
  }, [localServices]);

  if (servicesLoading && !services) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando servicios...</span>
      </div>
    );
  }

  if (servicesError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error al cargar servicios</h3>
        <p className="text-red-600 text-sm mt-1">{servicesError.message || 'Error desconocido'}</p>
        <button
          onClick={() => mutate()}
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Servicios</h1>
          <p className="text-gray-600 mt-1">
            {filteredServices.length} de {localServices.length} servicios
            {filteredServices.length > 0 && (
              <span className="ml-2 text-sm">
                (Página {currentPage} de {totalPages})
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => mutate()}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            disabled={servicesLoading}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {servicesLoading ? 'Actualizando...' : 'Refrescar'}
          </button>
          <Link
            href="/admin/servicios/nuevo"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ Agregar Servicio
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => mutate()}
              disabled={servicesLoading}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {servicesLoading ? '⏳ Cargando...' : '🔄 Actualizar'}
            </button>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredServices.length === 0 ? (
          <div className="p-8 text-center">
            <span className="text-4xl mb-4 block">🏪</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {localServices.length === 0 ? 'No hay servicios registrados' : 'No se encontraron servicios'}
            </h3>
            <p className="text-gray-600 mb-4">
              {localServices.length === 0 
                ? 'Comienza agregando tu primer servicio'
                : 'Intenta ajustar los filtros de búsqueda'
              }
            </p>
            {localServices.length === 0 && (
              <Link
                href="/admin/servicios/nuevo"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Agregar Primer Servicio
              </Link>
            )}
          </div>
        ) : (
          <div>
            {/* Toggle para virtualización */}
            {filteredServices.length > 50 && (
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {filteredServices.length} servicios encontrados
                </div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={useVirtualization}
                    onChange={(e) => setUseVirtualization(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Usar virtualización (recomendado para +50 servicios)
                  </span>
                </label>
              </div>
            )}
            
            {useVirtualization && filteredServices.length > 50 ? (
              <VirtualizedServicesTable
                services={currentServices}
                onToggleStatus={toggleServiceStatus}
                onDelete={setDeleteConfirm}
              />
            ) : (
              <ServicesTable
                services={currentServices}
                onToggleStatus={toggleServiceStatus}
                onDelete={setDeleteConfirm}
              />
            )}
          </div>
        )}
        
        {/* Paginación */}
        {filteredServices.length > servicesPerPage && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Mostrando {startIndex + 1} a {Math.min(endIndex, filteredServices.length)} de {filteredServices.length} servicios
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Botón Anterior */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                
                {/* Números de página */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                {/* Botón Siguiente */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              ¿Eliminar servicio?
            </h3>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. El servicio será eliminado permanentemente.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteService(deleteConfirm)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}