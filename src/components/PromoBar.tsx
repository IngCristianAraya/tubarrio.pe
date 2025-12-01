// components/PromoBar.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PromoBar() {
  return (
    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-3 shadow-lg">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-sm md:text-base font-medium mb-1 sm:mb-0 sm:mr-2"></span>
          <a
            href="https://registro.tubarrio.pe"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm md:text-base font-bold text-yellow-400 hover:underline transition-all duration-300 group flex flex-col sm:flex-row items-center"
          >
            <span className="group-hover:text-yellow-200 transition-colors">
              📢 ¿Tienes un negocio? ¡Regístrate en TuBarrio.pe!
            </span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}