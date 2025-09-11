'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaStore, FaTruck, FaInfoCircle, FaWhatsapp, FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '@/components/SEO';

// Cargar el componente Hero de forma dinámica
const UnifiedHero = dynamic(() => import('@/components/UnifiedHero'), {
  loading: () => <div className="h-[60vh] bg-gray-100 animate-pulse"></div>,
  ssr: true
});

// Cargar el mapa de forma dinámica con manejo de errores
const DynamicMapSection = dynamic(
  () => import('@/components/MapSection').then(mod => {
    // Add error boundary to the component
    const MapWithErrorBoundary = (props: any) => {
      try {
        return <mod.default {...props} />;
      } catch (error) {
        console.error('Error loading map:', error);
        return (
          <div className="w-full h-[500px] bg-red-50 border border-red-200 rounded-xl flex items-center justify-center p-6 text-center">
            <div>
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar el mapa</h3>
              <p className="text-gray-600 mb-4">No se pudo cargar el mapa de cobertura. Por favor, inténtalo de nuevo más tarde.</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Recargar página
              </button>
            </div>
          </div>
        );
      }
    };
    return MapWithErrorBoundary;
  }),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-gray-50 flex flex-col items-center justify-center rounded-xl">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-100 rounded w-64"></div>
        </div>
      </div>
    )
  }
);

const CoberturaPage = () => {
  const [mounted, setMounted] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = useCallback(() => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  }, [showScroll]);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    setMounted(true);
    
    // Add scroll event listener only on client side
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', checkScrollTop);
      return () => window.removeEventListener('scroll', checkScrollTop);
    }
  }, [checkScrollTop]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Zona de Cobertura | TuBarrio.pe"
        description="Descubre las zonas donde ofrecemos cobertura y conectamos negocios locales con su comunidad en TuBarrio.pe"
        keywords="cobertura, zonas de entrega, áreas de servicio, barrios cubiertos, TuBarrio.pe"
      />
      
      <UnifiedHero 
        variant="coverage"
        title={
          <>
            <span className="text-gray-800">Nuestra </span>
            <span className="text-orange-500">Cobertura</span>
          </>
        }
        subtitle="Conectando negocios y clientes en toda la zona de Pando y alrededores"
        backgroundImage="/images/coverage-bg.jpg"
        showSearch={false}
      />

      {/* Mapa de Cobertura */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Nuestras Zonas de Cobertura
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Actualmente cubrimos las siguientes zonas y seguimos expandiéndonos
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <DynamicMapSection 
              height={600}
              interactive={true}
              showInfoPanels={true}
              onError={(error: Error) => {
                console.error('Map error:', error);
                // You could also track this error in your error tracking system
                // trackError('MapSectionError', error);
              }}
            />
          </div>
        </div>
      </section>

      {/* Sección de información */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-orange-100 rounded-full mr-4">
                  <FaMapMarkerAlt className="text-orange-500 text-xl" />
                </div>
                <h3 className="text-lg font-semibold">Área de Cobertura</h3>
              </div>
              <p className="text-gray-600">
                Actualmente cubrimos la zona de Pando y alrededores. Estamos trabajando para expandir nuestra cobertura a más áreas próximamente.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-orange-100 rounded-full mr-4">
                  <FaStore className="text-orange-500 text-xl" />
                </div>
                <h3 className="text-lg font-semibold">¿Tienes un negocio?</h3>
              </div>
              <p className="text-gray-600">
                Si tienes un negocio en nuestra zona de cobertura, regístralo para llegar a más clientes y aumentar tus ventas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-orange-100 rounded-full mr-4">
                  <FaTruck className="text-orange-500 text-xl" />
                </div>
                <h3 className="text-lg font-semibold">Entregas a Domicilio</h3>
              </div>
              <p className="text-gray-600">
                Muchos de nuestros negocios asociados ofrecen servicio de delivery. Verifica la disponibilidad en tu zona.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de contacto */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-orange-50 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
                ¿No encuentras tu zona?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Estamos en constante expansión. Déjanos saber tu ubicación y te notificaremos cuando lleguemos a tu zona.
              </p>
              <a
                href="https://wa.me/51999999999?text=Hola%20TuBarrio.pe%2C%20me%20gustar%C3%ADa%20saber%20cu%C3%A1ndo%20llegar%C3%A1n%20a%20mi%20zona"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                <FaWhatsapp className="mr-2" />
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 text-white overflow-hidden">
        <div 
          className="absolute inset-0 z-0 w-full h-full"
          style={{
            background: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcikiLz4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhciIgeDE9IjAiIHkxPSIwIiB4Mj0iMTkyMCIgeTI9IjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI2Y5NzMxNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNlYWIzMDgiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgo8L3N2Zz4=")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-2xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            ¿Tu barrio no está en la lista?
          </motion.h2>
          <motion.p 
            className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Estamos en constante expansión. ¡Déjanos saber tu ubicación y te avisaremos cuando lleguemos a tu zona!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <button 
              className="bg-white text-orange-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:shadow-xl"
              onClick={() => {
                window.location.href = 'https://wa.me/51901426737?text=Hola%20TuBarrio.pe%2C%20me%20gustaría%20saber%20cuándo%20llegarán%20a%20mi%20zona';
              }}
            >
              Notifícame cuando llegues
            </button>
          </motion.div>
        </div>
      </section>
      
      {/* Floating Action Buttons */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            onClick={scrollTop}
            className="fixed bottom-24 right-6 bg-orange-500 text-white p-3 rounded-full shadow-lg z-50 hover:bg-orange-600 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Volver arriba"
          >
            <FaArrowUp className="w-5 h-5" />
          </motion.button>
        )}
        
        <motion.a
          href="https://wa.me/51999999999?text=Hola%20TuBarrio.pe%2C%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg z-50 hover:bg-green-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Chatear por WhatsApp"
        >
          <FaWhatsapp className="w-6 h-6" />
        </motion.a>
      </AnimatePresence>
    </div>
  );
};

export default CoberturaPage;
