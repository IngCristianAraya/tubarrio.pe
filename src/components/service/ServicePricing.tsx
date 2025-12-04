/**
 * Componente ServicePricing
 * 
 * Sección de precios y promociones flexible que se adapta a diferentes tipos de servicios.
 * Maneja tanto servicios con precios fijos como servicios que requieren cotización.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Percent,
  Clock,
  Calculator,
  Tag,
  Sparkles,
  TrendingDown,
  Calendar
} from 'lucide-react';
import { Service } from '@/types/service';

interface ServicePricingProps {
  service: Service;
}

// Función simplificada para determinar el tipo de precio
const getPricingType = (service: Service) => {
  const hasPrice = service.precio && service.precio > 0;

  return {
    hasPrice,
    requiresQuotation: !hasPrice,
    showPromotions: true // Siempre mostrar promociones para todos los negocios
  };
};

// Promociones completamente universales que aplican a CUALQUIER negocio - SIMPLIFICADAS
const getPromotions = (service: Service) => {
  const promotions = [
    {
      icon: 'percent',
      title: 'Cliente Nuevo',
      description: 'Descuento especial en tu primera compra',
      highlight: true
    },
    {
      icon: 'tag',
      title: 'Facilidades de Pago',
      description: 'Opciones de pago flexibles y promociones especiales',
      highlight: false
    }
  ];

  return promotions;
};

const ServicePricing: React.FC<ServicePricingProps> = ({ service }) => {
  const { hasPrice, requiresQuotation, showPromotions } = getPricingType(service);
  const promotions = getPromotions(service);

  const iconMap = {
    percent: Percent,
    clock: Clock,
    sparkles: Sparkles,
    calendar: Calendar,
    tag: Tag,
    'trending-down': TrendingDown,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.section
      className="py-12 px-6 bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {hasPrice ? 'Precios y Promociones' : 'Cotización Personalizada'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {hasPrice
              ? 'Conoce nuestros precios transparentes y aprovecha nuestras promociones especiales'
              : 'Cada proyecto es único. Te ofrecemos una cotización personalizada sin compromiso'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pricing Section */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  {hasPrice ? (
                    <CreditCard className="w-8 h-8 text-white" />
                  ) : (
                    <Calculator className="w-8 h-8 text-white" />
                  )}
                </div>

                {hasPrice ? (
                  <>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      S/ {service.precio?.toFixed(2)}
                    </div>
                    <p className="text-gray-600">Precio base del servicio</p>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      Cotización Gratuita
                    </div>
                    <p className="text-gray-600">Evaluamos tu proyecto sin costo</p>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span>Evaluación inicial incluida</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span>Sin compromisos ocultos</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span>Transparencia total en costos</span>
                </div>
              </div>

              <motion.button
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {hasPrice ? 'Reservar Ahora' : 'Solicitar Cotización'}
              </motion.button>
            </div>
          </motion.div>

          {/* Promotions Section */}
          {showPromotions && (
            <motion.div variants={itemVariants}>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Promociones Especiales
                </h3>

                {promotions.map((promo, index) => {
                  const IconComponent = iconMap[promo.icon as keyof typeof iconMap];

                  return (
                    <motion.div
                      key={index}
                      className={`p-6 rounded-2xl border transition-all duration-300 ${promo.highlight
                        ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white border-orange-300 shadow-lg'
                        : 'bg-white border-gray-200 hover:border-orange-200 hover:shadow-md'
                        }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${promo.highlight
                          ? 'bg-white bg-opacity-20'
                          : 'bg-gradient-to-br from-orange-500 to-amber-500'
                          }`}>
                          <IconComponent className={`w-6 h-6 ${promo.highlight ? 'text-white' : 'text-white'
                            }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold mb-1 ${promo.highlight ? 'text-white' : 'text-gray-900'
                            }`}>
                            {promo.title}
                          </h4>
                          <p className={`text-sm ${promo.highlight ? 'text-white text-opacity-90' : 'text-gray-600'
                            }`}>
                            {promo.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Payment Methods */}
        <motion.div
          className="mt-10 text-center"
          variants={itemVariants}
        >
          <div className="bg-gray-50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Métodos de Pago Aceptados
            </h4>
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Tarjetas de Crédito/Débito
              </span>
              <span>•</span>
              <span>Transferencias Bancarias</span>
              <span>•</span>
              <span>Efectivo</span>
              <span>•</span>
              <span>Yape/Plin</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServicePricing;