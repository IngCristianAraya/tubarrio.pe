'use client';

import { notFound, useParams } from 'next/navigation';
import { useServices } from '@/context/ServicesContext';
import React, { useEffect } from 'react';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { LocalBusinessJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { SocialMeta } from '@/components/seo/SocialMeta';
import { SITE_URL } from '@/lib/constants';

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

  // Obtener servicios del contexto global
  const { 
    services: allServices, 
    loadSingleService, 
    loading 
  } = useServices();
  const pathname = usePathname();
  
  // Cargar el servicio específico
  useEffect(() => {
    if (id) {
      loadSingleService(id);
    }
  }, [id, loadSingleService]);
  
  const service = allServices.find(s => s.id === id);

  // Mostrar loading mientras se carga el servicio
  if (loading && !service) {
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col">
        <Header />
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
        tags={[service.category, service.location, 'servicios locales']}
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
        openingHours={service.hours || service.horario || 'Mo-Sa 09:00-18:00'}
        priceRange="$$"
      />
      
      <BreadcrumbJsonLd items={breadcrumbs} />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 w-full py-10 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Main Content Container */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Service Header Component (now includes all service details and actions) */}
            <div className="p-4 sm:p-6 md:p-8">
              <ServiceHeader service={service} />
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200" />
            
            {/* Recommended Services Section */}
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Servicios relacionados</h2>
              <RecommendedServices 
                services={allServices}
                currentServiceId={service.id}
                category={service.category}
              />
            </div>
          </div>
        </div>

      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

