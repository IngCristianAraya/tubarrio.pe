/**
 * Componente ServiceSupport
 * 
 * Sección de soporte y contacto directo con integración de WhatsApp
 * y múltiples canales de comunicación para brindar confianza al cliente.
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  MapPin,
  Headphones,
  Shield,
  Zap,
  Users,
  CheckCircle
} from 'lucide-react';
import { Service } from '@/types/service';

interface ServiceSupportProps {
  service: Service;
}

const ServiceSupport: React.FC<ServiceSupportProps> = ({ service }) => {
  // Datos de contacto de TuBarrio.pe (no del servicio)
  const tubarrioWhatsApp = '+51901426737';
  const tubarrioEmail = 'tubarrio2025@gmail.com';
  const serviceName = service.nombre || 'este servicio';
  const whatsappMessage = `Hola! Me interesa el servicio "${serviceName}" que vi en TuBarrio.pe. ¿Podrían brindarme más información?`;
  const whatsappUrl = `https://wa.me/${tubarrioWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

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

  const supportFeatures = [
    {
      icon: Zap,
      title: 'Respuesta Rápida',
      description: 'Te respondemos en menos de 30 minutos'
    },
    {
      icon: Users,
      title: 'Atención Personalizada',
      description: 'Un especialista dedicado para ti'
    },
    {
      icon: Shield,
      title: 'Soporte Confiable',
      description: 'Estamos aquí antes, durante y después'
    },
    {
      icon: CheckCircle,
      title: 'Seguimiento Completo',
      description: 'Acompañamos todo el proceso'
    }
  ];

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp TuBarrio.pe',
      description: 'Chatea con nuestro equipo',
      action: 'Enviar Mensaje',
      primary: true,
      onClick: () => window.open(whatsappUrl, '_blank')
    },
    {
      icon: Phone,
      title: 'Llamada Directa TuBarrio.pe',
      description: tubarrioWhatsApp,
      action: 'Llamar Ahora',
      primary: false,
      onClick: () => window.open(`tel:${tubarrioWhatsApp}`, '_self')
    },
    {
      icon: Mail,
      title: 'Email TuBarrio.pe',
      description: tubarrioEmail,
      action: 'Enviar Email',
      primary: false,
      onClick: () => {
        const serviceName = service.nombre || 'este servicio';
        const subject = `Consulta sobre ${serviceName}`;
        window.open(`mailto:${tubarrioEmail}?subject=${encodeURIComponent(subject)}`, '_blank');
      }
    }
  ];

  return (
    <motion.section
      className="py-12 px-6 bg-gradient-to-br from-blue-50 to-indigo-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Tienes dudas? ¡Estamos aquí para ayudarte!
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Contacta directamente con el equipo de <strong>TuBarrio.pe</strong> para resolver
            todas tus preguntas y acompañarte en cada paso del proceso.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Contáctanos Directamente
            </h3>

            <div className="space-y-4">
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon;

                return (
                  <motion.div
                    key={index}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${method.primary
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white border-green-300 shadow-lg'
                        : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-md'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={method.onClick}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.primary
                            ? 'bg-white bg-opacity-20'
                            : 'bg-gradient-to-br from-blue-500 to-indigo-500'
                          }`}>
                          <IconComponent className={`w-6 h-6 ${method.primary ? 'text-white' : 'text-white'
                            }`} />
                        </div>
                        <div>
                          <h4 className={`font-semibold ${method.primary ? 'text-white' : 'text-gray-900'
                            }`}>
                            {method.title}
                          </h4>
                          <p className={`text-sm ${method.primary ? 'text-white text-opacity-90' : 'text-gray-600'
                            }`}>
                            {method.description}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${method.primary
                            ? 'bg-white text-green-600 hover:bg-gray-100'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {method.action}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Business Hours */}
            <motion.div
              className="mt-8 bg-white rounded-2xl p-6 border border-gray-200"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Horarios de Atención
                </h4>
              </div>
              <div className="text-gray-600 space-y-1">
                <p>{service.horario || 'Lunes a Viernes: 9:00 AM - 6:00 PM'}</p>
                <p>Sábados: 9:00 AM - 2:00 PM</p>
                <p className="text-sm text-blue-600 font-medium">
                  WhatsApp disponible 24/7 para consultas urgentes
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Support Features */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              ¿Por qué elegirnos?
            </h3>

            <div className="space-y-6">
              {supportFeatures.map((feature, index) => {
                const IconComponent = feature.icon;

                return (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4"
                    variants={itemVariants}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Location Info */}
            {service.direccion && (
              <motion.div
                className="mt-8 bg-white rounded-2xl p-6 border border-gray-200"
                variants={itemVariants}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Nuestra Ubicación
                  </h4>
                </div>
                <p className="text-gray-600 mb-3">
                  {service.direccion}
                </p>
                <motion.button
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    const address = encodeURIComponent(service.direccion || '');
                    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
                  }}
                >
                  Ver en Google Maps →
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-12 text-center"
          variants={itemVariants}
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Headphones className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              ¿Listo para comenzar?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Nuestro equipo está esperando para brindarte el mejor servicio.
              ¡Contáctanos ahora y comencemos juntos!
            </p>
            <motion.button
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(whatsappUrl, '_blank')}
            >
              <MessageCircle className="w-5 h-5 inline mr-2" />
              Chatear por WhatsApp
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServiceSupport;