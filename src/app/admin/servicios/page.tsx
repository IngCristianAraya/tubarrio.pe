'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from '@firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';
import { useServices } from '@/context/ServicesContext';
import { useServiceCache } from '@/hooks/useServiceCache';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 12;
  
  // 🚀 OPTIMIZACIÓN: Usar contexto de servicios y cache
  const { services: contextServices, loadServicesFromFirestore } = useServices();
  const { getAllServicesFromCache, clearAllCache } = useServiceCache();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);

      let servicesData: Service[] = [];
      
      // 🚀 OPTIMIZACIÓN: Intentar obtener servicios desde cache primero
      const cachedServices = getAllServicesFromCache();
      if (cachedServices && cachedServices.length > 0) {
        servicesData = cachedServices as Service[];
        console.log(`⚡ Admin servicios desde localStorage: ${cachedServices.length} servicios (0 lecturas Firebase)`);
      } else if (contextServices && contextServices.length > 0) {
        // Usar servicios del contexto si están disponibles
        servicesData = contextServices as Service[];
        console.log(`📋 Admin servicios desde contexto: ${contextServices.length} servicios (0 lecturas Firebase)`);
      } else {
        // Solo como último recurso, cargar desde Firebase
        console.log('🔥 Admin servicios cargando desde Firebase...');
        await loadServicesFromFirestore();
        servicesData = contextServices as Service[];
      }

      // Ordenar por fecha de creación (más recientes primero)
      servicesData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setLocalServices(servicesData);
      console.log(`✅ Admin servicios cargados: ${servicesData.length} servicios`);
    } catch (err) {
      console.error('Error cargando servicios:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      if (!db) throw new Error('Firebase no está configurado');
      
      const serviceRef = doc(db, 'services', serviceId);
      await updateDoc(serviceRef, { active: !currentStatus });
      
      // Actualizar estado local y limpiar cache
      setLocalServices(prev => prev.map(service => 
        service.id === serviceId 
          ? { ...service, active: !currentStatus }
          : service
      ));
      
      // Limpiar cache para forzar recarga en próxima consulta
      clearAllCache();
    } catch (err) {
      console.error('Error actualizando estado:', err);
      alert('Error al actualizar el estado del servicio');
    }
  };

  const deleteService = async (serviceId: string) => {
    try {
      if (!db) throw new Error('Firebase no está configurado');
      
      await deleteDoc(doc(db, 'services', serviceId));
      
      // Actualizar estado local y limpiar cache
      setLocalServices(prev => prev.filter(service => service.id !== serviceId));
      setDeleteConfirm(null);
      
      // Limpiar cache para forzar recarga en próxima consulta
      clearAllCache();
    } catch (err) {
      console.error('Error eliminando servicio:', err);
      alert('Error al eliminar el servicio');
    }
  };

  // Filtrar servicios
  const filteredServices = localServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || service.category === categoryFilter;
    const matchesStatus = statusFilter === '' || 
                         (statusFilter === 'active' && service.active !== false) ||
                         (statusFilter === 'inactive' && service.active === false);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
  const startIndex = (currentPage - 1) * servicesPerPage;
  const endIndex = startIndex + servicesPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, statusFilter]);

  // Obtener categorías únicas
  const categories = Array.from(new Set(localServices.map(service => service.category).filter(Boolean)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando servicios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error al cargar servicios</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button
          onClick={loadServices}
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
        <Link
          href="/admin/servicios/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ Agregar Servicio
        </Link>
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
              onClick={loadServices}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              🔄 Actualizar
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
              {services.length === 0 ? 'No hay servicios registrados' : 'No se encontraron servicios'}
            </h3>
            <p className="text-gray-600 mb-4">
              {services.length === 0 
                ? 'Comienza agregando tu primer servicio'
                : 'Intenta ajustar los filtros de búsqueda'
              }
            </p>
            {services.length === 0 && (
              <Link
                href="/admin/servicios/nuevo"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Agregar Primer Servicio
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {(service.images && service.images.length > 0 ? service.images[0] : service.image) ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={service.images && service.images.length > 0 ? service.images[0] : service.image}
                              alt={service.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">🏪</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {service.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {service.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {service.category || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        {service.phone && (
                          <div>📞 {service.phone}</div>
                        )}
                        {service.whatsapp && (
                          <div>💬 {service.whatsapp}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleServiceStatus(service.id, service.active !== false)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.active !== false
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {service.active !== false ? '✅ Activo' : '❌ Inactivo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/servicios/${service.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(service.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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