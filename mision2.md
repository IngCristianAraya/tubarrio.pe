CHECKLIST COMPLETA – tubarrio.pe

🔹 1. Base de datos (Supabase)
Ampliar tabla services con:
latitude (tipo real)
longitude (tipo real)
(Opcional avanzado): location (tipo geography(POINT,4326)) si usas PostGIS
Añadir columna tags (tipo text[]) → ej: ["fútbol", "estudiantes", "precios-bajos"]
Añadir campo publico_objetivo (tipo text o int4range) → ej: "18-30"
Crear índice espacial (solo si usas PostGIS):
sql
1
CREATE INDEX idx_services_location ON services USING GIST (location);
(Opcional) Crear función SQL negocios_cercanos(lat, lon, max_dist) si usas PostGIS

🔹 2. Backend (Next.js API Routes)
Endpoint /api/geocode (solo para panel admin):
Usa Nominatim (OpenStreetMap)
Incluye User-Agent válido (contacto@tubarrio.pe)
Devuelve { lat, lon } o error
Endpoint /api/services/recommended:
Recibe: { lat, lon, intereses?, edad?, perfil? }
Filtra por cercanía (máx. 5 km)
Filtra por tags y publico_objetivo si hay datos de usuario
Devuelve servicios ordenados por distancia + relevancia
Validar que no se expongan datos privados (solo campos públicos de services)



🔹 3. Frontend – Experiencia de usuario
📍 Recomendación por ubicación
Botón principal: “Usar mi ubicación” (solo al hacer clic, no al cargar)
Manejo de permisos:
Si acepta → obtiene lat/lon, llama a /api/services/recommended
Si rechaza → muestra selector de distrito (Miraflores, San Miguel, etc.)
Mostrar distancia en tarjetas: “a 450 m”, “a 1.2 km”
Mensaje de contexto:
“Mostrando servicios cerca de San Miguel”
👤 Recomendación personalizada (fase 1)
Guardar en localStorage:
Última ubicación (si la dio)
Categorías vistas o clickeadas
Intereses seleccionados (ej: checkboxes o botones rápidos: “Fútbol”, “Comida”, “Estudiante”)
Mostrar sugerencia suave:
“Te recomendamos esto porque te interesa el fútbol”
No pedir login ni datos personales → todo anónimo
📱 Diseño móvil + PWA
Botón flotante 📍 en mobile (solo si no ha usado ubicación)
Tarjetas responsivas, con íconos, WhatsApp, distancia
Cargar rápido (usar next/image, optimizar assets)











🔹 4. PWA (Progressive Web App)
Verificar/instalar next-pwa:
js
1
2
3
// next.config.js
skipWaiting: true,
clientsClaim: true
Actualizar public/manifest.json:
Nombre: tubarrio.pe
Íconos: 192x192 y 512x512 actualizados
theme_color con tu paleta
Eliminar residuos de “revista pando”:
Borrar íconos antiguos
Asegurar que no queden rutas cacheadas de Firebase
Probar instalación en móvil:
Android: debe mostrar “Instalar” en Chrome
iOS: “Agregar a pantalla de inicio”
(Futuro) Implementar hook usePWAUpdate para notificar actualizaciones



















🔹 5. Tecnologías elegidas (confirmadas)
FUNCION
TECNOLOGÍA
POR QUÉ?
Geocodificación (panel admin)
Nominatim (OpenStreetMap)
Gratis, suficiente, sin tarjeta
Mapa interactivo (admin)
Leaflet + React-Leaflet
Ligero, open source, personalizable
Ubicación del usuario (frontend)
Geolocation API nativa
Precisa, sin costo
Recomendaciones cercanas
Supabase (con lat/lon)oPostGIS
Escalable, eficiente
Almacenamiento de perfil
localStorage
Anónimo, simple, sin backend
Framework
Next.js 14 (App Router)
SSR, API Routes, PWA-ready
Estilos
Tailwind CSS
Rápido, consistente
Hosting
Vercel
Edge Network, caché, fácil PWA

❌ No usar Google Maps ni Geocoding API → innecesario, costo, tracking.





🔹 6. Hoja de ruta – IA y personalización
Fase 1 (ahora – reglas simples)
Recomendaciones = ubicación + tags + rango de edad
Sin modelo de IA → lógica condicional en API Route
Fase 2 (próximo paso – comportamiento)
Rastrear clics y tiempo en tarjetas
Actualizar localStorage con “intereses inferidos”
Ponderar recomendaciones: lo que mira + lo que le gusta
Fase 3 (futuro – IA ligera)
Usar Supabase + pgvector para embeddings
Comparar perfil de usuario (vector) vs descripción de negocio (vector)
Alternativa: microservicio en Python (pero no necesario aún)

🔹 7. Privacidad y cumplimiento
No guardar ubicación del usuario en base de datos → solo usar en tiempo real
Aviso claro:
“Usamos tu ubicación solo para mostrarte servicios cercanos. No la almacenamos.”
Cumplir con Ley de Protección de Datos (Perú) → solo datos públicos de negocios











🔹 8. Pruebas clave
Usuario nuevo → ve botón de ubicación → acepta → ve servicios cercanos
Usuario que rechaza GPS → puede elegir distrito manualmente
En panel admin → al aprobar negocio → geocodifica dirección → muestra mapa para ajustar → guarda coords en services
Instalar PWA en Android → abre como app → muestra interfaz actual (no “revista pando”)
Cambiar código → usuario ve notificación “Nueva versión” → actualiza → ve cambios

🎯 Meta final
tubarrio.pe = una PWA instalable que muestra, en tiempo real, los servicios más relevantes según DÓNDE estás y QUIÉN eres — sin pedir registro, sin app móvil, y sin costo de APIs externas.
