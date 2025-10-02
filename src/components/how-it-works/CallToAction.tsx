'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-600 to-orange-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-white rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-white rounded-full blur-lg"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para conectar con tu barrio?
          </h2>
          
          <p className="text-xl text-orange-100 mb-12 leading-relaxed">
            Únete a miles de personas que ya encontraron los mejores servicios locales.
            <br />
            <span className="font-semibold">Tu barrio te está esperando.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/todos-los-servicios"
                className="bg-white text-orange-600 hover:bg-orange-50 px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all inline-block"
              >
                Explorar Servicios
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeAeaoi0L9mP6fh3DEww8yPc_4e8BJmf1sc1BhfRf7vk-pVNg/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-10 py-4 rounded-full font-bold text-lg transition-all inline-block"
              >
                Registrar mi Negocio
              </a>
            </motion.div>
          </div>

          {/* App Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Próximamente en tu móvil
            </h3>
            <p className="text-orange-100 mb-6">
              Estamos trabajando en nuestra app móvil para que puedas acceder a todos los servicios desde tu teléfono.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-3 bg-black/20 px-6 py-3 rounded-xl">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">📱</span>
                </div>
                <div className="text-left">
                  <div className="text-xs text-orange-100">Próximamente en</div>
                  <div className="text-white font-semibold">App Store</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-black/20 px-6 py-3 rounded-xl">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">🤖</span>
                </div>
                <div className="text-left">
                  <div className="text-xs text-orange-100">Próximamente en</div>
                  <div className="text-white font-semibold">Google Play</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-orange-100 mb-4">
              ¿Tienes preguntas? Estamos aquí para ayudarte
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-white">
              <a 
                href="mailto:hola@tubarrio.pe" 
                className="hover:text-orange-200 transition-colors"
              >
                📧 hola@tubarrio.pe
              </a>
              <span className="hidden sm:inline">•</span>
              <a 
                href="https://wa.me/51999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-orange-200 transition-colors"
              >
                📱 WhatsApp: +51 999 999 999
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}