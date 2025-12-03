// Componente: TodosLosServicios
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useServices, type Service as ContextService } from '../../context/ServicesContext';
import type { Service } from '@/types/service';
import ServiceCard from '../../components/ServiceCard';
import ServiceCardSkeleton from '../../components/ServiceCardSkeleton';
import EmptyState from '../../components/EmptyState';
import CategoryChips from '../../components/CategoryChips';
import FiltersDrawer from '@/components/filters/FiltersDrawer';
import { useSearchParams } from 'next/navigation';
import { useAnalytics } from '../../context/AnalyticsContext';
type AnyService = Service | ContextService;

// Las categorías ahora vienen del contexto como `{ slug, name }`.

interface TodosLosServiciosProps {
  initialCategory?: string;
  initialSearch?: string;
  isHome?: boolean;
}

export default function TodosLosServicios({
  initialCategory = '',
  initialSearch = '',
  isHome = false
}: TodosLosServiciosProps) {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams?.get('categoria') || '';
  const busquedaParam = searchParams?.get('busqueda') || '';
  const barrioParam = searchParams?.get('barrio') || '';
  const distritoParam = searchParams?.get('distrito') || '';
  const nearbyParam = searchParams?.get('nearby') || '';


  // Estado para recomendaciones por ubicación
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [recommended, setRecommended] = useState<Service[]>([]);
  const [recommending, setRecommending] = useState<boolean>(false);
  const [recommendError, setRecommendError] = useState<string | null>(null);
  const {
    services,
    filteredServices,
    loading,
    error,
    refreshServices,
    categories,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    selectedNeighborhood,
    selectedDistrict,
    setSelectedNeighborhood,
    setSelectedDistrict,
    resetSearch
  } = useServices();

  // Asegurar que existan los arrays de barrios y distritos antes del render
  const neighborhoods = useMemo(() => {
    const set = new Set<string>();
    services.forEach(s => {
      if (s.neighborhood) set.add(s.neighborhood);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [services]);

  const districts = useMemo(() => {
    const set = new Set<string>();
    services.forEach(s => {
      if (s.district) set.add(s.district);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [services]);
  const { trackEvent } = useAnalytics();

  // Helpers para URL y localStorage
  const updateURLParams = useCallback((lat?: number, lon?: number, radius?: number) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (lat != null && lon != null) {
      url.searchParams.set('lat', String(lat));
      url.searchParams.set('lon', String(lon));
    }
    if (radius != null) {
      url.searchParams.set('radius', String(radius));
    }
    window.history.pushState({}, '', url.toString());
  }, []);

  const clearURLParams = useCallback(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.delete('lat');
    url.searchParams.delete('lon');
    url.searchParams.delete('radius');
    window.history.pushState({}, '', url.toString());
  }, []);

  // Restaurar estado (radius desde localStorage y recomendaciones desde URL)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedRadius = window.localStorage.getItem('radiusKm');
    if (savedRadius) {
      const r = Number(savedRadius);
      if (!Number.isNaN(r)) setRadiusKm(r);
    }
    const latStr = searchParams?.get('lat');
    const lonStr = searchParams?.get('lon');
    const radiusStr = searchParams?.get('radius');
    const lat = latStr ? Number(latStr) : undefined;
    const lon = lonStr ? Number(lonStr) : undefined;
    const r = radiusStr ? Number(radiusStr) : undefined;
    if (r && !Number.isNaN(r)) setRadiusKm(r);
    if (lat != null && lon != null && Number.isFinite(lat) && Number.isFinite(lon)) {
      fetchRecommendations(lat, lon);
    }
  }, []);

  // Sincronizar URL params y props iniciales con el contexto de filtros
  useEffect(() => {
    if (initialSearch) setSearchTerm(initialSearch);
    if (initialCategory) setSelectedCategory(initialCategory);
    if (busquedaParam) setSearchTerm(busquedaParam);
    if (categoriaParam) setSelectedCategory(categoriaParam);
    if (barrioParam) setSelectedNeighborhood(barrioParam);
    if (distritoParam) setSelectedDistrict(distritoParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearch, initialCategory, busquedaParam, categoriaParam, barrioParam, distritoParam]);

  // Guardar radius en localStorage y sincronizar URL si ya hay ubicación
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('radiusKm', String(radiusKm));
    const latStr = searchParams?.get('lat');
    const lonStr = searchParams?.get('lon');
    if (latStr && lonStr) {
      updateURLParams(Number(latStr), Number(lonStr), radiusKm);
    }
  }, [radiusKm, searchParams, updateURLParams]);

  // Autodisparar uso de ubicación si viene desde la pestaña "Cerca"
  useEffect(() => {
    if (nearbyParam === '1' && !recommending && recommended.length === 0) {
      requestLocationAndRecommend();
    }
  }, [nearbyParam]);

  const fetchRecommendations = useCallback(async (lat: number, lon: number) => {
    setRecommendError(null);
    setRecommending(true);
    try {
      await trackEvent({ type: 'use_location', page: '/todos-los-servicios', radiusKm });

      const r = await fetch('/api/services/recommended', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon, radiusKm })
      });
      if (!r.ok) throw new Error(`Error ${r.status}`);
      const json = await r.json();
      const items = Array.isArray(json.items) ? (json.items as Service[]) : [];
      setRecommended(items);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('lastLocation', JSON.stringify({ lat, lon }));
      }
      updateURLParams(lat, lon, radiusKm);

      await trackEvent({ type: 'recommendation_results', page: '/todos-los-servicios', radiusKm, resultsCount: items.length });
    } catch (err) {
      setRecommendError('No se pudieron cargar recomendaciones cercanas');
    } finally {
      setRecommending(false);
    }
  }, [radiusKm, trackEvent, updateURLParams]);

  // Solicitar ubicación y obtener recomendaciones
  const requestLocationAndRecommend = async () => {
    setRecommendError(null);
    setRecommending(true);
    try {
      if (!('geolocation' in navigator)) {
        setRecommendError('La geolocalización no está soportada en este navegador');
        setRecommending(false);
        return;
      }
      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            fetchRecommendations(lat, lon).then(resolve).catch(reject);
          },
          (err) => {
            setRecommendError(
              err.code === err.PERMISSION_DENIED
                ? 'Permiso de ubicación denegado. Habilítalo en la configuración del navegador y asegúrate de que este sitio esté en HTTPS.'
                : err.code === err.POSITION_UNAVAILABLE
                  ? 'Ubicación no disponible'
                  : 'Tiempo de espera agotado'
            );
            setRecommending(false);
            reject(err);
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
        );
      });
    } catch {
      // ya manejado en callbacks
    }
  };

  const clearRecommendations = () => {
    setRecommended([]);
    setRecommendError(null);
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setNeighborhood('');
    setDistrict('');
    setRecommended([]);
    setRecommendError(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('lastLocation');
    }
    clearURLParams();
  };

  if (loading && services.length === 0) {
    return (
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-full">
            <ServiceCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">Error al cargar los servicios</div>
        <button
          onClick={refreshServices}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {!isHome && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedCategory
                ? `Servicios: ${categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}`
                : 'Todos Nuestros Servicios'}
            </h1>
            <p className="text-gray-600">
              {filteredServices.length > 0 && (
                <>
                  Mostrando {filteredServices.length} servicios
                  {(searchTerm || selectedCategory || selectedNeighborhood || selectedDistrict) && ' filtrados'}
                </>
              )}
            </p>
            {/* Controles principales: pila vertical simple y responsiva */}
            <div className="mt-4 flex flex-col gap-3">
              {/* Búsqueda */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Ubicación, radio y restablecer */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={requestLocationAndRecommend}
                  disabled={recommending}
                  className="px-3 py-2 rounded-lg border border-orange-500 text-orange-600 hover:bg-orange-50 disabled:opacity-50"
                >
                  {recommending ? 'Obteniendo ubicación…' : 'Usar mi ubicación'}
                </button>
                <div className="flex flex-wrap rounded-lg overflow-hidden border border-gray-300">
                  {[3, 5, 10].map(r => (
                    <button
                      key={r}
                      onClick={() => setRadiusKm(r)}
                      aria-pressed={radiusKm === r}
                      className={`px-3 py-2 text-sm ${radiusKm === r ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} ${r !== 10 ? 'border-r border-gray-300' : ''}`}
                    >
                      {`Radio ${r} km`}
                    </button>
                  ))}
                </div>
                {recommended.length > 0 && (
                  <button
                    onClick={clearRecommendations}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Limpiar recomendaciones
                  </button>
                )}
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Restablecer filtros
                </button>
              </div>

              {recommendError && (
                <p className="text-sm text-red-600">{recommendError}</p>
              )}
              {recommended.length > 0 && (
                <p className="text-sm text-gray-600">Mostrando servicios cerca de tu ubicación (hasta {radiusKm} km)</p>
              )}

              {/* Filtros drawer */}
              <FiltersDrawer
                categories={categories}
                neighborhoods={neighborhoods}
                districts={districts}
                basePath="/todos-los-servicios"
              />
            </div>
          </div>
        )}

        {/* Chips de categorías */}
        <div className="mt-6">
          <CategoryChips
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>


        {(recommended.length === 0 ? filteredServices.length === 0 : recommended.length === 0) ? (
          <EmptyState
            message={searchTerm || selectedCategory || selectedNeighborhood || selectedDistrict
              ? "No se encontraron servicios para tu búsqueda o filtros seleccionados."
              : "No hay servicios disponibles por el momento."
            }
          />
        ) : (
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(recommended.length > 0 ? recommended : filteredServices).map((service) => (
              <div key={service.id} className="w-full transform transition-all hover:scale-[1.02] hover:shadow-lg">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
