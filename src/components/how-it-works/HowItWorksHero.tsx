'use client';

import { motion } from 'framer-motion';

export default function HowItWorksHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Media esfera de fondo */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100"></div>
        {/* Forma de media esfera */}
        <div className="absolute -bottom-1/2 left-1/2 transform -translate-x-1/2 w-[200%] h-[200%] bg-gradient-to-t from-orange-100 via-orange-50 to-transparent rounded-full opacity-60"></div>
        <div className="absolute -bottom-1/3 left-1/2 transform -translate-x-1/2 w-[150%] h-[150%] bg-gradient-to-t from-orange-200 via-orange-100 to-transparent rounded-full opacity-40"></div>
        <div className="absolute -bottom-1/4 left-1/2 transform -translate-x-1/2 w-[120%] h-[120%] bg-gradient-to-t from-orange-300 via-orange-200 to-transparent rounded-full opacity-30"></div>
      </div>

      {/* Elementos decorativos flotantes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-orange-500 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-60 left-1/4 w-3 h-3 bg-orange-300 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-32 right-1/3 w-5 h-5 bg-orange-600 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              ¿Cómo funciona{' '}
              <span className="text-orange-600 relative">
                TuBarrio
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-orange-600 rounded-full opacity-30"></div>
              </span>?
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto">
              Conectamos a tu barrio con los mejores servicios locales de manera{' '}
              <span className="text-orange-600 font-semibold">fácil, rápida y confiable</span>.
              <br />
              Descubre cómo transformamos la forma de encontrar servicios en tu comunidad.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <motion.a
                href="/servicios"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 inline-block"
              >
                Explorar Servicios
              </motion.a>

              <motion.a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeAeaoi0L9mP6fh3DEww8yPc_4e8BJmf1sc1BhfRf7vk-pVNg/viewform"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-10 py-5 rounded-full font-semibold text-lg transition-all duration-300 inline-block shadow-lg hover:shadow-xl"
              >
                Registrar mi Negocio
              </motion.a>
            </div>
          </motion.div>

          {/* Stats con diseño mejorado */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-gray-700 font-medium">Servicios Disponibles</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">24h</div>
              <div className="text-gray-700 font-medium">Respuesta Promedio</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-700 font-medium">Satisfacción del Cliente</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Onda decorativa en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-auto">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="white" fillOpacity="0.1" />
        </svg>
      </div>
    </section>
  );
}