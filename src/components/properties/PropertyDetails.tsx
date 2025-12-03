"use client";
import Image from 'next/image';
import { useState } from 'react';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Property } from '@/types/property';

interface PropertyDetailsProps {
  property: Property;
}

const formatPrice = (price: number, currency: string = 'PEN') => {
  try {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  } catch {
    const symbol = currency === 'USD' ? 'US$' : currency === 'PEN' ? 'S/' : '';
    return `${symbol} ${price.toLocaleString('es-PE')}`;
  }
};

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const images = Array.isArray(property.images) ? property.images : [];
  const activeImage = images[activeIndex];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Hero imagen / imagen activa */}
      <div className="relative h-72 md:h-96 bg-gray-100">
        {activeImage ? (
          <Image src={activeImage} alt={property.title} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-5xl">🏠</div>
        )}
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">{property.type}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${property.priceType === 'sale' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
            }`}>
            {property.priceType === "sale" ? "Venta" : "Alquiler"}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h1>
        <p className="text-lg font-bold text-orange-600">
          {formatPrice(property.price, property.currency || 'PEN')}
          {property.priceType === 'rent' && (
            <span className="text-sm font-normal text-gray-500"> /mes</span>
          )}
        </p>

        {/* Ubicación */}
        <p className="text-gray-700">
          📍 {property.district}{property.neighborhood ? `, ${property.neighborhood}` : ''}
        </p>
        {property.reference && (
          <p className="text-sm text-gray-600">Referencia: {property.reference}</p>
        )}

        {/* Características */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {property.features?.bedrooms !== undefined && (
            <div className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded">🛏️ {property.features.bedrooms} dormitorios</div>
          )}
          {property.features?.bathrooms !== undefined && (
            <div className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded">🚿 {property.features.bathrooms} baños</div>
          )}
          {property.features?.area !== undefined && (
            <div className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded">📐 {property.features.area} m²</div>
          )}
          {property.features?.parking ? (
            <div className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded">🚗 Estacionamiento</div>
          ) : null}
          {property.features?.balcony ? (
            <div className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded">🪟 Balcón</div>
          ) : null}
          {property.pool ? (
            <div className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded">🏊 Piscina</div>
          ) : null}
        </div>

        {/* Galería (miniaturas) */}
        {images.length > 1 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Galería</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img + idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-28 h-20 flex-shrink-0 rounded overflow-hidden border ${activeIndex === idx ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  aria-label={`Ver imagen ${idx + 1}`}
                >
                  <Image src={img} alt={`Imagen ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Descripción */}
        {property.description && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h2>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>
        )}

        {/* Mapa del sector aproximado (sin ubicación exacta) */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Zona aproximada</h2>
          <p className="text-sm text-gray-600 mb-2">
            Mostramos el sector aproximado (distrito/barrio), no la ubicación exacta.
          </p>
          <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200">
            <iframe
              title="Mapa del sector"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${property.neighborhood ? property.neighborhood + ', ' : ''}${property.district}, Lima`)}&output=embed`}
            />
          </div>
        </div>

        {/* Contacto */}
        {property.contact?.whatsapp && (
          <div className="mt-6">
            <a
              href={`https://wa.me/${property.contact.whatsapp.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg"
            >
              💬 Contactar por WhatsApp
            </a>
          </div>
        )}
      </div>

      {/* Botón flotante de WhatsApp (opcional) */}
      {property.contact?.whatsapp && (
        <WhatsAppButton phoneNumber={property.contact.whatsapp} message={`Hola, me interesa el inmueble: ${property.title}`} />
      )}
    </div>
  );
}
