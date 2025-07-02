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


function useResponsivePageSize() {
  const [pageSize, setPageSize] = React.useState(10);
  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setPageSize(6);
      } else if (window.innerWidth < 1024) {
        setPageSize(9);
      } else {
        setPageSize(10);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return pageSize;
}


import type { Service } from '../../context/ServicesContext';

const getUniqueCategories = (services: Service[]): string[] => {
  const set = new Set(services.map((s) => s.category));
  return Array.from(set);
};

import { useSearchParams } from 'next/navigation';


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
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? s.category === category : true;
    return matchesSearch && matchesCategory;
  });

  // Paginación
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-3 mb-5">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1 text-left">Servicios locales</h2>
          <div className="h-1 w-72 bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 rounded-full mb-1" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-16 -mt-14 sm:-mt-20 relative z-10">

      <div className="flex flex-col gap-3 mb-6 sm:mb-8 sticky top-2 sm:top-4 z-20 bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-md">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <CategoryChips
          categories={categories}
          selected={category}
          onSelect={(cat) => { setCategory(cat); setPage(1); }}
        />
      </div>

      {/* Skeleton loader simulado: reemplaza por lógica real de carga si tienes fetch asíncrono */}
      {services.length === 0 ? (
        <div className="grid gap-2 px-1 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div className="min-w-0 w-full"><ServiceCardSkeleton key={i} /></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState message={search || category ? "No se encontraron servicios para tu búsqueda o categoría seleccionada." : "No hay servicios disponibles por el momento."} />
      ) : (
        <div className="grid gap-2 px-1 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
          {paginated.map((service) => (
            <div className="min-w-0 w-full"><ServiceCard key={service.id + service.name} service={service} /></div>
          ))}
        </div>
      )}

      <GoToTopButton />

      {/* Paginación */}
      <div className="flex justify-center items-center gap-2 mt-10">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg bg-orange-400 text-white font-semibold disabled:bg-gray-300 disabled:text-gray-500"
        >Anterior</button>
        <span className="mx-2 text-gray-700">Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded-lg bg-orange-400 text-white font-semibold disabled:bg-gray-300 disabled:text-gray-500"
        >Siguiente</button>
      </div>
    </main>
    <BusinessBanner />
    <Footer />
    </>
  );
}
