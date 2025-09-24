'use client';

import * as React from 'react';
const { useMemo } = React;
import { Virtuoso } from 'react-virtuoso';
import Image from 'next/image';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  description: string;
  category?: string;
  phone?: string;
  whatsapp?: string;
  images?: string[];
  image?: string;
  active?: boolean;
}

interface VirtualizedServicesTableProps {
  services: Service[];
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

const ServiceRow = ({ service, onToggleStatus, onDelete }: {
  service: Service;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}) => {
  const imageUrl = service.images?.length ? service.images[0] : service.image;

  return (
    <div className="flex items-center px-6 py-4 border-b border-gray-200 hover:bg-gray-50">
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          {imageUrl && (
            <div className="flex-shrink-0 h-16 w-16 mr-4 relative">
              <Image
                src={imageUrl}
                alt={service.name}
                fill
                className="object-cover rounded-md"
                sizes="64px"
              />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {service.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {service.description}
            </p>
            {service.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                {service.category}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="w-48 px-4">
        <div className="text-sm text-gray-900">
          {service.phone && (
            <div className="flex items-center">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {service.phone}
            </div>
          )}
          {service.whatsapp && (
            <div className="flex items-center mt-1">
              <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.5 14.4c-.3 0-.5.2-.5.5v1.1c0 .4-.3.8-.8.8-.1 0-.3 0-.4-.1-1.2-.3-2.2-.9-3.1-1.8-.8-.8-1.4-1.8-1.7-2.9 0-.1-.1-.3-.1-.4 0-.4.3-.8.8-.8h1c.3 0 .5-.2.5-.5 0-.3-.2-.5-.5-.5h-1.4c-.5 0-1 .4-1 .9 0 .2.1.5.1.7.4 1.4 1.1 2.6 2.1 3.6.9.9 2 1.6 3.2 2 .2.1.4.1.6.1.6 0 1-.5 1-1v-1.4c0-.3-.2-.5-.5-.5h-1.2c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h1.3c.8 0 1.5.7 1.5 1.5v1.4c0 .9-.7 1.6-1.5 1.6-.2 0-.4 0-.6-.1-1.3-.4-2.5-1.1-3.5-2.1-1-1-1.8-2.2-2.2-3.6-.1-.2-.1-.4-.1-.6 0-.9.7-1.6 1.5-1.6h1.4c.8 0 1.5.7 1.5 1.5 0 .3-.2.5-.5.5s-.5-.2-.5-.5c0-.3-.2-.5-.5-.5h-1.4c-.3 0-.5.2-.5.5 0 .1 0 .2.1.3.3 1 .9 1.9 1.7 2.6.8.8 1.7 1.3 2.7 1.6.1 0 .2.1.3.1.3 0 .5-.2.5-.5v-1.1c0-.3.2-.5.5-.5h1.1z" />
              </svg>
              {service.whatsapp}
            </div>
          )}
        </div>
      </div>
      
      <div className="w-24 px-2">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          service.active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {service.active ? 'Activo' : 'Inactivo'}
        </span>
      </div>
      
      <div className="w-32 px-2 flex space-x-2">
        <button
          onClick={() => onToggleStatus(service.id, !!service.active)}
          className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          title={service.active ? 'Desactivar' : 'Activar'}
        >
          {service.active ? '🚫' : '✅'}
        </button>
        
        <Link 
          href={`/admin/servicios/${service.id}`}
          className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          title="Editar"
        >
          ✏️
        </Link>
        
        <button
          onClick={() => onDelete(service.id)}
          className="p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          title="Eliminar"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

// ServiceRow.displayName = 'ServiceRow';

const VirtualizedServicesTable = ({ services, onToggleStatus, onDelete }: VirtualizedServicesTableProps) => {
  const rowContent = useMemo(() => 
    (index: number) => {
      const service = services[index];
      return (
        <ServiceRow 
          key={service.id}
          service={service}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      );
    },
    [services, onToggleStatus, onDelete]
  );

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Servicio
          </span>
        </div>
        <div className="w-48 px-4">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Contacto
          </span>
        </div>
        <div className="w-24 px-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Estado
          </span>
        </div>
        <div className="w-32 px-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Acciones
          </span>
        </div>
      </div>
      
      <div style={{ height: '600px', width: '100%' }}>
        <Virtuoso
          style={{ height: '100%' }}
          totalCount={services.length}
          itemContent={rowContent}
          overscan={20}
        />
      </div>
    </div>
  );
};

VirtualizedServicesTable.displayName = 'VirtualizedServicesTable';

export default VirtualizedServicesTable;