"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Componentes con carga perezosa y estados de carga personalizados
const BusinessRegistration = dynamic(
  () => import('./BusinessRegistration'), 
  { 
    loading: () => (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    ),
    ssr: false 
  }
);

const WhatsAppButton = dynamic(
  () => import('./WhatsAppButton'), 
  { 
    ssr: false 
  }
);

const LazyMapSection = dynamic(
  () => import('./LazyMapSection'), 
  { 
    loading: () => (
      <div className="h-96 bg-gray-100 flex items-center justify-center">
        <p>Cargando mapa...</p>
      </div>
    ),
    ssr: false 
  }
);

const FeaturedServices = dynamic(
  () => import('./FeaturedServices'), 
  { 
    loading: () => (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-12 bg-gray-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    ssr: false 
  }
);

// Componente memoizado para evitar renderizados innecesarios
const HomeClient = () => {
  // Estado para controlar la carga inicial
  const [isMounted, setIsMounted] = useState(false);

  // Efecto para manejar la hidratación
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Efecto para manejar navegación a anclas desde otras páginas
  useEffect(() => {
    if (!isMounted) return;

    const handleAnchorNavigation = () => {
      const hash = window.location.hash;
      if (hash) {
        // Esperar un poco para que los componentes se carguen completamente
        setTimeout(() => {
          const anchorId = hash.replace('#', '');
          const element = document.getElementById(anchorId);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 1000); // Dar tiempo para que los componentes dinámicos se carguen
      }
    };

    handleAnchorNavigation();
  }, [isMounted]);

  // Si no está montado, mostrar un loader simple
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Servicios Destacados */}
      <FeaturedServices />
      
      {/* Sección de Cobertura */}
      <LazyMapSection />
      
      {/* Registro de Negocios */}
      <BusinessRegistration />
      
      {/* Botón flotante de WhatsApp */}
      <WhatsAppButton phoneNumber="+51901426737" />
    </div>
  );
};

export default React.memo(HomeClient);
