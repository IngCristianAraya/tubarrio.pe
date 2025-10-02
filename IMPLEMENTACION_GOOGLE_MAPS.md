# Implementación de Google Maps Embed API

## Objetivo
Reemplazar la sección "Cotización Personalizada" con un mapa interactivo que muestre la ubicación exacta de cada emprendimiento/servicio, incluyendo funcionalidad "Cómo llegar".

## Análisis de la Situación Actual

### Problemas identificados:
- Sección "Cotización Personalizada" considerada innecesaria
- Anteriormente se usó Mapbox pero generó problemas de dependencias
- Se cambió a Leaflet pero se busca una solución más simple
- Necesidad de mostrar ubicación exacta de cada servicio

### Solución elegida: Google Maps Embed API
- **Ventajas**: Sin JavaScript complejo, gratuito, sin problemas de dependencias
- **Implementación**: Simple iframe
- **Funcionalidades**: Incluye automáticamente "Cómo llegar", zoom, vista satelital

## Plan de Implementación

### Fase 1: Preparación de Datos
1. **Actualizar el tipo Service** (`src/types/service.ts`)
   - Agregar campos opcionales para ubicación:
     ```typescript
     coordenadas?: {
       lat: number;
       lng: number;
     };
     direccion_completa?: string;
     ```

2. **Actualizar base de datos Firebase**
   - Crear script para agregar coordenadas a servicios existentes
   - Campos a agregar:
     - `coordenadas: { lat: number, lng: number }`
     - `direccion_completa: string`

### Fase 2: Configuración de Google Maps
1. **Obtener API Key (Opcional pero recomendado)**
   - Ir a [Google Cloud Console](https://console.cloud.google.com/)
   - Habilitar Maps Embed API
   - Crear API Key
   - Configurar restricciones de dominio

2. **Configurar variables de entorno**
   - Agregar `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` en `.env.local`

### Fase 3: Desarrollo del Componente
1. **Crear componente ServiceMap** (`src/components/service/ServiceMap.tsx`)
   ```typescript
   interface ServiceMapProps {
     service: Service;
     height?: string;
     className?: string;
   }
   ```

2. **Funcionalidades del componente:**
   - Mostrar mapa con ubicación del servicio
   - Fallback a dirección de texto si no hay coordenadas
   - Responsive design
   - Loading state
   - Error handling

### Fase 4: Integración
1. **Localizar sección "Cotización Personalizada"**
   - Buscar en componentes de servicio
   - Identificar archivo específico a modificar

2. **Reemplazar sección existente**
   - Mantener el diseño general
   - Integrar ServiceMap component
   - Ajustar estilos para consistencia

### Fase 5: Actualización de Datos
1. **Script para agregar coordenadas**
   - Crear `add-coordinates-to-services.js`
   - Usar geocoding para obtener coordenadas de direcciones existentes
   - Actualizar todos los servicios en Firebase

2. **Datos de ejemplo por categoría:**
   - Restaurantes: Coordenadas de zonas comerciales
   - Panaderías: Ubicaciones residenciales
   - Salud: Centros médicos
   - Servicios profesionales: Oficinas

## Estructura de Archivos a Crear/Modificar

```
src/
├── components/service/
│   └── ServiceMap.tsx (NUEVO)
├── types/
│   └── service.ts (MODIFICAR)
└── [archivo-seccion-cotizacion] (MODIFICAR)

scripts/
└── add-coordinates-to-services.js (NUEVO)

.env.local (MODIFICAR)
```

## Implementación Técnica Detallada

### 1. Componente ServiceMap.tsx
```typescript
import React from 'react';
import { Service } from '@/types/service';

interface ServiceMapProps {
  service: Service;
  height?: string;
  className?: string;
}

const ServiceMap: React.FC<ServiceMapProps> = ({ 
  service, 
  height = "300px", 
  className = "" 
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  // Construir URL del mapa
  const getMapUrl = () => {
    const baseUrl = "https://www.google.com/maps/embed/v1/place";
    
    if (service.coordenadas) {
      const { lat, lng } = service.coordenadas;
      return `${baseUrl}?key=${apiKey}&q=${lat},${lng}&zoom=16`;
    }
    
    if (service.direccion_completa || service.direccion) {
      const address = encodeURIComponent(
        service.direccion_completa || service.direccion || ''
      );
      return `${baseUrl}?key=${apiKey}&q=${address}&zoom=16`;
    }
    
    return null;
  };

  const mapUrl = getMapUrl();

  if (!mapUrl) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500">Ubicación no disponible</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden shadow-lg ${className}`}>
      <iframe
        width="100%"
        height={height}
        frameBorder="0"
        src={mapUrl}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Ubicación de ${service.nombre}`}
      />
    </div>
  );
};

export default ServiceMap;
```

### 2. Script de Coordenadas
```javascript
// add-coordinates-to-services.js
const admin = require('firebase-admin');

// Coordenadas de ejemplo por zona de Lima
const coordinatesByZone = {
  miraflores: { lat: -12.1211, lng: -77.0282 },
  sanisidro: { lat: -12.0931, lng: -77.0465 },
  barranco: { lat: -12.1404, lng: -77.0200 },
  surco: { lat: -12.1348, lng: -76.9947 },
  // ... más zonas
};

// Coordenadas por categoría
const coordinatesByCategory = {
  restaurantes: [
    { lat: -12.1211, lng: -77.0282, zona: "Miraflores" },
    { lat: -12.0931, lng: -77.0465, zona: "San Isidro" },
    // ...
  ],
  salud: [
    { lat: -12.1150, lng: -77.0300, zona: "Clínica Miraflores" },
    // ...
  ]
};
```

### 3. Actualización de Tipos
```typescript
// src/types/service.ts
export interface Service {
  // ... campos existentes
  coordenadas?: {
    lat: number;
    lng: number;
  };
  direccion_completa?: string;
  zona?: string; // Opcional: para agrupar por zonas
}
```

## Consideraciones de Rendimiento

1. **Lazy Loading**: El iframe se carga solo cuando es visible
2. **Fallbacks**: Múltiples opciones de ubicación (coordenadas → dirección → zona)
3. **Error Handling**: Manejo de servicios sin ubicación
4. **Responsive**: Adaptable a diferentes tamaños de pantalla

## Consideraciones de UX

1. **Información clara**: Título descriptivo del mapa
2. **Accesibilidad**: Atributos alt y title apropiados
3. **Consistencia**: Mantener el diseño general de la página
4. **Funcionalidad móvil**: Optimizado para dispositivos móviles

## Testing

1. **Casos de prueba:**
   - Servicio con coordenadas exactas
   - Servicio solo con dirección
   - Servicio sin ubicación
   - Diferentes tamaños de pantalla
   - Carga lenta de red

2. **Validaciones:**
   - API Key válida
   - URLs correctamente formateadas
   - Fallbacks funcionando
   - Responsive design

## Cronograma Estimado

- **Día 1**: Preparación de datos y configuración
- **Día 2**: Desarrollo del componente ServiceMap
- **Día 3**: Integración y reemplazo de sección existente
- **Día 4**: Actualización masiva de datos en Firebase
- **Día 5**: Testing y ajustes finales

## Próximos Pasos

1. ✅ Crear esta documentación
2. 🔄 Commit y push de la documentación
3. ⏳ Implementar componente ServiceMap
4. ⏳ Localizar y reemplazar sección "Cotización Personalizada"
5. ⏳ Crear script de actualización de coordenadas
6. ⏳ Ejecutar actualización masiva de datos
7. ⏳ Testing y refinamiento

---

**Fecha de creación**: $(date)
**Última actualización**: $(date)
**Estado**: Planificación completada, listo para implementación