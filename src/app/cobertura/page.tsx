'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaStore, FaTruck, FaInfoCircle, FaWhatsapp, FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '@/components/SEO';
import HeroCobertura from '@/app/cobertura/HeroCobertura';

// Cargar el mapa de forma dinámica para evitar problemas con SSR
const DynamicMapSection = dynamic(
  () => import('@/components/MapSection'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-xl">
        <div className="animate-pulse text-gray-500">Cargando mapa de cobertura...</div>
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
    <>
      <HeroCobertura
        title="Nuestra <span className='text-orange-500'>Cobertura</span>"
        subtitle="Conectando negocios y clientes en toda la zona de Pando y alrededores"
        imageUrl="/images/casa_frontal.png"
        imageAlt="Cobertura TuBarrio.pe"
      />
      <SEO 
        title="Zona de Cobertura | TuBarrio.pe"
        description="Descubre las zonas donde ofrecemos cobertura y conectamos negocios locales con su comunidad en TuBarrio.pe"
        keywords="cobertura, zonas de entrega, áreas de servicio, barrios cubiertos, TuBarrio.pe"
      />



      {/* Mapa de Cobertura */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
        
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <DynamicMapSection />
          </div>
        </div>
      </section>

      {/* Sección de Barrios Cubiertos */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Barrios y Urbanizaciones
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-8">
              Actualmente ofrecemos cobertura en los siguientes barrios y urbanizaciones de Pando y zonas aledañas:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                'Pando 3ra estapa', 'Santa Emma', 'Urb Palomino', 
                'Urb la luz', 'Barrio las Brisas', 
              ].map((barrio, index) => (
                <motion.div
                  key={barrio}
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
                >
                  <div className="bg-orange-100 p-2 rounded-full text-orange-500">
                    <FaMapMarkerAlt className="text-lg" />
                  </div>
                  <span className="font-medium text-gray-800">{barrio}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Beneficios */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Beneficios de Nuestra Cobertura
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Ofrecemos una solución integral para conectar negocios locales con su comunidad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <FaStore className="text-3xl text-orange-500" />,
                title: "Para Negocios",
                description: "Mayor visibilidad, nuevos clientes y ventas incrementadas en tu zona de influencia.",
                color: "bg-orange-50"
              },
              {
                icon: <FaTruck className="text-3xl text-blue-500" />,
                title: "Para Clientes",
                description: "Acceso rápido y sencillo a los mejores negocios locales con servicio a domicilio.",
                color: "bg-blue-50"
              },
              {
                icon: <FaInfoCircle className="text-3xl text-green-500" />,
                title: "Información Actualizada",
                description: "Datos precisos sobre horarios, productos y promociones de cada negocio.",
                color: "bg-green-50"
              }
            ].map((item, index) => (
              <motion.div 
                key={item.title}
                className={`${item.color} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
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
      
    </>
  );
};

export default CoberturaPage;
