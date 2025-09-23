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
import { Share2, Heart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

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

  // Manejar el compartir
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service.name,
          text: `Mira este servicio: ${service.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error al compartir:', error);
      }
    } else {
      // Fallback para navegadores que no soportan la API de Web Share
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

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
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  // No renderizar nada hasta que estemos en el cliente
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 w-full">
      {/* Botón de WhatsApp */}
      {(service.whatsapp || (service.contactUrl && (service.contactUrl.includes('wa.me') || 
          service.contactUrl.includes('whatsapp') || service.contactUrl.includes('wa.link')))) && (
        <motion.a
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
          href={`https://wa.me/${service.whatsapp?.replace(/\s/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex-1 min-w-[calc(50%-0.5rem)] sm:min-w-0 inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <span className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-all duration-300 transform -translate-x-full group-hover:translate-x-0"></span>
          <motion.span 
            className="relative flex items-center justify-center gap-2 w-full"
            initial={{ x: -5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 15 }}
          >
            <FaWhatsapp className="w-5 h-5 text-white flex-shrink-0" />
            <span className="whitespace-nowrap truncate">Enviar mensaje</span>
          </motion.span>
        </motion.a>
      )}

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
          className="flex-1 min-w-[calc(50%-0.5rem)] sm:min-w-0 inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Ver más detalles"
          title="Ver más detalles"
        >
          <div className="flex items-center justify-center gap-2 w-full">
            <ExternalLink className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap truncate">Ver detalles</span>
          </div>
        </motion.a>
      )}

      <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
        {/* Botón de Compartir */}
        <motion.button
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: 'rgba(99, 102, 241, 0.1)'
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex-1 sm:flex-none flex justify-center items-center p-3 rounded-xl bg-white/80 backdrop-blur-sm text-gray-400 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 min-w-[48px]"
          aria-label="Compartir"
          title="Compartir"
        >
          <Share2 className="h-6 w-6" aria-hidden="true" />
        </motion.button>

        {/* Botón de Favoritos */}
        <motion.button
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: isFavorite ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 0, 0, 0.05)'
          }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleFavorite}
          className={`flex-1 sm:flex-none flex justify-center items-center p-3 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-offset-2 border shadow-md hover:shadow-lg transition-all duration-300 min-w-[48px] ${
            isFavorite 
              ? 'text-red-500 border-red-200 focus:ring-red-500 hover:bg-red-50' 
              : 'text-gray-400 border-gray-200 focus:ring-indigo-500 hover:text-red-500 hover:border-red-200'
          }`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart 
            className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} 
            aria-hidden="true" 
          />
        </motion.button>
      </div>
    </div>
  );
};

export default ServiceActions;
