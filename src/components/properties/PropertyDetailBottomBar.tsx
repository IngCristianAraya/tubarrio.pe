"use client";
import { useState } from 'react';
import { Property } from '@/types/property';

interface Props {
  property: Property;
}

export default function PropertyDetailBottomBar({ property }: Props) {
  const [copied, setCopied] = useState(false);

  const whatsappNumber = property.contact?.whatsapp || '+51 910 816 041';
  const whatsappDigits = whatsappNumber.replace(/\D/g, '');
  const telDigits = (property.contact?.phone || whatsappNumber).replace(/\D/g, '');

  const openWhatsApp = () => {
    const text = `Hola, me interesa el inmueble: ${property.title}`;
    const url = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const goToGallery = () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToMap = () => {
    document.getElementById('sector-map')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const share = async () => {
    const shareData = {
      title: property.title,
      text: `Mira este inmueble: ${property.title}`,
      url: typeof window !== 'undefined' ? window.location.href : ''
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && shareData.url) {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Silencioso
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
        <div className="relative flex-1">
          {/* Efecto de destello inspirado en el botón flotante */}
          <span className="pointer-events-none absolute inset-0 rounded-lg bg-green-400/40 animate-ping" aria-hidden="true"></span>
          <button
            onClick={openWhatsApp}
            className="relative w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-3 rounded-lg shadow-md"
            aria-label="Contactar por WhatsApp"
          >
            💬 Contactar
          </button>
        </div>

        <button
          onClick={goToGallery}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium py-2 px-3 rounded-lg"
          aria-label="Ver imágenes"
        >
          🖼️ Imágenes
        </button>

        <button
          onClick={goToMap}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium py-2 px-3 rounded-lg"
          aria-label="Ver zona en mapa"
        >
          🗺️ Mapa
        </button>

        <button
          onClick={share}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium py-2 px-3 rounded-lg"
          aria-label="Compartir inmueble"
        >
          {copied ? '✅ Copiado' : '🔗 Compartir'}
        </button>

        <a
          href={`tel:${telDigits}`}
          className="hidden sm:inline-flex flex-1 items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium py-2 px-3 rounded-lg"
          aria-label="Llamar"
        >
          ☎️ Llamar
        </a>
      </div>
    </div>
  );
}
