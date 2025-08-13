/**
 * Componente ServiceActions
 * 
 * Maneja los botones de acción para un servicio, incluyendo:
 * - Botón principal de contacto (correo/formulario de contacto)
 * - Botón de WhatsApp (cuando está disponible)
 * - Cualquier otro botón de acción relacionado con el servicio
 * 
 * Este componente es responsable de los elementos interactivos que permiten a los usuarios
 * iniciar contacto o realizar acciones relacionadas con el servicio.
 */

'use client';

import React from 'react';
import { Service } from '@/types/service';
import useWhatsApp from '@/hooks/useWhatsApp';

interface ServiceActionsProps {
  service: Service;
}

const ServiceActions: React.FC<ServiceActionsProps> = ({ service }) => {
  const defaultMessage = `Hola, estoy interesado en el servicio de ${service.name}. ¿Podrían brindarme más información?`;
  const { getWhatsAppUrl } = useWhatsApp(service.whatsapp || '', defaultMessage);
  
  // If no contact method is available, don't render anything
  if (!service.detailsUrl && !service.whatsapp) {
    return null;
  }
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4 w-full">
      <a 
        href={service.detailsUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-all duration-200 w-full sm:w-auto sm:min-w-[210px] text-center"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-5 h-5 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
          />
        </svg>
        Contactar negocio
      </a>
      
      {service.whatsapp && service.whatsapp !== 'none' && (
        <a 
          href={getWhatsAppUrl()} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-base sm:text-lg shadow-lg transition-all duration-200 w-full sm:w-auto sm:min-w-[210px] text-center"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M17.5 14.4l-2-2c-.3-.2-.6-.3-1-.2-1.1.3-2.2.4-3.3.4-3.6 0-6.5-2.9-6.5-6.5 0-.5.1-1 .2-1.5.1-.4 0-.8-.2-1.1l-2-2C2.5 3.3 2 4.6 2 6c0 5.5 4.5 10 10 10 1.4 0 2.7-.3 3.9-.8.4-.2.8-.1 1.1.1l2.5 2.5c.4.4 1 .4 1.4 0l1.4-1.4c.4-.4.4-1 0-1.4l-3-3z"/>
            <path d="M21.6 18.1l-1.8-1.8c.5-.9.9-1.9 1.1-2.9.1-.4 0-.8-.2-1.1l-2.9-2.9c-.3-.3-.7-.4-1.1-.2-.9.2-1.8.3-2.7.3-1.8 0-3.5-.5-5-1.4l-1.4 1.4c1.2.9 2.6 1.6 4.1 2.1l-4.1 4.1c-1.6-1.6-2.6-3.8-2.6-6.1 0-1.1.2-2.1.5-3.1l1.4-1.4c-.9-1.5-1.4-3.2-1.4-5 0-1.3.3-2.6.8-3.8L5.9 2.4C4.8 3.5 4 5 4 6.5 4 12.4 8.6 17 14.5 17c1.5 0 2.9-.4 4.2-1l1.8 1.8c.4.4 1 .4 1.4 0l1.4-1.4c.4-.4.4-1 0-1.4l-1.7-1.9z"/>
          </svg>
          WhatsApp
        </a>
      )}
    </div>
  );
};

export default ServiceActions;
