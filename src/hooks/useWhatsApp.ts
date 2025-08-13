'use client';

import { useState, useEffect } from 'react';

export const useWhatsApp = (phoneNumber: string, defaultMessage: string = '') => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Detectar si es un dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      );
    };
    
    // Verificar en el cliente
    if (typeof window !== 'undefined') {
      checkIfMobile();
      setIsMounted(true);
    }
  }, []);
  
  // Limpiar el número de teléfono
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Crear la URL de WhatsApp según el dispositivo
  const getWhatsAppUrl = (customMessage?: string) => {
    if (!isMounted) return '#';
    
    const messageToUse = customMessage || defaultMessage;
    const encodedMessage = messageToUse ? `&text=${encodeURIComponent(messageToUse)}` : '';
    
    if (isMobile) {
      return `https://wa.me/${cleanNumber}${encodedMessage ? `?text=${encodeURIComponent(messageToUse)}` : ''}`;
    } else {
      return `https://web.whatsapp.com/send?phone=${cleanNumber}${encodedMessage}`;
    }
  };

  return { getWhatsAppUrl, isMobile, isMounted };
};

export default useWhatsApp;
