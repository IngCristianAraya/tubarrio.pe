'use client';

import React, { useState } from 'react';
import useWhatsApp from '@/hooks/useWhatsApp';
import { useEventTracking } from '@/hooks/usePageTracking';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  phoneNumber, 
  message = 'Hola, me gustaría obtener más información sobre Tubarrio.pe' 
}) => {
  const { getWhatsAppUrl } = useWhatsApp(phoneNumber, message);
  const { trackWhatsAppClick } = useEventTracking();
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    trackWhatsAppClick();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {(showTooltip || isHovered) && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
          ¡Contáctanos por WhatsApp!
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
      
      <a 
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500 text-white shadow-xl hover:bg-green-600 transition-all duration-300 hover:scale-110 hover:shadow-2xl group"
        aria-label="Contactar por WhatsApp"
      >
        {/* Animación de pulso */}
        <div className="absolute animate-ping w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-400 opacity-75 group-hover:opacity-0 transition-opacity"></div>
        
        {/* Icono de WhatsApp */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 sm:w-8 sm:h-8 relative z-10">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.72.045.419-.1.824z"/>
        </svg>
      </a>
      
      {/* Mostrar tooltip automáticamente después de 3 segundos */}
      {!showTooltip && (
        <div className="animate-delay-3000">
          <button
            onClick={() => setShowTooltip(true)}
            className="sr-only"
            onFocus={() => setShowTooltip(true)}
          />
        </div>
      )}
    </div>
  );
};

export default WhatsAppButton;
