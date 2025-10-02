'use client';

import { FaMapMarkerAlt, FaStore, FaTruck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getButtonStyle, getCardStyle, getHeadingStyle, getTextStyle } from '@/lib/styleUtils';

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
        
        {/* Información de cobertura sin mapa */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl overflow-hidden border border-blue-200 mb-12 p-8">
          <div className="text-center">
            <div className="text-blue-500 text-6xl mb-6">📍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Zonas de Cobertura</h3>
            <p className="text-lg text-gray-700 mb-6">
              Ofrecemos nuestros servicios en las principales zonas de Lima y seguimos expandiéndonos para llegar a más distritos.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Lima Centro</h4>
                <p className="text-sm text-gray-600">Cercado de Lima, Breña, La Victoria</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Lima Norte</h4>
                <p className="text-sm text-gray-600">Los Olivos, San Martín de Porres, Independencia</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Lima Sur</h4>
                <p className="text-sm text-gray-600">Miraflores, San Isidro, Surco</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Lima Este</h4>
                <p className="text-sm text-gray-600">San Juan de Lurigancho, Ate, Santa Anita</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Callao</h4>
                <p className="text-sm text-gray-600">Callao, Bellavista, La Perla</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">Próximamente</h4>
                <p className="text-sm text-gray-600">Más distritos en expansión</p>
              </div>
            </div>
          </div>
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
