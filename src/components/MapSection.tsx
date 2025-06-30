'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { FeatureCollection, Polygon } from 'geojson'

// 🔐 Token de Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoia3VwcmFoIiwiYSI6ImNtY2N2MmNkejBiczIybXEydnF4anpxbGsifQ.PJ9OqAF_AenVETL-ZxtKqQ'

const geojsonZona: FeatureCollection<Polygon> = {
  type: 'FeatureCollection',
  features: [
    {
      id: 1, // Necesario para feature-state interactivity
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-77.07907987387742, -12.06024728207376],
            [-77.07848823175297, -12.063091969971666],
            [-77.07804450016012, -12.065189305278182],
            [-77.07769937558767, -12.068130368526496],
            [-77.07725564399432, -12.068395544774617],
            [-77.07488907549751, -12.067816978077445],
            [-77.06740403132001, -12.06765827319991],
            [-77.06635962211519, -12.061552109780749],
            [-77.06733725415707, -12.059549142608333],
            [-77.06732308943505, -12.0588288313632],
            [-77.06703271263005, -12.057963070096804],
            [-77.06708228915795, -12.057609838696393],
            [-77.07907987387742, -12.06024728207376]
          ]
        ]
      }
    }
  ]
}

export default function MapSection() {
  const mapContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Verificar que estamos en el navegador y que el contenedor existe
    if (typeof window === 'undefined' || !mapContainer.current) return

    // Calcular centroide simple (promedio de lat/lng del polígono)
    const coords = geojsonZona.features[0].geometry.coordinates[0]
    const lng = coords.reduce((sum, c) => sum + c[0], 0) / coords.length
    const lat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: 15
    })

    // Crear un elemento de estilo para personalizar los controles del mapa
    const style = document.createElement('style')
    style.textContent = `
      .mapboxgl-ctrl-logo { display: none !important; }
      .mapboxgl-ctrl-attrib { display: none !important; }
      .mapboxgl-ctrl-bottom-left { display: none !important; }
      .mapboxgl-ctrl-bottom-right { display: none !important; }
    `
    document.head.appendChild(style)

    map.on('load', () => {
      map.addSource('zona', {
        type: 'geojson',
        data: geojsonZona
      })

      // Capa de gradiente (más oscuro)
      map.addLayer({
        id: 'zona-fill-dark',
        type: 'fill',
        source: 'zona',
        paint: {
          'fill-color': '#2563eb', // azul oscuro
          'fill-opacity': 0.18
        }
      })

      // Capa de gradiente (más claro)
      map.addLayer({
        id: 'zona-fill',
        type: 'fill',
        source: 'zona',
        paint: {
          'fill-color': '#38bdf8', // azul claro
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.55,
            0.33
          ]
        }
      })

      map.addLayer({
        id: 'zona-outline',
        type: 'line',
        source: 'zona',
        paint: {
          'line-color': '#fb923c', // naranja
          'line-width': 2
        }
      })

      // Interactividad: hover
      let hoveredId: number | null = null
      map.on('mousemove', 'zona-fill', (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0]
          const featureId = feature.id as number | undefined
          if (hoveredId !== null && typeof hoveredId !== 'undefined') {
            map.setFeatureState(
              { source: 'zona', id: hoveredId },
              { hover: false }
            )
          }
          if (typeof featureId !== 'undefined') {
            hoveredId = featureId
            map.setFeatureState(
              { source: 'zona', id: hoveredId },
              { hover: true }
            )
          }
          map.getCanvas().style.cursor = 'pointer'
        }
      })
      map.on('mouseleave', 'zona-fill', () => {
        if (hoveredId !== null && typeof hoveredId !== 'undefined') {
          map.setFeatureState(
            { source: 'zona', id: hoveredId },
            { hover: false }
          )
        }
        map.getCanvas().style.cursor = ''
      })

      // Añadir controles de navegación
      map.addControl(new mapboxgl.NavigationControl({
        showCompass: false
      }), 'top-right')

      // Añadir marcador en el centro
      new mapboxgl.Marker({
        color: '#f97316', // naranja
        scale: 0.8
      })
        .setLngLat([lng, lat])
        .addTo(map)
    })

    return () => {
      map.remove()
      document.head.removeChild(style)
    }
  }, [])

  return (
    <section id="cobertura" className="w-full py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 text-gray-900">
            🗺️ <span className="text-gray-800">Zona de</span> <span className="text-orange-500">Cobertura</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Nuestro mapa muestra el área donde Revista Pando ofrece sus servicios y cobertura.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-16 items-center relative">
          {/* Columna izquierda: info */}
          <div className="flex flex-col gap-4 items-stretch w-full">
            {/* Card 1 */}
            <div className="flex items-center w-full bg-orange-50 border-l-4 border-orange-400 rounded-xl shadow-sm p-4 gap-3 hover:shadow-md hover:-translate-y-1 transition-all">
              <span className="text-orange-500 text-2xl">📍</span>
              <div>
                <div className="font-semibold text-gray-800">Cobertura local</div>
                <div className="text-gray-500 text-sm">Revista Pando llega a Pando y zonas aledañas, conectando a la comunidad.</div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="flex items-center w-full bg-blue-50 border-l-4 border-blue-400 rounded-xl shadow-sm p-4 gap-3 hover:shadow-md hover:-translate-y-1 transition-all">
              <span className="text-blue-500 text-2xl">🏘️</span>
              <div>
                <div className="font-semibold text-gray-800">+20 barrios y urbanizaciones</div>
                <div className="text-gray-500 text-sm">Incluye barrios tradicionales, urbanizaciones y zonas emergentes de Lima Este.</div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="flex items-center w-full bg-green-50 border-l-4 border-green-400 rounded-xl shadow-sm p-4 gap-3 hover:shadow-md hover:-translate-y-1 transition-all">
              <span className="text-green-500 text-2xl">🌐</span>
              <div>
                <div className="font-semibold text-gray-800">Miles de lectores y negocios</div>
                <div className="text-gray-500 text-sm">Una red activa de emprendedores, vecinos y comercios conectados cada mes.</div>
              </div>
            </div>
            {/* Card 4 */}
            <div className="flex items-center w-full bg-yellow-50 border-l-4 border-yellow-400 rounded-xl shadow-sm p-4 gap-3 hover:shadow-md hover:-translate-y-1 transition-all">
              <span className="text-yellow-500 text-2xl">📣</span>
              <div>
                <div className="font-semibold text-gray-800">Promoción local</div>
                <div className="text-gray-500 text-sm">Difusión de negocios, eventos, cultura y oportunidades de la zona.</div>
              </div>
            </div>
          </div>
          
          {/* Separador vertical */}
          <div className="hidden md:block absolute left-1/2 top-0 h-full w-0 pointer-events-none" aria-hidden="true">
            <div className="mx-auto h-full w-[2px] bg-gray-200 opacity-70 rounded-full" />
          </div>
          
          {/* Columna derecha: mapa */}
          <div className="flex flex-col w-full items-end justify-end">
            <div ref={mapContainer} className="w-full min-h-[260px] h-[340px] md:h-[420px] lg:h-[500px] rounded-xl border border-orange-400 shadow-xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
