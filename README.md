# Tubarrio.pe — Directorio de Servicios

Aplicación web de directorio de servicios construida con Next.js (App Router) y Supabase como origen de datos principal. La administración y los formularios viven en proyectos separados que alimentan el proyecto público (tubarrio) en Supabase.

## Características

- Servicios y detalle dinámico (`/servicio/[id]`) con resolución por `slug`, `id` o `uid`.
- Lista completa y filtrada en `/todos-los-servicios` (búsqueda, categoría, barrio, distrito).
- SEO completo: metadata dinámica, JSON‑LD, Open Graph/Twitter, sitemap.
- Imágenes optimizadas con `next/image` y sanitización de URLs.
- Arquitectura preparada para múltiples fuentes (Supabase/Firebase) con bandera de entorno.

## Requisitos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase (proyecto público tubarrio). Opcional: Firebase si se usa como fallback.

## Configuración de entorno

Crear `.env.local` con las variables mínimas para Supabase:

```env
NEXT_PUBLIC_DATA_SOURCE=supabase
NEXT_PUBLIC_COUNTRY=pe
SUPABASE_URL=https://<tu-proyecto>.supabase.co
SUPABASE_ANON_KEY=<tu-anon-key>
```

Si usas Firebase como fallback, puedes incluir las `NEXT_PUBLIC_FIREBASE_*`; revisa `SUPABASE_ENV.md` y `VERCEL-DEPLOYMENT-GUIDE.md` para detalles.

## Instalación y ejecución

- Instalar dependencias: `npm install`
- Desarrollo: `npm run dev` y abrir `http://localhost:3000`
- Build de producción: `npm run build`
- Servir producción local: `npm run start`

## Estructura del proyecto

- `src/app` rutas y páginas (App Router). Incluye:
  - `servicio/[id]` página dinámica de servicio.
  - `todos-los-servicios` catálogo y filtros.
  - `api/services/[id]` API para obtener un servicio por `slug`/`id`/`uid`.
  - `sitemap.ts` generación de sitemap.
- `src/hooks` lógica de datos (por ejemplo `useService`, `useServices`).
- `src/lib` utilidades y configuración (feature flags, Supabase, etc.).
- `src/components` UI reutilizable (cards, headers, SEO, etc.).
- `public` estáticos (imágenes y assets).

## Flujo de datos

- La página `servicio/[id]` usa el hook `useService` que consulta la API interna `GET /api/services/[id]`.
- La API resuelve el servicio en Supabase y aplica filtros (por país y estado `active`).
- `generateStaticParams` para `servicio/[id]` obtiene slugs/ids desde Supabase. La página está forzada a `dynamic` para evitar 404 cuando hay nuevos servicios.
- El contexto de servicios y los filtros alimentan `/todos-los-servicios`.

## Imágenes y configuración

- Las imágenes de servicios pueden residir en Supabase Storage. Si usas dominios externos, debes permitirlos en `next.config.js`:

```js
images: {
  domains: [
    'fyekrdhzerjagradhxvv.supabase.co',
    'faumtjrpyyzxhrvtwwkj.supabase.co',
    'images.unsplash.com',
    'res.cloudinary.com',
    // agrega otros dominios necesarios
  ],
}
```

- Las URLs se sanitizan en los componentes (por ejemplo, se eliminan paréntesis `)` al final). Aun así, valida que el objeto exista en el bucket.

## Despliegue (Vercel)

- Configura variables en Vercel (`Settings` → `Environment Variables`):
  - `NEXT_PUBLIC_DATA_SOURCE=supabase`
  - `NEXT_PUBLIC_COUNTRY=pe`
  - `SUPABASE_URL` y `SUPABASE_ANON_KEY` del proyecto público tubarrio.
- Realiza un redeploy para que se aplique la configuración.
- Revisar `VERCEL-DEPLOYMENT-GUIDE.md` para pasos detallados.

## Rutas clave

- `GET /api/services/[id]` devuelve un servicio por `slug`/`id`/`uid`.
- `GET /todos-los-servicios` lista con filtros y búsqueda.
- `GET /servicio/<slug|id>` detalle del servicio.

## Troubleshooting

- 404 en `/servicio/<slug>`:
  - Verifica en Supabase: `slug` exacto, `active=true`, `country` consistente con `NEXT_PUBLIC_COUNTRY`.
  - Prueba la API: `https://<tu-dominio>/api/services/<slug>` debe devolver JSON.
  - Si la página sigue en 404, confirma que el deploy incluye los cambios y que la página está en modo dinámico.

- Error `next/image` host no configurado:
  - Añade el dominio del bucket en `next.config.js` bajo `images.domains`.
  - Asegúrate de que la URL no tenga caracteres extra (como `)` al final) y que el objeto exista.

- Datos desde fuente incorrecta:
  - Revisa `src/lib/featureFlags.ts` y confirma que `getDataSource()` devuelve `supabase` por defecto.

## SEO

- Metadata dinámica con `generateMetadata`.
- Componentes JSON‑LD: `LocalBusinessJsonLd`, `BreadcrumbJsonLd`.
- `SocialMeta` para Open Graph/Twitter.
- Sitemap y robots configurados.

## Scripts útiles

- Optimización de imágenes: `npm run optimize:images`.
- Comprobaciones y guías adicionales: ver `SUPABASE_ENV.md`, `README-OPTIMIZATION.md` y `VERCEL-DEPLOYMENT-GUIDE.md`.

## Contribución

- PRs y sugerencias son bienvenidos. Mantén el estilo existente y cambios enfocados.
