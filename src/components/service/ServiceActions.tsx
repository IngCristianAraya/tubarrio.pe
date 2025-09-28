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
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      tiktok?: string;
    };
  };
  onFavoriteToggle?: (isFavorite: boolean) => void;
}

const ServiceActions: React.FC<ServiceActionsProps> = ({ service, onFavoriteToggle }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWhatsAppLoading, setIsWhatsAppLoading] = useState(false);

  // Cargar estado de favoritos desde localStorage de forma segura
  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.includes(service.id));
    } catch (e) {
      console.warn('No se pudo acceder a localStorage', e);
      setIsFavorite(false);
    }
  }, [service.id]);

  // Manejar el cambio de favoritos
  const toggleFavorite = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const newFavorites = isFavorite
        ? favorites.filter((id: string) => id !== service.id)
        : [...favorites, service.id];
      
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      const newIsFavorite = !isFavorite;
      setIsFavorite(newIsFavorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(newIsFavorite);
      }
    } catch (e) {
      console.error('Error al actualizar favoritos', e);
    }
  };

  // Manejar clic en WhatsApp
  const handleWhatsAppClick = () => {
    if (!(service.contactUrl || service.whatsapp)) return;
    
    setIsWhatsAppLoading(true);
    
    // Simular pequeño retraso para feedback visual
    setTimeout(() => {
      if (service.contactUrl) {
        const url = service.contactUrl.startsWith('http') 
          ? service.contactUrl 
          : `https://${service.contactUrl}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      } else if (service.whatsapp) {
        const phoneNumber = service.whatsapp.replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${phoneNumber}`, '_blank', 'noopener,noreferrer');
      }
      setIsWhatsAppLoading(false);
    }, 150);
  };

  // Manejar clic en Facebook
  const handleFacebookClick = () => {
    if (service.socialMedia?.facebook) {
      const facebookUrl = service.socialMedia.facebook.startsWith('http')
        ? service.socialMedia.facebook
        : `https://${service.socialMedia.facebook}`;
      window.open(facebookUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Verificar si hay redes sociales
  const hasSocialMedia = service.socialMedia?.facebook || 
                         service.socialMedia?.instagram || 
                         service.socialMedia?.tiktok;

  return (
    <div className="w-full">
      {/* Botones principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {/* Botón de WhatsApp */}
        <motion.button
          onClick={handleWhatsAppClick}
          disabled={!(service.contactUrl || service.whatsapp)}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            (service.contactUrl || service.whatsapp)
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={(service.contactUrl || service.whatsapp) ? { scale: 1.03 } : {}}
          whileTap={(service.contactUrl || service.whatsapp) ? { scale: 0.98 } : {}}
          aria-label={
            (service.contactUrl || service.whatsapp)
              ? `Contactar a ${service.name} por WhatsApp`
              : 'Contacto no disponible'
          }
          title={(service.contactUrl || service.whatsapp) ? 'Contactar por WhatsApp' : 'Contacto no disponible'}
        >
          {isWhatsAppLoading ? (
            <span className="animate-spin text-white">💬</span>
          ) : (
            <>
              <FaWhatsapp className="w-5 h-5 text-white flex-shrink-0" />
              <span className="whitespace-nowrap">Enviar mensaje</span>
            </>
          )}
        </motion.button>

        {/* Botón de Ver Detalles */}
        {service.detailsUrl && (
          <motion.a
            href={service.detailsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Ver más detalles del servicio"
            title="Ver más detalles"
          >
            <ExternalLink className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Ver detalles</span>
          </motion.a>
        )}
      </div>

      {/* Sección de Redes Sociales */}
      {hasSocialMedia && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Síguenos en:</p>
          <div className="flex items-center gap-3">
            {service.socialMedia?.facebook && (
              <motion.button
                onClick={handleFacebookClick}
                className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Visitar Facebook"
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
                aria-label="Seguir en Instagram"
                title="Seguir en Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </motion.a>
            )}
            {service.socialMedia?.tiktok && (
              <motion.a
                href={service.socialMedia.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-black hover:bg-gray-800 text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Seguir en TikTok"
                title="Seguir en TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
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