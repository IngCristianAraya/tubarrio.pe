'use client'

/**
 * Componente MapSection
 * 
 * @description
 * Este componente implementa un mapa interactivo utilizando Mapbox GL JS para mostrar la cobertura geográfica
 * de los servicios ofrecidos. El componente permite visualizar áreas específicas mediante polígonos y marcadores.
 * 
 * Características principales:
 * - Muestra un mapa interactivo con zoom y desplazamiento
 * - Resalta áreas de cobertura con polígonos personalizables
 * - Incluye marcadores para ubicaciones específicas
 * - Optimizado para rendimiento con carga dinámica
 * 
 * Dependencias:
 * - mapbox-gl: Biblioteca para renderizar mapas interactivos
 * - geojson: Formato para estructuras geográficas
 * 
 * Configuración requerida:
 * - Token de acceso a la API de Mapbox (ya configurado)
 * - Coordenadas del área de cobertura en formato GeoJSON
 */

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FeatureCollection, Polygon } from 'geojson';
import style from 'styled-jsx/style';

// 🔐 Token de acceso a la API de Mapbox
// Nota: En un entorno de producción, considera usar variables de entorno para almacenar esta información sensible
mapboxgl.accessToken = 'pk.eyJ1Ijoia3VwcmFoIiwiYSI6ImNtY2N2MmNkejBiczIybXEydnF4anpxbGsifQ.PJ9OqAF_AenVETL-ZxtKqQ';

/**
 * geojsonZona
 * 
 * @description
 * Define el área de cobertura como un polígono GeoJSON.
 * 
 * Estructura:
 * - type: 'FeatureCollection' - Colección de características geográficas
 * - features: Array de características (en este caso, un solo polígono)
 *   - id: Identificador único para interactividad
 *   - type: 'Feature' - Tipo de característica
 *   - properties: Metadatos adicionales (vacío en este caso)
 *   - geometry: Define la forma geográfica
 *     - type: 'Polygon' - Tipo de geometría
 *     - coordinates: Array de coordenadas [longitud, latitud] que definen el polígono
 * 
 * Nota: Las coordenadas deben formar un polígono cerrado (el primer y último punto deben coincidir)
 */
const geojsonZona: FeatureCollection<Polygon> = {
  type: 'FeatureCollection',
  features: [
    {
      id: 1, // Identificador único para interactividad con feature-state
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            // Coordenadas del polígono que define el área de cobertura
            // Formato: [longitud, latitud]
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
            [-77.07907987387742, -12.06024728207376]  // Último punto igual al primero para cerrar el polígono
          ]
        ]
      }
    }
  ]
}

/**
 * Componente funcional MapSection
 * 
 * @description
 * Componente que renderiza un mapa interactivo de Mapbox con las siguientes características:
 * - Muestra un área de cobertura definida por un polígono GeoJSON
 * - Incluye interactividad al pasar el mouse (hover)
 * - Muestra un marcador en el centro del área de cobertura
 * - Incluye controles de navegación personalizados
 * 
 * @returns {JSX.Element} Un contenedor div que alberga el mapa interactivo
 */
export default function MapSection() {
  // Referencia al contenedor del mapa
  const mapContainer = useRef<HTMLDivElement>(null)

  /**
   * Efecto secundario que se ejecuta una vez al montar el componente
   * Inicializa el mapa de Mapbox y configura todas sus capas y eventos
   */
  useEffect(() => {
    // Verificar que estamos en el navegador y que el contenedor existe
    if (typeof window === 'undefined' || !mapContainer.current) return

    /**
     * Calcula el centroide del polígono para centrar el mapa
     * @returns {{lng: number, lat: number}} Coordenadas del centroide
     */
    const calculateCentroid = () => {
      const coords = geojsonZona.features[0].geometry.coordinates[0]
      const lng = coords.reduce((sum, c) => sum + c[0], 0) / coords.length
      const lat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length
      return { lng, lat }
    }
    
    const { lng, lat } = calculateCentroid()

    /**
     * Inicialización del mapa de Mapbox
     * @type {mapboxgl.Map}
     */
    const map = new mapboxgl.Map({
      container: mapContainer.current, // Contenedor del DOM
      style: 'mapbox://styles/mapbox/streets-v12', // Estilo del mapa
      center: [lng, lat], // Centro del mapa (centroide del polígono)
      zoom: 15 // Nivel de zoom inicial
    })

    /**
     * Estilos CSS personalizados para los controles del mapa
     * Oculta elementos por defecto de Mapbox para una mejor experiencia de usuario
     */
    const addCustomStyles = () => {
      const style: HTMLStyleElement = document.createElement('style')
      style.textContent = `
        .mapboxgl-ctrl-logo { display: none !important; }
        .mapboxgl-ctrl-attrib { display: none !important; }
        .mapboxgl-ctrl-bottom-left { display: none !important; }
        .mapboxgl-ctrl-bottom-right { display: none !important; }
      `
      document.head.appendChild(style)
      return style
    }
    
    const styleElement = addCustomStyles()

    // Evento que se dispara cuando el mapa ha terminado de cargar
    map.on('load', () => {
      /**
       * Añade la fuente de datos GeoJSON al mapa
       * @type {mapboxgl.GeoJSONSourceRaw}
       */
      map.addSource('zona', {
        type: 'geojson', // Tipo de fuente: GeoJSON
        data: geojsonZona // Datos del área de cobertura
      })

      /**
       * Capa de relleno base (fondo más oscuro)
       * Proporciona un efecto de profundidad al área de cobertura
       */
      map.addLayer({
        id: 'zona-fill-dark',
        type: 'fill',
        source: 'zona',
        paint: {
          'fill-color': '#2563eb', // Color azul oscuro
          'fill-opacity': 0.18 // Opacidad baja para el efecto de sombra
        }
      })

      /**
       * Capa de relleno interactiva (capa superior)
       * Cambia de opacidad al pasar el mouse sobre el área
       */
      map.addLayer({
        id: 'zona-fill',
        type: 'fill',
        source: 'zona',
        paint: {
          'fill-color': '#38bdf8', // Color azul claro
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false], // Verifica si el mouse está sobre el área
            0.55, // Opacidad cuando el mouse está sobre el área
            0.33  // Opacidad normal
          ]
        }
      })

      /**
       * Capa de borde para el área de cobertura
       * Añade un borde naranja alrededor del área
       */
      map.addLayer({
        id: 'zona-outline',
        type: 'line',
        source: 'zona',
        paint: {
          'line-color': '#fb923c', // Color naranja
          'line-width': 2 // Grosor de la línea
        }
      })

      /**
       * Gestiona la interacción al pasar el mouse sobre el área
       * Cambia el cursor y actualiza el estado de hover
       */
      let hoveredId: number | null = null
      
      // Evento cuando el mouse se mueve sobre el área de cobertura
      map.on('mousemove', 'zona-fill', (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0]
          const featureId = feature.id as number | undefined
          
          // Restablece el estado de hover anterior
          if (hoveredId !== null && typeof hoveredId !== 'undefined') {
            map.setFeatureState(
              { source: 'zona', id: hoveredId },
              { hover: false }
            )
          }
          
          // Aplica el estado de hover al elemento actual
          if (typeof featureId !== 'undefined') {
            hoveredId = featureId
            map.setFeatureState(
              { source: 'zona', id: hoveredId },
              { hover: true }
            )
          }
          
          // Cambia el cursor a pointer
          map.getCanvas().style.cursor = 'pointer'
        }
      })
      
      // Evento cuando el mouse sale del área de cobertura
      map.on('mouseleave', 'zona-fill', () => {
        // Restablece el estado de hover
        if (hoveredId !== null && typeof hoveredId !== 'undefined') {
          map.setFeatureState(
            { source: 'zona', id: hoveredId },
            { hover: false }
          )
        }
        hoveredId = null
        map.getCanvas().style.cursor = ''
      })

      /**
       * Añade controles de navegación al mapa
       * Se posiciona en la esquina superior derecha
       */
      map.addControl(new mapboxgl.NavigationControl({
        showCompass: false, // Oculta la brújula
        showZoom: true      // Muestra los botones de zoom
      }), 'top-right')

      /**
       * Añade un marcador en el centroide del área de cobertura
       * @type {mapboxgl.Marker}
       */
      new mapboxgl.Marker({
        color: '#f97316', // Color naranja
        scale: 0.8       // Tamaño del marcador
      })
        .setLngLat([lng, lat]) // Posición del marcador (centroide)
        .addTo(map)
    })

    return () => {
      if (map) {
        map.remove()
      }
      document.head.removeChild(styleElement)    }
  }, [])

  return (
    <section id="cobertura" className="w-full py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 text-gray-900">
            🗺️ <span className="text-gray-800">Zona de</span> <span className="text-orange-500">Cobertura</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Nuestro mapa muestra el área donde TuBarrio.pe ofrece sus servicios y cobertura.
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
                <div className="text-gray-500 text-sm">TuBarrio.pe llega a Pando y zonas aledañas, conectando a la comunidad.</div>
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
