# Plan de Homepage y Avances (Supabase + Next.js)

Este documento resume decisiones, colores de marca, arquitectura propuesta y avances iniciales para la nueva homepage de TuBarrio.pe, ahora que las limitaciones de Firebase fueron resueltas y migramos a Supabase.

## Objetivos
- Transmitir valor en segundos: búsqueda inteligente y resultados relevantes.
- Ser intuitivo y visualmente atractivo en móvil y desktop.
- Incentivar tanto a usuarios (encontrar rápido) como a proveedores (registro fácil y beneficios claros).
- Mantener consistencia de marca usando los colores ya establecidos en la web.

## Colores de marca (existentes en la web)
- Primario (CTA principal): `#ea580c` (Tailwind `orange-600`, variable `--primary` en `src/app/globals.css`).
- Secundario/acentos: `#f97316` (Tailwind `orange-500`, marcado como "Main orange" en `src/lib/designSystem.ts`).
- Amarillo del gradiente: `#facc15` (Tailwind `yellow-400`).
- Nota: El `theme_color` del `manifest.json` actualmente es `#ff9800`; se puede alinear a `#ea580c` si se desea mayor consistencia.

## Estructura propuesta de la Homepage
- Hero de búsqueda (smart search): entrada libre + sugerencias por intención (categoría, barrio, tags).
- Servicios destacados cerca de mí: si el usuario comparte ubicación (lat/lon + radio persistente).
- Categorías populares: cuadrícula simple con conteos y acceso rápido.
- Beneficios de la plataforma: bloque corto y claro (para usuarios y proveedores).
- Historias del barrio: contenido editorial para engagement.
- Doble CTA: "Explorar servicios" y "Registrar mi negocio" con el color primario.

## API y Datos (Supabase)
- Nuevo endpoint: `/api/home`.
  - Devuelve `categories` (slug, nombre, icono, `serviceCount`).
  - Devuelve `servicesByCategory` (record por `categorySlug` con una lista de servicios relevantes/featured/ordenados por rating/fecha).
  - Opcional: parámetros `lat`, `lon`, `radiusKm` para enriquecer resultados con cercanos (se puede delegar a `/api/services/recommended`).
- Índices recomendados:
  - `services(active)`
  - `services(categorySlug)`
  - `services(barrio)`
  - `services(tags)` y/o `services(publico_objetivo)` si se usan en filtros/relevancia.

## Componentes UI (base)
- `HeroSearch`: caja de búsqueda con sugerencias, coherente con el color primario.
- `NearbyGrid`: rejilla de servicios cercanos (cuando hay `lat/lon`).
- `CategoriesGrid`: cuadrícula de categorías populares (usa los colores ya establecidos y los estilos Tailwind que existen en el proyecto).
- Nota: En esta iteración se crean los componentes sin alterar la página visible; la integración puede realizarse en el siguiente paso.

## SEO / Metadatos
- Título: "TuBarrio.pe - Descubre servicios en tu barrio".
- Descripción: "Encuentra los mejores servicios, restaurantes y comercios cerca de ti en TuBarrio.pe. Conecta con negocios locales y descubre recomendaciones personalizadas por barrio.".
- Schema: `WebSite` + `SearchAction` (sitio) y `ItemList` (categorías). En páginas de servicio, `LocalBusiness`.

## Métricas / Analytics
- Eventos propuestos: `home_search`, `home_nearby_click`, `category_click`, `provider_cta_click`.
- Persistencia de radio y ubicación en `localStorage` y parámetros de URL (cuando el usuario usa "Usar mi ubicación").

## Avances en esta entrega
- Documento de plan y decisiones (este archivo) en la raíz del proyecto.
- Endpoint `/api/home` (server-side) que reúne categorías y agrupa servicios por categoría.
- Componentes base `HeroSearch`, `NearbyGrid` y `CategoriesGrid` creados (aún sin integración visible para mantener el control de la UI).

## Próximos pasos sugeridos
- Integrar los componentes en la página principal y revisar LCP/CLS.
- Añadir selector `publico_objetivo` para enriquecer relevancia en recomendaciones.
- Conectar `NearbyGrid` a `/api/services/recommended` cuando el usuario comparta ubicación.
- Alinear `manifest.theme_color` a `#ea580c` si se busca máxima consistencia.

---
Última actualización: auto-generado por asistente.
