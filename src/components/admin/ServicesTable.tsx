'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  phone: string;
  whatsapp: string;
  address: string;
  image: string;
  images?: string[];
  active: boolean;
  createdAt?: any;
}

interface ServicesTableProps {
  services: Service[];
  onToggleStatus: (serviceId: string, currentStatus: boolean) => void;
  onDelete: (serviceId: string) => void;
}

const ServicesTable = memo(function ServicesTable({
  services,
  onToggleStatus,
  onDelete
}: ServicesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Servicio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoría
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contacto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {services.map((service) => (
            <tr key={service.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {(service.images && service.images.length > 0 ? service.images[0] : service.image) ? (
                      <Image
                        src={service.images && service.images.length > 0 ? service.images[0] : service.image}
                        alt={service.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">🏪</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {service.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {service.description}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {service.category || 'Sin categoría'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>
                  {service.phone && (
                    <div>📞 {service.phone}</div>
                  )}
                  {service.whatsapp && (
                    <div>💬 {service.whatsapp}</div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
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
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default ServicesTable;