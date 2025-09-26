'use client';

import { notFound, useParams } from 'next/navigation';
import { useServiceById } from '@/hooks/useServices';
import type { Service } from '@/types/service';
import React from 'react';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { LocalBusinessJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SocialMeta } from '@/components/seo/SocialMeta';
import { SITE_URL } from '@/lib/constants';

// Utility function to format business hours for JSON-LD
const formatBusinessHours = (hours: Record<string, any>): string[] => {
  if (!hours) return ['Mo-Sa 09:00-18:00'];
  
  const days = {
    monday: 'Mo',
    tuesday: 'Tu',
    wednesday: 'We',
    thursday: 'Th',
    friday: 'Fr',
    saturday: 'Sa',
    sunday: 'Su'
  };
  
  const result: string[] = [];
  
  // Group consecutive days with the same hours
  let currentGroup: string[] = [];
  let currentHours = '';
  
  Object.entries(days).forEach(([day, shortDay]) => {
    const dayHours = hours[day];
    if (!dayHours || dayHours.closed) return;
    
    const hoursStr = `${dayHours.open}-${dayHours.close}`;
    
    if (currentHours === hoursStr) {
      // Extend current group
      currentGroup[1] = shortDay;
    } else {
      // Close previous group if exists
      if (currentGroup.length > 0) {
        result.push(`${currentGroup[0]}-${currentGroup[1]} ${currentHours}`);
      }
      // Start new group
      currentGroup = [shortDay, shortDay];
      currentHours = hoursStr;
    }
  });
  
  // Add the last group if exists
  if (currentGroup.length > 0) {
    result.push(`${currentGroup[0]}-${currentGroup[1]} ${currentHours}`);
  }
  
  return result.length > 0 ? result : ['Mo-Sa 09:00-18:00'];
};

// Components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceHeader from '@/components/service/ServiceHeader';
import RecommendedServices from '@/components/service/RecommendedServices';

export default function ServicioDetallePage() {
  // Obtener todos los servicios del contexto (esto solo funciona en Client Components)
  // Para Server Components, normalmente cargarías los datos desde una fuente persistente (DB/API).
  // Aquí, por simplicidad, se hace una búsqueda dummy. Puedes migrar a fetch real si lo necesitas.
  // Si usas datos estáticos, puedes importar el array aquí.

  // Ejemplo de importación directa (ajusta la ruta si es necesario):
  // import { allServices } from '@/context/ServicesContext';

  // Obtener el id dinámico de la URL
  const { id } = useParams() as { id: string };

  const pathname = usePathname();
  
  // Obtener el servicio específico usando el hook optimizado
  const { service, loading, error } = useServiceById(id);

  // Mostrar 404 si el ID no es válido o hay un error de carga
  if (!id) {
    notFound();
  }

  // Mostrar 404 si el servicio no existe
  if (error && error.message?.includes('No se encontró el servicio')) {
    notFound();
  }

  // Mostrar loading mientras se carga el servicio
  if (loading || !service) {
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col">
        <main className="flex-1 w-full py-10 px-2 sm:px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8">
                <div className="animate-pulse space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Mostrar 404 si el servicio no existe
  if (error?.code === 'not-found' || (!loading && !service)) {
    notFound();
  }

  // Mostrar error si hay problemas cargando el servicio
  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col">
        <main className="flex-1 w-full py-10 px-2 sm:px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar el servicio</h1>
              <p className="text-gray-600 mb-6">No pudimos cargar la información del servicio. Por favor, intenta de nuevo.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
              >
                Reintentar
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!service) return notFound();
  
  // Generar URL canónica
  const canonicalUrl = `${SITE_URL}${pathname}`;
  
  // Generar breadcrumbs
  const breadcrumbs = [
    { name: 'Inicio', item: SITE_URL },
    { name: 'Servicios', item: `${SITE_URL}/todos-los-servicios` },
    { name: service.name, item: canonicalUrl },
  ];

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      {/* SEO Metadata */}
      <SocialMeta 
        title={service.name}
        description={service.description || `Descubre más sobre ${service.name} en TuBarrio.pe`}
        image={service.image || '/images/og-image.jpg'}
        url={canonicalUrl}
        type="website"
        tags={[service.category, service.location, 'servicios locales'].filter(Boolean) as string[]}
      />
      
      {/* JSON-LD Structured Data */}
      <LocalBusinessJsonLd
        name={service.name}
        description={service.description || `Servicio de ${service.name} en ${service.location}`}
        url={canonicalUrl}
        logo={service.image || `${SITE_URL}/images/logo.png`}
        address={{
          streetAddress: service.location || 'Dirección no especificada',
          addressLocality: service.location || 'Lima',
          addressRegion: 'Lima',
          addressCountry: 'PE',
          postalCode: '15001',
        }}
        geo={{
          latitude: '-12.0464',
          longitude: '-77.0428',
        }}
        telephone={service.whatsapp || service.social || '+51999999999'}
        openingHours={
          service.hours && typeof service.hours === 'object'
            ? formatBusinessHours(service.hours)
            : (service.horario || 'Mo-Sa 09:00-18:00')
        }
        priceRange="$$"
      />
      
      <BreadcrumbJsonLd items={breadcrumbs} />
      
      
      
      {/* Contenido principal */}
      <div className="flex-1 w-full">
        {/* Contenido del servicio */}
        <ServiceHeader service={service} />
        
        {/* Divider */}
        <div className="border-t border-gray-200 max-w-7xl mx-auto" />
        
        {/* Sección de servicios recomendados */}
        <div className="max-w-7xl mx-auto px-3 py-4 sm:px-6 sm:py-8 md:px-8">
          <RecommendedServices 
            currentServiceId={service.id}
            categorySlug={service.categorySlug || ''}
          />
        </div>
      </div>
    </div>
  );
}
