'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UsersIcon,
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const benefits = [
  {
    icon: ShieldCheckIcon,
    title: 'Servicios Verificados',
    description: 'Todos nuestros proveedores pasan por un proceso de verificación para garantizar calidad y confiabilidad.',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Sin Comisiones Ocultas',
    description: 'Conectamos directamente sin cobrar comisiones. El precio que ves es el precio que pagas.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: ClockIcon,
    title: 'Respuesta Rápida',
    description: 'Los proveedores responden en promedio en menos de 2 horas. Tu tiempo es valioso.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    icon: MapPinIcon,
    title: 'Servicios Locales',
    description: 'Encuentra servicios en tu barrio. Apoya a los emprendedores locales y reduce tiempos de espera.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    icon: UsersIcon,
    title: 'Comunidad Confiable',
    description: 'Sistema de reseñas y calificaciones de usuarios reales para tomar decisiones informadas.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  {
    icon: HeartIcon,
    title: 'Hecho con Amor',
    description: 'Creado por y para la comunidad. Nos importa el crecimiento y bienestar de tu barrio.',
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ¿Por qué elegir <span className="text-orange-600">TuBarrio</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Somos más que una plataforma, somos el corazón que conecta a tu comunidad
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-16 h-16 ${benefit.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {benefit.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Confían en nosotros
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">1000+</div>
                <div className="text-gray-600 text-sm">Servicios Completados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
                <div className="text-gray-600 text-sm">Proveedores Activos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
                <div className="text-gray-600 text-sm">Barrios Conectados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">4.8★</div>
                <div className="text-gray-600 text-sm">Calificación Promedio</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}