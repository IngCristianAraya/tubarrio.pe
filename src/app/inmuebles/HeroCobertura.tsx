'use client';

// @ts-ignore - Ignorar errores de tipo para este archivo
import { motion } from 'framer-motion';

// Definir el tipo de las props
interface HeroCoberturaProps {
  title: string | any;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
}

// Componente funcional
export default function HeroCobertura(props: HeroCoberturaProps) {
  const { title, subtitle, imageUrl, imageAlt } = props;
  return (
    <section className="relative py-12 md:py-16 overflow-hidden bg-white w-full">
        {/* Pattern Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white"></div>
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.9 0 7-3.1 7-7s-3.1-7-7-7-7 3.1-7 7 3.1 7 7 7zm48 25c3.9 0 7-3.1 7-7s-3.1-7-7-7-7 3.1-7 7 3.1 7 7 7zm-43-7c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm63 31c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zM34 90c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm56-76c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zM12 86c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm28-65c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm23-11c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm-6 60c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm29-22c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zM32 63c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm57-13c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm-9-21c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM60 91c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM35 41c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM12 60c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z' fill='%23f97316' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Text Content */}
            <div className="md:w-1/2 text-center md:text-left">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                🗺️ Nuestra <span className="text-orange-500">Cobertura</span>
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Conectando negocios y clientes en toda la zona de Pando y alrededores
              </motion.p>
            </div>
            
            {/* Image */}
            <motion.div 
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img
                src="/images/casa_frontal.png"
                alt="Cobertura TuBarrio.pe"
                className="w-full max-w-md h-auto object-contain"
              />
            </motion.div>
          </div>
        </div>
      </section>
  );
};

// El export ya está en la declaración de la función 
