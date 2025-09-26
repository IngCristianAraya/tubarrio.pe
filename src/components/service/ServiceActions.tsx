/**
 * Componente ServiceActions
 * 
 * Maneja los botones de acción para un servicio, incluyendo:
 * - Botón de WhatsApp con animación
 * - Botón de favoritos con persistencia local
 * - Botón para compartir en redes sociales
 * - Botón para ver más detalles
 * 
 * Este componente es responsable de los elementos interactivos que permiten a los usuarios
 * interactuar con el servicio de diversas formas.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Service } from '@/types/service';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaFacebook } from 'react-icons/fa';

interface ServiceActionsProps {
  service: Service & {
    id: string;
    detailsUrl?: string;
    whatsapp?: string;
    contactUrl?: string;
  };
  onFavoriteToggle?: (isFavorite: boolean) => void;
}

const ServiceActions: React.FC<ServiceActionsProps> = ({ service, onFavoriteToggle }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Verificar si estamos en el cliente para acceder a localStorage
  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(service.id));
    }
  }, [service.id]);

  // Manejar el cambio de favoritos
  const toggleFavorite = () => {
    if (typeof window === 'undefined') return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== service.id);
    } else {
      newFavorites = [...favorites, service.id];
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);
    if (onFavoriteToggle) {
      onFavoriteToggle(newIsFavorite);
    }
  };

  // Manejar clic en WhatsApp
  const handleWhatsAppClick = () => {
    // Usar contactUrl si está disponible, de lo contrario usar el número de WhatsApp
    if (service.contactUrl) {
      // Asegurarse de que la URL comience con https://
      const url = service.contactUrl.startsWith('http') 
        ? service.contactUrl 
        : `https://${service.contactUrl}`;
      window.open(url, '_blank');
    } else if (service.whatsapp) {
      const phoneNumber = service.whatsapp.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    }
  };

  // Manejar clic en Facebook
  const handleFacebookClick = () => {
    if (service.socialMedia?.facebook) {
      const facebookUrl = service.socialMedia.facebook.startsWith('http')
        ? service.socialMedia.facebook
        : `https://${service.socialMedia.facebook}`;
      window.open(facebookUrl, '_blank');
    }
  };

  // Los manejadores de compartir y favoritos se implementarán más adelante

  // Variantes de animación
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
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 300,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  // Verificar si hay redes sociales para mostrar
  const hasSocialMedia = service.socialMedia?.facebook || service.socialMedia?.instagram || service.socialMedia?.tiktok;

  return (
    <div className="w-full">
      {/* Botones principales */}
      <div className="flex flex-wrap items-center gap-2 w-full">
        {/* Botón de WhatsApp */}
        <motion.button
          onClick={handleWhatsAppClick}
          disabled={!(service.contactUrl || service.whatsapp)}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors flex-1 min-w-[calc(50%-0.5rem)] sm:min-w-0 ${
            (service.contactUrl || service.whatsapp)
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          variants={itemVariants}
          whileHover={(service.contactUrl || service.whatsapp) ? { scale: 1.03 } : {}}
          whileTap={(service.contactUrl || service.whatsapp) ? { scale: 0.98 } : {}}
          title={(service.contactUrl || service.whatsapp) ? 'Contactar por WhatsApp' : 'Contacto no disponible'}
        >
          <FaWhatsapp className="w-5 h-5 text-white flex-shrink-0" />
          <span className="whitespace-nowrap truncate">Enviar mensaje</span>
        </motion.button>

        {/* Botón de Ver Detalles */}
        {service.detailsUrl && (
          <motion.a
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              backgroundColor: 'rgba(99, 102, 241, 0.9)'
            }}
            whileTap={{ scale: 0.98 }}
            href={service.detailsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[calc(50%-0.5rem)] sm:min-w-0 inline-flex justify-center items-center gap-2 px-4 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Ver más detalles"
            title="Ver más detalles"
          >
            <ExternalLink className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap truncate">Ver detalles</span>
          </motion.a>
        )}

        {/* Los botones de Compartir y Guardar se implementarán más adelante */}
      </div>

      {/* Sección de Redes Sociales */}
      {hasSocialMedia && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Síguenos en:</p>
          <div className="flex items-center gap-3">
            {service.socialMedia?.facebook && (
              <motion.button
                onClick={handleFacebookClick}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Visitar Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </motion.button>
            )}
            {service.socialMedia?.instagram && (
              <motion.a
                href={service.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Seguir en Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </motion.a>
            )}
            {service.socialMedia?.tiktok && (
              <motion.a
                href={service.socialMedia.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Seguir en TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.01-5.91 2.97-1.43-.07-2.86-.7-3.9-1.67-1.52-1.41-2.32-3.5-2.04-5.5.28-2.05 1.67-3.91 3.61-4.6 1.98-.71 4.37-.15 5.75 1.21.11.12.22.25.33.38v-3.01c-.25-.04-.5-.04-.75-.05-1.1-.07-2.2.26-3.09.79-1.36.8-2.1 2.29-2.06 3.85.05 1.35.81 2.66 2.01 3.35.81.46 1.75.69 2.68.65.4-.02.8-.1 1.17-.25.6-.25 1.15-.64 1.51-1.15.3-.43.45-.95.45-1.47.05-2.43.01-4.86.02-7.29v-4.05z"/>
                </svg>
              </motion.a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceActions;
