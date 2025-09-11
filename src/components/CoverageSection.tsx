'use client';

import dynamic from 'next/dynamic';
import { FaMapMarkerAlt, FaStore, FaTruck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getButtonStyle, getCardStyle, getHeadingStyle, getTextStyle } from '@/lib/styleUtils';

// Cargar el mapa de forma dinámica para evitar problemas con SSR
const DynamicMapSection = dynamic(
  () => import('@/components/MapSection').then(mod => {
    // Add error boundary to the component
    const MapWithErrorBoundary = (props: any) => {
      try {
        return <mod.default {...props} />;
      } catch (error) {
        console.error('Error loading map:', error);
        return (
          <div className="w-full h-96 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center p-6 text-center">
            <div>
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar el mapa</h3>
              <p className="text-gray-600 mb-4">No se pudo cargar el mapa de cobertura. Por favor, inténtalo de nuevo más tarde.</p>
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
      <div className="w-full h-96 bg-gray-50 flex flex-col items-center justify-center rounded-xl">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-3 bg-gray-100 rounded w-64"></div>
        </div>
      </div>
    )
  }
);

const CoverageSection = () => {
  return (
    <section className="py-16 bg-white" id="cobertura">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={getHeadingStyle(2)}>
            Nuestras Zonas de Cobertura
          </h2>
          <p className={`mt-4 text-xl ${getTextStyle()}`}>
            Actualmente cubrimos las siguientes zonas y seguimos expandiéndonos
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 mb-12">
          <DynamicMapSection 
            showTitle={false}
            height="500px"
            showInfoPanels={false}
            interactive={true}
            zoom={14}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <motion.div 
            className={getCardStyle('elevated')}
            whileHover={{ y: -5 }}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-orange-100 rounded-full mr-4">
                  <FaMapMarkerAlt className="text-orange-500 text-xl" />
                </div>
                <h3 className={getHeadingStyle(5)}>Área de Cobertura</h3>
              </div>
              <p className={getTextStyle()}>
                Actualmente cubrimos la zona de Pando y alrededores. Estamos trabajando para expandir nuestra cobertura a más áreas próximamente.
              </p>
            </div>
          </motion.div>

          <motion.div 
            className={getCardStyle('elevated')}
            whileHover={{ y: -5 }}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-orange-100 rounded-full mr-4">
                  <FaStore className="text-orange-500 text-xl" />
                </div>
                <h3 className={getHeadingStyle(5)}>¿Tienes un negocio?</h3>
              </div>
              <p className={getTextStyle()}>
                Si tienes un negocio en nuestra zona de cobertura, regístralo para llegar a más clientes y aumentar tus ventas.
              </p>
            </div>
          </motion.div>

          <motion.div 
            className={getCardStyle('elevated')}
            whileHover={{ y: -5 }}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-orange-100 rounded-full mr-4">
                  <FaTruck className="text-orange-500 text-xl" />
                </div>
                <h3 className={getHeadingStyle(5)}>Entregas a Domicilio</h3>
              </div>
              <p className={getTextStyle()}>
                Muchos de nuestros negocios asociados ofrecen servicio de delivery. Verifica la disponibilidad en tu zona.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-orange-50 rounded-2xl p-8 md:p-12 inline-block max-w-4xl">
            <h3 className={`${getHeadingStyle(3)} mb-4`}>
              ¿No encuentras tu zona?
            </h3>
            <p className={`${getTextStyle('body')} mb-6`}>
              Estamos en constante expansión. Déjanos saber tu ubicación y te notificaremos cuando lleguemos a tu zona.
            </p>
            <a
              href="https://wa.me/51999999999?text=Hola%20TuBarrio.pe%2C%20me%20gustar%C3%ADa%20saber%20cu%C3%A1ndo%20llegar%C3%A1n%20a%20mi%20zona"
              target="_blank"
              rel="noopener noreferrer"
              className={getButtonStyle('primary', 'lg')}
            >
              <span className="mr-2">📱</span> Notifícame cuando lleguen a mi zona
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoverageSection;
