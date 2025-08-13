'use client';

import Link from 'next/link';
import { FiFacebook, FiInstagram, FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Animación de hover para botones
  const buttonHover = {
    scale: 1.05,
    boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.2)",
    transition: { duration: 0.2 }
  };

  // Animación de hover para iconos
  const iconHover = {
    scale: 1.1,
    rotate: 5,
    transition: { 
      type: "spring" as const,  // Using const assertion to specify the literal type
      stiffness: 400, 
      damping: 10 
    }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Sección superior */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Logo y descripción */}
          <div className="md:col-span-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-6 shadow-neumorph-dark-inner"
            >
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="/images/tubarriope_logo_penegro2.webp" 
                  alt="Tubarrio.pe" 
                  className="h-30 w-30 object-contain"
                />
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Conectando negocios locales con la comunidad. Descubre los mejores servicios en tu barrio.
              </p>
              
              {/* Botón de WhatsApp */}
              <motion.a
                href="https://wa.me/51901426737"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                whileHover={buttonHover}
              >
                <FiPhone className="mr-2" />
                Contáctanos por WhatsApp
              </motion.a>
            </motion.div>
          </div>

          {/* Enlaces rápidos */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-5 relative inline-block">
              <span className="relative z-10">Enlaces Rápidos</span>
              <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-amber-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Inicio" },
                { href: "#servicios", label: "Destacados" },
                { href: "/todos-los-servicios", label: "Categorías" },
                { href: "#cobertura", label: "Cobertura" },
                { href: "#registro", label: "Registrar Negocio" },
              ].map((item, index) => (
                <motion.li 
                  key={index} 
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link 
                    href={item.href} 
                    className="flex items-center text-gray-400 hover:text-amber-400 transition-colors duration-300 group"
                  >
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Información de contacto */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold text-white mb-5 relative inline-block">
              <span className="relative z-10">Contáctanos</span>
              <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-amber-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <FiMail className="text-amber-400 mr-3 flex-shrink-0" />
                <a href="mailto:info@tubarrio.pe" className="hover:text-amber-400 transition-colors">
                  info@tubarrio.pe
                </a>
              </li>
              <li className="flex items-center">
                <FiPhone className="text-amber-400 mr-3 flex-shrink-0" />
                <a href="tel:+51901426737" className="hover:text-amber-400 transition-colors">
                  +51 901 426 737
                </a>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold text-white mb-5 relative inline-block">
              <span className="relative z-10">Síguenos</span>
              <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-amber-500 rounded-full"></span>
            </h3>
            <div className="flex space-x-4">
              {[
                { icon: <FiFacebook size={20} />, label: 'Facebook', href: '#' },
                { icon: <FiInstagram size={20} />, label: 'Instagram', href: '#' },
                { icon: <FaWhatsapp size={20} />, label: 'WhatsApp', href: '#' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-gray-300 hover:text-amber-400 transition-colors shadow-lg hover:shadow-xl border border-gray-700 hover:border-amber-400/30"
                  whileHover={iconHover}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            
            {/* Suscripción al newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-white mb-3">Suscríbete a nuestro boletín</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico" 
                  className="bg-gray-800 border border-gray-700 rounded-l-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent w-full"
                />
                <motion.button 
                  className="bg-amber-500 text-white px-4 rounded-r-xl font-medium text-sm hover:bg-amber-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Enviar
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"></div>

        {/* Sección inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="mb-4 md:mb-0">
            © {currentYear} Tubarrio.pe - Todos los derechos reservados
          </div>
          <div className="flex space-x-6">
            <Link href="/terminos-condiciones" className="hover:text-amber-400 transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="/politica-privacidad" className="hover:text-amber-400 transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/cookies" className="hover:text-amber-400 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;