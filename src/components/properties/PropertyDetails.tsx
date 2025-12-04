"use client";
import Image from 'next/image';
import { useState } from 'react';
import PropertyImageCarousel from '@/components/properties/PropertyImageCarousel';
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
  const images = Array.isArray(property.images) ? property.images : [];
  const whatsappNumber = property.contact?.whatsapp || '+51 910 816 041';
  const whatsappDigits = whatsappNumber.replace(/\D/g, '');
  // Ancla para scroll desde la barra inferior: movemos "gallery" al carrusel superior

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Carrusel de imágenes */}
      <div id="gallery" className="relative">
        <PropertyImageCarousel images={images} title={property.title} />
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

        {/* Descripción */}
        {property.description && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h2>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>
        )}

        {/* Mapa del sector aproximado (sin pestañas) */}
        <div id="sector-map" className="mt-6">
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

        {/* Mapa directo sin pestañas */}

        {/* Contacto */}
        <div className="mt-6">
          <a
            href={`https://wa.me/${whatsappDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg"
          >
            💬 Contactar por WhatsApp
          </a>
        </div>
      </div>

      {/* Botón flotante removido: el efecto de destello se traslada a la barra inferior */}
    </div>
  );
}
