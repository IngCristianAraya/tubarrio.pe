'use client';

import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  ScaleIcon, 
  HandThumbUpIcon, 
  StarIcon 
} from '@heroicons/react/24/outline';
import Image from 'next/image';

const steps = [
    {
      number: '1',
      title: 'Busca el servicio',
      subtitle: 'Encuentra lo que necesitas',
      description: 'Explora nuestra amplia gama de servicios locales. Desde plomería hasta catering, tenemos todo lo que tu barrio necesita.',
      features: [
        'Búsqueda por categoría o ubicación',
        'Filtros avanzados por precio y calificación',
        'Servicios verificados y confiables'
      ],
      icon: MagnifyingGlassIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      image: '/images/step-1-search.jpg'
    },
    {
      number: '2',
      title: 'Contacta directamente',
      subtitle: 'Comunícate sin intermediarios',
      description: 'Habla directamente con el proveedor del servicio. Sin comisiones ocultas, sin intermediarios innecesarios.',
      features: [
        'WhatsApp directo con el proveedor',
        'Información de contacto verificada',
        'Respuesta rápida garantizada'
      ],
      icon: ScaleIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      image: '/images/step-2-compare.jpg'
    },
    {
      number: '3',
      title: 'Acuerda y contrata',
      subtitle: 'Negocia tu mejor precio',
      description: 'Establece los términos, horarios y precios directamente con el proveedor. Tú tienes el control total.',
      features: [
        'Negociación directa de precios',
        'Flexibilidad en horarios',
        'Términos claros y transparentes'
      ],
      icon: HandThumbUpIcon,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      image: '/images/step-3-hire.jpg'
    },
    {
      number: '4',
      title: 'Califica tu experiencia',
      subtitle: 'Ayuda a tu comunidad',
      description: 'Comparte tu experiencia para ayudar a otros vecinos a tomar mejores decisiones y mejorar la calidad del servicio.',
      features: [
        'Sistema de calificaciones transparente',
        'Reseñas verificadas de clientes reales',
        'Contribuye al crecimiento de tu barrio'
      ],
      icon: StarIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      image: '/images/step-4-enjoy.jpg'
    }
  ];

export default function ProcessSteps() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Así de <span className="text-orange-600">fácil</span> es
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En solo 4 pasos simples, conectamos tu necesidad con el mejor servicio de tu barrio
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-12 mb-20 last:mb-0`}
            >
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-orange-600 font-semibold">
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {step.description}
                </p>

                <ul className="space-y-3">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual - Ahora con imagen */}
              <div className="flex-1 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-80 h-80 rounded-3xl overflow-hidden shadow-xl"
                >
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Overlay con icono */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}