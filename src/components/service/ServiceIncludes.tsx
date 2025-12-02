/**
 * Componente ServiceIncludes
 * 
 * Sección universal "¿Qué incluye el servicio?" que se adapta a cualquier tipo de servicio
 * o emprendimiento. Diseñado para ser inclusivo y hacer que todos los negocios se vean
 * profesionales y valiosos, independientemente de su tamaño o categoría.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  Shield,
  Star,
  Users,
  Award,
  Heart,
  Zap,
  Gift,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { Service } from '@/types/service';

interface ServiceIncludesProps {
  service: Service;
}

// Iconos universales que funcionan para cualquier tipo de servicio
const universalIcons = {
  quality: CheckCircle,
  time: Clock,
  guarantee: Shield,
  experience: Star,
  service: Users,
  certification: Award,
  care: Heart,
  efficiency: Zap,
  bonus: Gift,
  support: Phone,
  location: MapPin,
  schedule: Calendar,
};

// Beneficios completamente universales que aplican a CUALQUIER negocio - SIMPLIFICADOS
const getUniversalBenefits = (service: Service) => {
  const baseBenefits = [
    {
      icon: 'quality',
      title: 'Calidad Garantizada',
      description: 'Nos comprometemos con la excelencia en todo lo que ofrecemos'
    },
    {
      icon: 'care',
      title: 'Atención Personalizada',
      description: 'Cada cliente recibe un trato único y especial'
    },
    {
      icon: 'support',
      title: 'Soporte Completo',
      description: 'Te acompañamos antes, durante y después de tu compra'
    },
    {
      icon: 'guarantee',
      title: 'Compromiso Total',
      description: 'Respaldamos lo que ofrecemos con nuestro compromiso'
    }
  ];

  return baseBenefits;
};

const ServiceIncludes: React.FC<ServiceIncludesProps> = ({ service }) => {
  const benefits = getUniversalBenefits(service);

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
      className="py-12 px-6 bg-gradient-to-br from-orange-50 to-amber-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Qué incluye nuestro servicio?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre todo lo que obtienes cuando eliges {service.nombre}.
            Cada detalle está pensado para brindarte la mejor experiencia.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {benefits.map((benefit, index) => {
            const IconComponent = universalIcons[benefit.icon as keyof typeof universalIcons];

            return (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100"
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-10"
          variants={itemVariants}
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              ¡Y mucho más!
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Cada servicio incluye detalles especiales que hacen la diferencia.
              Contáctanos para conocer todos los beneficios.
            </p>
            <motion.button
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Solicitar Información
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServiceIncludes;