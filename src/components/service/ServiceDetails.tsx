/**
 * Componente ServiceDetails
 * 
 * Muestra información detallada sobre un servicio, incluyendo:
 * - Información del negocio (nombre, categoría, dirección)
 * - Detalles de contacto y enlaces a redes sociales
 * - Horario de atención y detalles de operación
 * - Cualquier información adicional específica del servicio
 * 
 * Este componente presenta la información principal de un servicio en un formato
 * estructurado y fácil de leer, con iconos y estilos apropiados para una mejor experiencia de usuario.
 */

import React from 'react';
import { Service } from '@/types/service';
import { MapPin, Clock, Mail, Phone, Tag, Info } from 'lucide-react';

interface ServiceDetailsProps {
  service: Service;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service }) => {
  // Función para formatear el horario
  const formatSchedule = () => {
    if (service.horario) return service.horario;
    if (service.hours) return service.hours;
    return 'No especificado';
  };

  // Función para formatear la dirección
  const formatLocation = () => {
    if (!service.location || service.location === 'none') return 'No especificada';
    return service.location;
  };

  // Función para formatear el contacto
  const formatContact = () => {
    if (service.contactUrl && service.contactUrl !== 'none') {
      return (
        <a 
          href={service.contactUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-orange-600 hover:underline"
        >
          {new URL(service.contactUrl).hostname}
        </a>
      );
    }
    return 'No especificado';
  };

  // Función para formatear WhatsApp - Siempre abre web.whatsapp.com
  const formatWhatsApp = () => {
    if (!service.whatsapp || service.whatsapp === 'none') return 'No especificado';
    
    // Limpiar el número de teléfono (solo dígitos)
    const cleanNumber = service.whatsapp.replace(/\D/g, '');
    
    // Siempre usar web.whatsapp.com
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${cleanNumber}`;
    
    return (
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-600 hover:underline flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.5 2h-11C4.02 2 2 4.02 2 6.5v11C2 19.98 4.02 22 6.5 22h11c2.48 0 4.5-2.02 4.5-4.5v-11C22 4.02 19.98 2 17.5 2zm-8.75 15.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h1.5c.41 0 .75.34.75.75s-.34.75-.75.75h-1.5zm4.5 0c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h1.5c.41 0 .75.34.75.75s-.34.75-.75.75h-1.5zm-6-3c-.41 0-.75-.34-.75-.75v-7c0-.41.34-.75.75-.75h9c.41 0 .75.34.75.75v7c0 .41-.34.75-.75.75h-9z"/>
        </svg>
        +{service.whatsapp}
      </a>
    );
  };

  return (
    <div className="w-full bg-white rounded-xl p-6 mb-6 flex flex-col gap-4 shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <Info className="w-6 h-6 text-orange-500" />
        Información del Negocio
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        {/* Columna Izquierda */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-orange-500">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Rubro</h3>
              <p className="text-gray-600">{service.category || 'No especificado'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-1 text-orange-500">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Ubicación</h3>
              <p className="text-gray-600">{formatLocation()}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-1 text-orange-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Horario de Atención</h3>
              <p className="text-gray-600">{formatSchedule()}</p>
            </div>
          </div>
        </div>
        
        {/* Columna Derecha */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-orange-500">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sitio Web / Contacto</h3>
              <p className="text-white-600">{formatContact()}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-1 text-orange-500">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">WhatsApp</h3>
              <p className="text-gray-600">{formatWhatsApp()}</p>
            </div>
          </div>
          
          {service.tags && service.tags.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="mt-1 text-orange-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Etiquetas</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {service.tags.map((tag: string, index: number) => (
                    <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Descripción */}
      {service.description && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Acerca de {service.name}</h3>
          <p className="text-gray-700 leading-relaxed">
            {service.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;