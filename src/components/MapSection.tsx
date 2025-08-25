'use client';

import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { FeatureCollection } from "geojson";

interface MapSectionProps {
  className?: string;
}

// 🔧 Fix: iconos por defecto de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// GeoJSON de la zona de cobertura
const geojsonZona: FeatureCollection = {
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

const MapSection = ({ className = "" }: MapSectionProps) => {
  useEffect(() => {
    // Asegurar que los iconos de Leaflet se configuren correctamente
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <section id="cobertura" className={`w-full py-8 md:py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 text-gray-900">
            🗺️ <span className="text-gray-800">Zona de</span>{" "}
            <span className="text-orange-500">Cobertura</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Nuestro mapa muestra el área donde TuBarrio.pe ofrece sus servicios
            y cobertura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-16 items-center relative">
          {/* Columna izquierda: info */}
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
                  Una red activa de emprendedores, vecinos y comercios
                  conectados cada mes.
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

          {/* Separador vertical */}
          <div
            className="hidden md:block absolute left-1/2 top-0 h-full w-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="mx-auto h-full w-[2px] bg-gray-200 opacity-70 rounded-full" />
          </div>

          {/* Columna derecha: mapa */}
          <div className="flex flex-col w-full items-end justify-end">
            <MapContainer
              center={defaultCenter}
              zoom={defaultZoom}
              scrollWheelZoom={false}
              zoomControl={true}
              doubleClickZoom={true}
              closePopupOnClick={true}
              dragging={true}
              zoomSnap={1}
              zoomDelta={1}
              trackResize={true}
              touchZoom={true}
              className="w-full min-h-[260px] h-[340px] md:h-[420px] lg:h-[500px] rounded-xl border border-orange-400 shadow-xl"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                maxZoom={19}
                minZoom={10}
                crossOrigin="anonymous"
              />
              <GeoJSON
                data={geojsonZona}
                style={{
                  color: "#0ea5e9",
                  weight: 3,
                  fillColor: "#38bdf8",
                  fillOpacity: 0.4,
                  dashArray: "8, 4"
                }}
              />
              <Marker position={defaultCenter}>
                <Popup>Aquí está el centro de cobertura 🚀</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
