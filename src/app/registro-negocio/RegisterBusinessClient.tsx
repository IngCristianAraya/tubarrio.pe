'use client';

import { motion } from 'framer-motion';
import { FaStore, FaMapMarkerAlt, FaPhone, FaCheckCircle } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Dynamic import for the BusinessRegistration component
const BusinessRegistration = dynamic(
  () => import('@/components/BusinessRegistration'),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse h-96">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
          <div className="h-12 bg-gray-200 rounded w-1/2 mt-8 mx-auto"></div>
        </div>
      </div>
    )
  }
);

export default function RegisterBusinessClient() {
  const benefits = [
    {
      icon: <div className="text-2xl text-orange-500"><FaStore /></div>,
      title: 'Perfil de Negocio',
      description: 'Crea un perfil completo con información de contacto, horarios, servicios y fotos de tu negocio.'
    },
    {
      icon: <div className="text-2xl text-blue-500"><FaMapMarkerAlt /></div>,
      title: 'Visibilidad Local',
      description: 'Sé encontrado por clientes en tu zona que buscan tus productos o servicios.'
    },
    {
      icon: <div className="text-2xl text-green-500"><FaPhone /></div>,
      title: 'Atención Personalizada',
      description: 'Recibe consultas directas de clientes interesados en lo que ofreces.'
    },
    {
      icon: <div className="text-2xl text-purple-500"><FaCheckCircle /></div>,
      title: 'Verificación',
      description: 'Obtén un sello de verificación que genera confianza en tus clientes.'
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Lleva tu negocio al siguiente nivel
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
              Regístrate en TuBarrio.pe y conecta con clientes locales que buscan lo que ofreces.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Beneficios de registrar tu negocio
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Únete a la comunidad de negocios locales que ya están creciendo con nosotros.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center mb-4 mx-auto">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Registra tu negocio en minutos
                </h2>
                <p className="text-gray-600">
                  Completa el formulario y nos pondremos en contacto contigo a la brevedad.
                </p>
              </div>
              
              <BusinessRegistration />
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="text-green-500"><FaCheckCircle /></div>
                  <span>Protegemos tus datos según nuestra Política de Privacidad</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Tienes dudas sobre el registro?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Contáctanos directamente por WhatsApp y te ayudaremos con el proceso.
            </p>
            <a
              href="https://wa.me/51901426737?text=Hola%20TuBarrio.pe%2C%20tengo%20una%20consulta%20sobre%20el%20registro%20de%20mi%20negocio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
            >
              <span className="mr-2">💬</span> Hablar por WhatsApp
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
