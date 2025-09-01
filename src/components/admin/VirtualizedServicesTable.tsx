'use client';

import React, { memo } from 'react';
import { FixedSizeList as List } from 'react-window';
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

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    services: Service[];
    onToggleStatus: (id: string, currentStatus: boolean) => void;
    onDelete: (id: string) => void;
  };
}

const ServiceRow = memo(({ index, style, data }: RowProps) => {
  const { services, onToggleStatus, onDelete } = data;
  const service = services[index];

  if (!service) return null;

  const imageUrl = service.images && service.images.length > 0 ? service.images[0] : service.image;

  return (
    <div style={style} className="flex items-center px-6 py-4 border-b border-gray-200 hover:bg-gray-50">
      {/* Servicio */}
      <div className="flex items-center flex-1 min-w-0">
        <div className="flex-shrink-0 h-10 w-10">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={service.name}
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs">🏪</span>
            </div>
          )}
        </div>
        <div className="ml-4 flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">
            {service.name}
          </div>
          <div className="text-sm text-gray-500 truncate">
            {service.description}
          </div>
        </div>
      </div>

      {/* Categoría */}
      <div className="w-32 px-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 truncate">
          {service.category || 'Sin categoría'}
        </span>
      </div>

      {/* Contacto */}
      <div className="w-32 px-2 text-sm text-gray-900">
        <div className="space-y-1">
          {service.phone && (
            <div className="truncate">📞 {service.phone}</div>
          )}
          {service.whatsapp && (
            <div className="truncate">💬 {service.whatsapp}</div>
          )}
        </div>
      </div>

      {/* Estado */}
      <div className="w-24 px-2">
        <button
          onClick={() => onToggleStatus(service.id, service.active !== false)}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            service.active !== false
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {service.active !== false ? '✅ Activo' : '❌ Inactivo'}
        </button>
      </div>

      {/* Acciones */}
      <div className="w-20 px-2">
        <div className="flex items-center justify-end space-x-2">
          <Link
            href={`/admin/servicios/${service.id}`}
            className="text-blue-600 hover:text-blue-900"
          >
            ✏️
          </Link>
          <button
            onClick={() => onDelete(service.id)}
            className="text-red-600 hover:text-red-900"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
});

ServiceRow.displayName = 'ServiceRow';

const VirtualizedServicesTable = memo(({ services, onToggleStatus, onDelete }: VirtualizedServicesTableProps) => {
  const itemData = {
    services,
    onToggleStatus,
    onDelete,
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Servicio
            </span>
          </div>
          <div className="w-32 px-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoría
            </span>
          </div>
          <div className="w-32 px-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contacto
            </span>
          </div>
          <div className="w-24 px-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </span>
          </div>
          <div className="w-20 px-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
              Acciones
            </span>
          </div>
        </div>
      </div>

      {/* Virtualized List */}
      <List
        height={600}
        itemCount={services.length}
        itemSize={80}
        itemData={itemData}
        overscanCount={5}
      >
        {ServiceRow}
      </List>
    </div>
  );
});

VirtualizedServicesTable.displayName = 'VirtualizedServicesTable';

export default VirtualizedServicesTable;