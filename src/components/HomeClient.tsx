"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Componentes con carga perezosa y estados de carga personalizados
const TodosLosServiciosWrapper = dynamic(
  () => import('../app/todos-los-servicios/TodosLosServicios'),
  { 
    loading: () => (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    ssr: false 
  }
);
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

// FeaturedServices temporalmente deshabilitado
const FeaturedServices = () => null;

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
    <div className="space-y-0">
      {/* Servicios Destacados */}
      <FeaturedServices />
      
      {/* Sección de Cobertura - CTA */}
      <section className="py-16 bg-white" id="cobertura">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿Buscas cobertura en tu zona?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubre todas las zonas que cubrimos y verifica si estamos disponibles en tu ubicación.
          </p>
          <a
            href="/cobertura"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors"
          >
            Ver mapa de cobertura
          </a>
        </div>
      </section>
      
      {/* Botón flotante de WhatsApp */}
      <WhatsAppButton phoneNumber="+51901426737" />
    </div>
  );
};

export default React.memo(HomeClient);
