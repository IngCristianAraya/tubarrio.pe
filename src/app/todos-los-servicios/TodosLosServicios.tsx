'use client';

import React, { useState, Suspense } from 'react';
import { useServices } from '../../context/ServicesContext';
import ServiceCard from '../../components/ServiceCard';
import ServiceCardSkeleton from '../../components/ServiceCardSkeleton';
import EmptyState from '../../components/EmptyState';
import GoToTopButton from '../../components/GoToTopButton';
import CategoryChips from '../../components/CategoryChips';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BusinessBanner from '../../components/BusinessBanner';
import Image from 'next/image';
import type { Service } from '../../context/ServicesContext';
import { useSearchParams } from 'next/navigation';

function useResponsivePageSize() {
  // Always return 8 items per page for all screen sizes
  return 8;
}

const getUniqueCategories = (services: Service[]): string[] => {
  const set = new Set(services.map((s) => s.category));
  return Array.from(set);
};

export default function TodosLosServiciosPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-10">Cargando servicios...</div>}>
      <TodosLosServiciosPage />
    </Suspense>
  );
}

function TodosLosServiciosPage() {
  const PAGE_SIZE = useResponsivePageSize();
  const { services } = useServices();
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get('categoria');

  const [search, setSearch] = useState('');
  // Si no hay parámetro de categoría, mostrar todos por defecto
  const [category, setCategory] = useState(categoriaParam ?? '');
  const [page, setPage] = useState(1);

  // Si cambia el query param, actualizar el filtro
  React.useEffect(() => {
    setCategory(categoriaParam ?? '');
    setPage(1);
  }, [categoriaParam]);

  const categories = getUniqueCategories(services);

  // Filtrado
  const filtered = services.filter((s) => {
    const searchLower = search.toLowerCase();
    const matchesName = s.name.toLowerCase().includes(searchLower);
    const matchesDescription = s.description.toLowerCase().includes(searchLower);
    const matchesTags = s.tags ? s.tags.some(tag => tag.toLowerCase().includes(searchLower)) : false;
    const matchesSearch = matchesName || matchesDescription || matchesTags;
    const matchesCategory = category ? s.category === category : true;
    return matchesSearch && matchesCategory;
  });

  // Paginación
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-10 sm:py-14 md:py-24 mb-14 sm:mb-20 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Image 
            src="/images/hero_001.webp" 
            alt="Fondo de servicios" 
            fill 
            priority
            className="object-cover object-center" 
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl">
            <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 text-center tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
              <span className="inline-block px-4">
                Todos los <span className="text-yellow-300">servicios</span> de la zona
              </span>
              <span className="block mx-auto mt-3 h-2 w-32 md:w-48 rounded-full bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 animate-pulse opacity-80"></span>
            </h1>
            <p className="text-white/90 text-center text-lg md:text-xl max-w-2xl mx-auto drop-shadow-[0_1.5px_6px_rgba(0,0,0,0.36)]">
              Explora todos los servicios disponibles en tu comunidad y encuentra exactamente lo que necesitas.
            </p>
          </div>
        </div>
      </section>

      {/* Título específico */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-8 mb-10 md:mb-10">
        <div className="max-w-7xl px-3 sm:px-6 lg:px-8 -mt-8 mb-10 md:mb-2 w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-left">
            Servicios locales
          </h2>
          <div className="h-1 w-40 sm:w-56 md:w-72 bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 rounded-full mb-4" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-16 -mt-14 sm:-mt-20 relative z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col gap-4 mb-8 sticky top-2 sm:top-4 z-20 bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100">
          {/* input de buscador */}
            <input 
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full max-w-2xl border-2 border-gray-200 rounded-xl px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
            />
            {/* chips de categorías */}
            <div className="flex flex-wrap gap-2">
              <CategoryChips
                categories={categories}
                selected={category}
                onSelect={(cat) => { setCategory(cat); setPage(1); }}
              />
            </div>
          </div>

          {/* Skeleton loader */}
          {services.length === 0 ? (
            <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="w-full">
                  <ServiceCardSkeleton />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState message={search || category ? "No se encontraron servicios para tu búsqueda o categoría seleccionada." : "No hay servicios disponibles por el momento."} />
          ) : (
            <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginated.map((service) => (
                <div key={service.id + service.name} className="w-full transform transition-all hover:scale-[1.02] hover:shadow-lg">
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          )}

          <GoToTopButton />

          {/* Paginación */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 mb-8 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-md border border-gray-100 transition-all">

            {/* Botón Anterior */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-transform transform hover:scale-105 w-full sm:w-auto text-center
      ${
        page === 1
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:shadow-md"
      }`}
            >
              <span className="mr-1"></span> Anterior
            </button>

            <div className="flex gap-2 mt-4 sm:mt-0">
              {[...Array(totalPages)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    i + 1 === page ? "bg-orange-500 scale-110" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Botón Siguiente */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-transform transform hover:scale-105 w-full sm:w-auto text-center
      ${
        page === totalPages
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:shadow-md"
      }`}
            >
              Siguiente <span className="ml-1"></span>
            </button>

          </div>
        </div>
      </main>
      <BusinessBanner />
      <Footer />
    </div>
  );
}
