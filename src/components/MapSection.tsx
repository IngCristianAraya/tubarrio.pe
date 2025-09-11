'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useCallback, useRef } from 'react';
import L from 'leaflet';
import { Feature, FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import useMapInitializer from '@/hooks/useMapInitializer';

// Type for our custom feature properties
interface ZoneFeatureProperties {
  name: string;
  description?: string;
  [key: string]: any;
}

type ZoneFeature = Feature<Geometry, ZoneFeatureProperties>;

// Types for dynamic imports
type MapContainerType = typeof import('react-leaflet').MapContainer;
type TileLayerType = typeof import('react-leaflet').TileLayer;
type GeoJSONType = typeof import('react-leaflet').GeoJSON;
type MarkerType = typeof import('react-leaflet').Marker;
type PopupType = typeof import('react-leaflet').Popup;

// Import Leaflet components dynamically to avoid SSR issues
const MapContainer = dynamic<React.ComponentProps<MapContainerType>>(
  () => import('react-leaflet').then((mod) => mod.MapContainer) as any,
  { ssr: false }
);

const TileLayer = dynamic<React.ComponentProps<TileLayerType>>(
  () => import('react-leaflet').then((mod) => mod.TileLayer) as any,
  { ssr: false }
);

const GeoJSON = dynamic<React.ComponentProps<GeoJSONType>>(
  () => import('react-leaflet').then((mod) => mod.GeoJSON) as any,
  { ssr: false }
);

const Marker = dynamic<React.ComponentProps<MarkerType>>(
  () => import('react-leaflet').then((mod) => mod.Marker) as any,
  { ssr: false }
);

const Popup = dynamic<React.ComponentProps<PopupType>>(
  () => import('react-leaflet').then((mod) => mod.Popup) as any,
  { ssr: false }
);

interface MapSectionProps {
  className?: string;
  showTitle?: boolean;
  interactive?: boolean;
  zoom?: number;
  height?: string | number;
  showInfoPanels?: boolean;
  onError?: (error: Error) => void;
}

// GeoJSON for the coverage zone
const geojsonZona: FeatureCollection<Geometry, ZoneFeatureProperties> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Zona TuBarrio.pe" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-77.07924098145335, -12.060280297694788],
          [-77.07815740403814, -12.064717591578372],
          [-77.07775106250728, -12.06858084733679],
          [-77.07504211896946, -12.067896503232333],
          [-77.06756994971076, -12.06765367103371],
          [-77.066554095884, -12.061450337539029],
          [-77.06745707706342, -12.059419321719218],
          [-77.06709588459137, -12.05756490253711],
          [-77.07924098145335, -12.060280297694788]
        ]]
      }
    }
  ]
};

const defaultCenter: [number, number] = [
  -12.062,
  -77.072,
];
const defaultZoom = 15;

const MapSection = ({
  className = "",
  showTitle = true,
  interactive = true,
  zoom = 15,
  height = '500px',
  showInfoPanels = true,
  onError
}: MapSectionProps) => {
  const [isClient, setIsClient] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize map and handle client-side only code
  useMapInitializer();
  
  // Set client-side flag after mount and handle map initialization
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    setIsClient(true);
    
    // Error handler for the component
    const handleError = (error: unknown) => {
      console.error('Map error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar el mapa';
      setMapError(`Error: ${errorMessage}. Por favor, recarga la página.`);
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    };
    
    // Global error handler
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.filename?.includes('leaflet') || event.message?.includes('leaflet')) {
        handleError(event.error || new Error(event.message));
      }
    };
    
    // Add event listeners
    window.addEventListener('error', handleGlobalError);
    
    // Cleanup function
    return () => {
      window.removeEventListener('error', handleGlobalError);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onError]);
  
  // Handle map container reference
  const handleMapContainer = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    
    try {
      // Initialize the map if it doesn't exist
      if (!mapRef.current) {
        const map = L.map(node, {
          center: defaultCenter,
          zoom: zoom,
          zoomControl: interactive,
          dragging: interactive,
          scrollWheelZoom: interactive,
          touchZoom: interactive,
          doubleClickZoom: interactive,
          boxZoom: interactive,
          keyboard: interactive
        });
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 10,
        }).addTo(map);
        
        // Add GeoJSON layer
        const geoJsonLayer = L.geoJSON(geojsonZona as any, {
          style: {
            color: "#0ea5e9",
            weight: 3,
            fillColor: "#38bdf8",
            fillOpacity: 0.4,
            dashArray: "8, 4"
          }
        }).addTo(map);
        
        // Add marker
        L.marker(defaultCenter)
          .addTo(map)
          .bindPopup('Aquí está el centro de cobertura 🚀')
          .openPopup();
        
        mapRef.current = map;
      }
      
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Error al inicializar el mapa. Por favor, recarga la página.');
      if (onError) {
        onError(error instanceof Error ? error : new Error('Map initialization error'));
      }
    }
  }, [zoom, interactive, onError]);
  
  // Don't render the map during SSR
  if (!isClient) {
    return (
      <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center rounded-xl">
        <div className="animate-pulse text-gray-500">Cargando mapa...</div>
      </div>
    );
  }
  
  // Show error message if map failed to load
  if (mapError) {
    return (
      <div className="w-full h-[500px] bg-red-50 border border-red-200 rounded-xl flex flex-col items-center justify-center p-6 text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar el mapa</h3>
        <p className="text-gray-600 mb-4">{mapError}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Recargar página
        </button>
      </div>
    );
  }
  
  // Map container styles
  const containerStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    minHeight: '300px',
    width: '100%',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    zIndex: 1
  };

  return (
    <section className={`w-full ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid ${showInfoPanels ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-8 md:gap-x-16 items-center relative`}>
          {/* Left column: info */}
          {showInfoPanels && (
            <div className="flex flex-col gap-4 items-stretch w-full">
              <div className="flex items-center w-full bg-orange-50 border-l-4 border-orange-400 rounded-xl shadow-sm p-4 gap-3">
                <span className="text-orange-500 text-2xl">📍</span>
                <div>
                  <div className="font-semibold text-gray-800">Cobertura local</div>
                  <div className="text-gray-500 text-sm">
                    TuBarrio.pe llega a Pando y zonas aledañas, conectando a la
                    comunidad.
                  </div>
                </div>
              </div>

              <div className="flex items-center w-full bg-blue-50 border-l-4 border-blue-400 rounded-xl shadow-sm p-4 gap-3">
                <span className="text-blue-500 text-2xl">🏘️</span>
                <div>
                  <div className="font-semibold text-gray-800">
                    +20 barrios y urbanizaciones
                  </div>
                  <div className="text-gray-500 text-sm">
                    Incluye barrios tradicionales, urbanizaciones y zonas
                    emergentes de Lima Este.
                  </div>
                </div>
              </div>

              <div className="flex items-center w-full bg-green-50 border-l-4 border-green-400 rounded-xl shadow-sm p-4 gap-3">
                <span className="text-green-500 text-2xl">🌐</span>
                <div>
                  <div className="font-semibold text-gray-800">
                    Miles de lectores y negocios
                  </div>
                  <div className="text-gray-500 text-sm">
                    Comunidad en crecimiento de usuarios y emprendedores locales.
                  </div>
                </div>
              </div>

              <div className="flex items-center w-full bg-yellow-50 border-l-4 border-yellow-400 rounded-xl shadow-sm p-4 gap-3">
                <span className="text-yellow-500 text-2xl">📣</span>
                <div>
                  <div className="font-semibold text-gray-800">
                    Promoción local
                  </div>
                  <div className="text-gray-500 text-sm">
                    Difusión de negocios, eventos, cultura y oportunidades de la
                    zona.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Separador vertical */}
          {showInfoPanels && (
            <div
              className="hidden md:block absolute left-1/2 top-0 h-full w-0 pointer-events-none"
              aria-hidden="true"
            >
              <div className="mx-auto h-full w-[2px] bg-gray-200 opacity-70 rounded-full" />
            </div>
          )}

          {/* Right column: Map */}
          <div 
            ref={handleMapContainer}
            className={`w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 ${!interactive ? 'pointer-events-none' : ''}`}
            style={containerStyle}
          >
            {/* Map will be initialized here by Leaflet */}
            {!isClient && (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="animate-pulse text-gray-500">Cargando mapa...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
