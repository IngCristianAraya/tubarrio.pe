'use client';

import Link from 'next/link';
import { ArrowRight, Code, Layout, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function WebDesignBanner() {
  const [isMobile, setIsMobile] = useState(false);
  const phoneNumber = '51987654321'; // Reemplaza con el número de teléfono deseado
  const defaultMessage = 'Hola, me gustaría obtener más información sobre los servicios de desarrollo web';
  
  // Detectar si es un dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      );
    };
    
    // Verificar en el cliente
    if (typeof window !== 'undefined') {
      checkIfMobile();
    }
  }, []);
  
  // Limpiar el número de teléfono
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Crear la URL de WhatsApp
  const getWhatsAppUrl = (customMessage?: string) => {
    const baseUrl = isMobile 
      ? `https://wa.me/${cleanNumber}`
      : `https://web.whatsapp.com/send?phone=${cleanNumber}`;
    
    // Añadir el mensaje codificado si existe
    return customMessage 
      ? `${baseUrl}?text=${encodeURIComponent(customMessage)}`
      : baseUrl;
  };

  // Las animaciones de Framer Motion pueden quedarse igual, son perfectas.
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  } as const;

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15
      }
    }
  } as const;

  // Nuevas características enfocadas en servicios de desarrollo web
  const features = [
    'Diseño web personalizado y moderno',
    'Optimización para motores de búsqueda (SEO)',
    'Sitio web responsive para todos los dispositivos',
    'Integración con tus redes sociales'
  ];

  // Puedes cambiar o mantener las "premiumFeatures" para un paquete más completo
  const premiumFeatures = [
    'Tienda online (e-commerce)',
    'Panel de administración de contenido',
    'Integración de pagos en línea',
    'Soporte y mantenimiento mensual'
  ];

  return (
    <section className="w-full bg-gradient-to-br from-white via-gray-50 to-white py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden border-t border-gray-100">
      {/* Elementos decorativos sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="bg-white border border-gray-100 rounded-2xl p-8 sm:p-10 shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
            {/* Contenido principal */}
            <motion.div 
              className="lg:w-1/2"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {/* Nuevo texto para el "tag" del banner */}
              <motion.div 
                className="inline-flex items-center gap-2.5 mb-6 bg-amber-50 px-4 py-2.5 rounded-full border border-amber-100 shadow-sm"
                variants={item}
              >
                <div className="p-1.5 bg-amber-100 rounded-lg">
                  <Code className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-xs font-medium tracking-wider text-amber-700">DESARROLLO WEB</span>
              </motion.div>
              
              {/* Nuevo título principal */}
              <motion.h2 
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                variants={item}
              >
                <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Lleva tu negocio al siguiente nivel</span><br />
                <span className="text-gray-700">con una página web profesional</span>
              </motion.h2>
              
              {/* Lista de características */}
              <motion.ul 
                className="space-y-3 mb-8"
                variants={container}
              >
                {features.map((feature, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-center gap-3 group"
                    variants={item}
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{feature}</span>
                  </motion.li>
                ))}
              </motion.ul>
              
              {/* Botón de llamada a la acción */}
              <motion.div variants={item} className="mt-10">
                <a 
                  href={getWhatsAppUrl('Hola, me gustaría cotizar un proyecto de desarrollo web')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium px-6 py-3.5 rounded-xl hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]"
                >
                  <TrendingUp className="w-4 h-4 text-white" />
                  <span>Cotizar mi proyecto</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </motion.div>

            {/* Tarjeta de paquete/precios */}
            <motion.div 
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ 
                opacity: 1, 
                scale: 1,
                transition: {
                  delay: 0.2,
                  duration: 0.5
                }
              }}
              viewport={{ once: true }}
            >
              <div className="relative bg-white border border-gray-200 rounded-2xl p-8 shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
                    <div>
                      <span className="text-xs font-medium text-amber-600 tracking-wider">PAQUETE PREMIUM</span>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">Solución Completa</h3>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-amber-700">¡EL MÁS POPULAR!</span>
                    </div>
                  </div>
                                    <div className="space-y-6">
                      <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-bold text-gray-900">Consúltanos</span>
                          <span className="text-amber-700 text-sm font-medium mb-1">para tu proyecto</span>
                        </div>
                        <div className="text-amber-700 text-sm mt-1">Presupuesto personalizado y sin compromiso</div>
                      </div>
                      
                      <div className="h-px bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"></div>
                      
                      <ul className="space-y-3.5">
                        {premiumFeatures.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3 group">
                            <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-amber-200 transition-colors">
                              <CheckCircle className="w-3 h-3 text-amber-600" />
                            </div>
                            <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <a 
                        href={getWhatsAppUrl('Hola, me interesa obtener más información sobre el paquete premium de desarrollo web')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]"
                      >
                        Contactar para más info
                      </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}