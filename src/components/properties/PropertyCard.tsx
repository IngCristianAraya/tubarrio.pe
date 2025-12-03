import Image from 'next/image';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
  onViewDetails?: (property: Property) => void;
}

export default function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  const formatPrice = (price: number, currency: string = 'PEN') => {
    try {
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
      }).format(price);
    } catch {
      // Fallback por si la moneda no es soportada
      const symbol = currency === 'USD' ? 'US$' : currency === 'PEN' ? 'S/' : '';
      return `${symbol} ${price.toLocaleString('es-PE')}`;
    }
  };

  const getPropertyTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      apartment: 'Departamento',
      house: 'Casa',
      office: 'Oficina',
      commercial: 'Local Comercial',
      land: 'Terreno',
      warehouse: 'Almacén'
    };
    return typeLabels[type] || type;
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(property);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagen */}
      <div className="relative h-48 bg-gray-200">
        {property.images && property.images.length > 0 ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-4xl">🏠</span>
          </div>
        )}

        {/* Badge de tipo */}
        <div className="absolute top-3 left-3">
          <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {getPropertyTypeLabel(property.type)}
          </span>
        </div>

        {/* Badge de operación */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${property.priceType === 'sale'
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white'
            }`}>
            {property.priceType === 'sale' ? 'Venta' : 'Alquiler'}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>

        <p className="text-lg font-bold text-orange-600 mb-2">
          {formatPrice(property.price, property.currency || 'PEN')}
          {property.priceType === 'rent' && (
            <span className="text-sm font-normal text-gray-500"> /mes</span>
          )}
        </p>

        <p className="text-sm text-gray-600 mb-2">
          📍 {property.district}, {property.neighborhood}
        </p>

        {/* Características */}
        <div className="flex flex-wrap gap-2 mb-3">
          {property.features.bedrooms && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              🛏️ {property.features.bedrooms} dorm.
            </span>
          )}
          {property.features.bathrooms && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              🚿 {property.features.bathrooms} baños
            </span>
          )}
          {property.features.area && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              📐 {property.features.area}m²
            </span>
          )}
          {property.features.parking && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              🚗 Estacionamiento
            </span>
          )}
        </div>

        {/* Botón de contacto */}
        <button
          onClick={handleViewDetails}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
}
