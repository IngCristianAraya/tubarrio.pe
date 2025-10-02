'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Service } from '@/types/service';

interface ServiceMapProps {
  service: Service;
  height?: string;
  className?: string;
}

const ServiceMap: React.FC<ServiceMapProps> = ({ 
  service, 
  height = "400px", 
  className = "" 
}) => {
  // Obtener la API key de Google Maps
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  // Función para construir la URL del mapa
  const getMapUrl = () => {
    // Prioridad: coordenadas > dirección completa > dirección existente > barrio
    if (service.coordenadas && service.coordenadas.lat && service.coordenadas.lng) {
      const { lat, lng } = service.coordenadas;
      
      // Si tenemos API key, usar la API oficial de Google Maps Embed
      if (apiKey && apiKey !== 'tu-google-maps-api-key-aqui') {
        return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=16`;
      }
      
      // Fallback: usar URL simple que funciona sin API key
      return `https://www.google.com/maps?q=${lat},${lng}&output=embed&z=16`;
    }
    
    if (service.direccion_completa) {
      const query = encodeURIComponent(service.direccion_completa);
      
      if (apiKey && apiKey !== 'tu-google-maps-api-key-aqui') {
        return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}&zoom=16`;
      }
      
      return `https://www.google.com/maps?q=${query}&output=embed`;
    }
    
    if (service.address) {
      const query = encodeURIComponent(service.address);
      
      if (apiKey && apiKey !== 'tu-google-maps-api-key-aqui') {
        return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}&zoom=16`;
      }
      
      return `https://www.google.com/maps?q=${query}&output=embed`;
    }
    
    if (service.neighborhood) {
      const query = encodeURIComponent(service.neighborhood);
      
      if (apiKey && apiKey !== 'tu-google-maps-api-key-aqui') {
        return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}&zoom=16`;
      }
      
      return `https://www.google.com/maps?q=${query}&output=embed`;
    }
    
    return null;
  };

  // Función para obtener URL de direcciones
  const getDirectionsUrl = () => {
    if (service.coordenadas) {
      const { lat, lng } = service.coordenadas;
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }
    
    const address = service.direccion_completa || service.address || service.neighborhood;
    if (address) {
      const query = encodeURIComponent(address);
      return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
    }
    
    return null;
  };

  const mapUrl = getMapUrl();
  const directionsUrl = getDirectionsUrl();

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  // Si no hay datos de ubicación disponibles
  if (!mapUrl) {
    return (
      <motion.div 
        className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 text-center border border-gray-200 ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Ubicación no disponible
        </h3>
        <p className="text-gray-500">
          Los datos de ubicación para este servicio no están disponibles en este momento.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.section
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Ubicación del Servicio
              </h3>
              <p className="text-sm text-gray-600">
                {service.direccion_completa || service.address || service.neighborhood || 'Ver en el mapa'}
              </p>
            </div>
          </div>
          
          {/* Botón "Cómo llegar" */}
          {directionsUrl && (
            <motion.a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Navigation className="w-4 h-4" />
              <span className="text-sm font-medium">Cómo llegar</span>
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          )}
        </div>
      </div>

      {/* Mapa */}
      <div className="relative">
        <iframe
          width="100%"
          height={height}
          frameBorder="0"
          src={mapUrl}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Ubicación de ${service.name}`}
          className="w-full border-0"
          style={{ minHeight: '300px', border: 'none' }}
        />
      </div>

      {/* Footer con información adicional */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            {service.zona && (
              <span className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>Zona: {service.zona}</span>
              </span>
            )}
            {service.district && (
              <span>Distrito: {service.district}</span>
            )}
          </div>
          
          <div className="text-xs text-gray-500">
            Powered by Google Maps
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ServiceMap;