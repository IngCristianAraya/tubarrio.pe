"use client";

import React, { useEffect, useRef, useState } from 'react';
import type { Service } from '@/types/service';

interface ServiceMapProps {
  service: Service;
  height?: number;
  zoom?: number;
}

// Carga Leaflet desde CDN sin añadir dependencias al proyecto
function ensureLeafletAssets() {
  if (typeof window === 'undefined') return;
  const cssId = 'leaflet-css-cdn';
  const jsId = 'leaflet-js-cdn';
  const styleId = 'leaflet-custom-marker-style';
  if (!document.getElementById(cssId)) {
    const link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    // Omitimos SRI integrity para evitar bloqueos si el hash no coincide
    link.crossOrigin = '';
    document.head.appendChild(link);
  }
  if (!document.getElementById(jsId)) {
    const script = document.createElement('script');
    script.id = jsId;
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.crossOrigin = '';
    script.defer = true;
    script.addEventListener('error', () => {
      console.error('[ServiceMap] Error cargando Leaflet desde CDN');
    });
    document.body.appendChild(script);
  }
  // Estilo inline para fondo blanco del marcador personalizado
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .leaflet-marker-icon.tb-orange-marker {
        background-color: #ffffff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        border: 2px solid #f97316; /* naranja TuBarrio */
        padding: 3px;
        box-sizing: border-box;
      }
    `;
    document.head.appendChild(style);
  }
}

export default function ServiceMap({ service, height = 320, zoom = 16 }: ServiceMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  const lat = typeof service.latitude === 'number' ? service.latitude : null;
  const lon = typeof service.longitude === 'number' ? service.longitude : null;

  useEffect(() => {
    ensureLeafletAssets();
    const check = () => {
      // @ts-ignore
      if (typeof window !== 'undefined' && (window as any).L) {
        setReady(true);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current || lat == null || lon == null) return;
    // @ts-ignore
    const L = (window as any).L;

    // Usar icono personalizado naranja (casa/mascota) si está disponible
    // Colocado en /public/images/leaflet/casa_frontal.png
    const customIconUrl = '/images/leaflet/casa_frontal.png';
    const icon = L.icon({
      iconUrl: customIconUrl,
      // Tamaño y anclas ajustados para que la punta esté en la coordenada
      iconSize: [52, 52],
      iconAnchor: [26, 52],
      popupAnchor: [0, -50],
      className: 'tb-orange-marker',
    });

    const map = L.map(mapRef.current).setView([lat, lon], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const popupText = service.address || service.name || 'Ubicación';
    L.marker([lat, lon], { icon }).addTo(map).bindPopup(popupText);

    return () => {
      map.remove();
    };
  }, [ready, lat, lon, zoom, service.address, service.name]);

  if (lat == null || lon == null) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-600">Este servicio aún no tiene coordenadas geográficas.</p>
        <p className="text-xs text-gray-500 mt-1">Puedes agregarlas desde el panel admin externo usando Nominatim.</p>
      </div>
    );
  }

  const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;

  return (
    <div className="space-y-2">
      <div ref={mapRef} style={{ width: '100%', height }} className="rounded-xl overflow-hidden border border-gray-200" />
      <div className="flex justify-end">
        <a
          href={osmLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Ver en OpenStreetMap →
        </a>
      </div>
    </div>
  );
}