# Checklist: Recomendación de negocios por ubicación

Estado general: Fase 1 completada (backend + UI básica). Este documento sirve para mantener el trabajo ordenado y editable.

## Hecho (✓)

- [x] API `POST /api/services/recommended` con Haversine y filtros (país, distrito, radio, tags, público objetivo, activos). Ordena por distancia y relevancia.
  - Ruta: `src/app/api/services/recommended/route.ts`
- [x] Tipos `Service` actualizados con campos de ubicación y targeting
  - `latitude`, `longitude`, `publico_objetivo`, `tags`, `distanceKm`
  - Ruta: `src/types/service.ts`
- [x] UI en catálogo: botón "Usar mi ubicación" + selector de radio (1–20 km), limpieza de recomendaciones, y fallback a filtros existentes
  - Ruta: `src/app/todos-los-servicios/TodosLosServicios.tsx`
- [x] Mostrar distancia en la tarjeta del servicio cuando esté disponible
  - Ruta: `src/components/service/ServiceCard.tsx`
- [x] Correcciones de importaciones para usar el componente correcto de catálogo
  - `src/components/ClientOnlyTodosLosServicios.tsx`
  - `src/components/HomeClient.tsx`

## Pendiente (▢)

- [ ] Geocodificar servicios sin coordenadas (admin/script) para completar `latitude/longitude`
  - Sugerencia: agregar un script dedicado o UI en panel admin. Referencias útiles: `scripts/update-service-location-data.js`, `scripts_backup_*/analyze-all-services-coordinates.js`
- [ ] Filtros de recomendación en la UI: `tags` y `publico_objetivo`
  - Agregar selectores en `TodosLosServicios` y enviarlos al endpoint
- [ ] Aviso de privacidad y manejo de errores de geolocalización
  - Tooltip/modal breve explicando el uso de la ubicación, y estados de error claros
- [ ] Hardening del endpoint: rate limit y validaciones adicionales
  - Reutilizar `src/lib/rateLimit.ts` y validar parámetros (`lat/lon`, `radiusKm`, `district`, etc.)
- [ ] Cache de recomendaciones en cliente por clave (`lat,lon,radius,tags,target`)
  - Evitar recomputar/fetch cuando los parámetros se repiten en poco tiempo
- [ ] Analytics de interacción y conversión
  - Eventos: "usar_ubicacion", cambio de radio, click en recomendación. Revisar `src/context/AnalyticsContext.tsx`
- [ ] Optimización en base de datos (SQL/PostGIS)
  - Delegar cálculo de distancia y filtros a la DB para escalar (considerar índices geoespaciales)
- [ ] Tests unitarios e integración
  - Endpoint `/api/services/recommended`, hooks de geolocalización y render del catálogo
- [ ] Corregir warning de claves duplicadas en `CategorySection`
  - Ubicación: `src/components/home/CategorySection.tsx`. Asegurar claves únicas en listas renderizadas
- [ ] Limpieza de `.npmrc` (opcional)
  - Remover entradas de `sharp_*` si no son necesarias en dev para evitar warnings

## Cómo actualizar este checklist

- Edita este archivo y marca con `[x]` las tareas completadas.
- Agrega nuevas tareas bajo "Pendiente" con una breve descripción y, si aplica, ruta de archivo.
- Mantén las tareas agrupadas (Backend, UI, Datos, Privacidad, Optimización, Tests) para una lectura rápida.

## Pruebas rápidas sugeridas

- Catálogo: `http://localhost:3000/todos-los-servicios`
  - Botón "Usar mi ubicación" → ver recomendaciones (si los servicios tienen `latitude/longitude`)
  - Selector de radio (1–20 km) → recalcula resultados
  - Tarjetas con distancia visible (`distanceKm`) cuando aplique
- Endpoint: `POST /api/services/recommended`
  - Body mínimo: `{ latitude, longitude, radiusKm }`
  - Opcionales: `{ district, tags, publico_objetivo }`

## Notas

- El país se filtra usando `getCountry()` y `NEXT_PUBLIC_COUNTRY`. Revisa `src/lib/featureFlags.ts` y `.env.local`.
- Si faltan coordenadas en Supabase, las recomendaciones pueden estar vacías o lejos: prioriza la geocodificación.