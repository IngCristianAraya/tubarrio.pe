# Guía de Deploy por País (Vercel + Supabase)

Esta guía te permite operar la app con múltiples dominios (uno por país) usando:
- Un solo repositorio (mismo código para todos los países)
- Una sola cuenta de Supabase y un único proyecto (compartido), con columna `country` para segmentar datos
- Múltiples proyectos en Vercel, cada uno apuntando al mismo repo pero con variables de entorno distintas

## Resumen de Arquitectura

- Frontend: Next.js (un repo) → 5 proyectos en Vercel (pe, de, cl, us, co)
- Backend de datos: Supabase (un proyecto) → tabla `public.services` con columna `country` y `active`
- Panel admin (externo): Node/Python con `SUPABASE_SERVICE_ROLE_KEY` para insertar/editar servicios por país

## ¿Cuántas cuentas/proyectos necesito?

- Supabase: una sola cuenta y un solo proyecto es suficiente. La segmentación por país se hace con el campo `country`.
- Vercel: 5 proyectos que apuntan al mismo repo. No necesitas 5 repos distintos. Cada proyecto tiene sus propias variables de entorno y dominio.

## Requisitos Previos

- Repo listo (este mismo)
- Supabase variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Backend panel: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (no públicas)
- Columna `country` creada e indexada (ya incluida en `scripts/supabase_setup.sql`)

## Vercel: Crear Proyectos por País

1) En Vercel, crea un nuevo proyecto y selecciona el MISMO repo (repite estas 5 veces):
   - Proyecto 1: `tubarrio-pe`
   - Proyecto 2: `tubarrio-de`
   - Proyecto 3: `tubarrio-cl`
   - Proyecto 4: `tubarrio-us`
   - Proyecto 5: `tubarrio-co`

2) En cada proyecto, configura variables de entorno:

   Comunes (idénticas para todos):
   - `NEXT_PUBLIC_DATA_SOURCE=supabase`
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`

   Específicas por país:
   - `NEXT_PUBLIC_COUNTRY=pe` (Perú)
   - `NEXT_PUBLIC_COUNTRY=de` (Alemania)
   - `NEXT_PUBLIC_COUNTRY=cl` (Chile)
   - `NEXT_PUBLIC_COUNTRY=us` (Estados Unidos)
   - `NEXT_PUBLIC_COUNTRY=co` (Colombia)

   Opcionales de marca/SEO por país (si quieres diferenciación visual):
   - `NEXT_PUBLIC_SITE_NAME` (p. ej. "tubarrio.pe", "meinviertel.de")
   - `NEXT_PUBLIC_BASE_URL` (p. ej. `https://tubarrio.pe`)
   - `NEXT_PUBLIC_PRIMARY_COLOR` (p. ej. `#ff5722`)

3) Asigna el dominio al proyecto correspondiente:
   - `tubarrio-pe` → `tubarrio.pe`
   - `tubarrio-de` → `meinviertel.de`
   - `tubarrio-cl` → `tubarrio.cl`
   - `tubarrio-us` → `tubarrio.us`
   - `tubarrio-co` → `tubarrio.co`

4) Primer deploy: realiza el deploy en cada proyecto. La app ya filtrará por el país indicado en `NEXT_PUBLIC_COUNTRY`.

## Supabase: Datos por País

- Tabla `public.services` (campos relevantes): `id`, `slug`, `name`, `category`, `categorySlug`, `country`, `active`, `createdAt`, `updatedAt`, `whatsapp`, `socialMedia`, etc.
- Índice: `services_country_idx` para acelerar consultas por `country`.
- RLS: lectura pública de `active = true`; escrituras solo vía `service_role` (panel admin).

### Backfill rápido (si tienes filas sin país)

```sql
-- Asignar Perú a filas sin país (ajusta según tu caso)
update public.services set country = 'pe' where country is null;
```

### Seed y Migraciones (scripts)

- Los scripts de seed y migración exigen `SEED_COUNTRY` (o leen `NEXT_PUBLIC_COUNTRY`) para asignar el país en cada fila insertada.
- Antes de ejecutar: establece `SEED_COUNTRY` con el código de 2 letras del país.

Ejemplos:

```powershell
# Windows PowerShell
$env:SUPABASE_URL="https://xxxxx.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="ey..."
$env:SEED_COUNTRY="cl"  # Chile
node scripts/migrate_firebase_to_supabase.js
```

```bash
# macOS/Linux
SUPABASE_URL=https://xxxxx.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=ey... \
SEED_COUNTRY=pe \
node scripts/seed_supabase_services.js
```

- Si `SEED_COUNTRY` no está definido o no es válido, los scripts se detienen para evitar insertar filas sin país.

## Panel Admin Externo (Node/Python)

- UI: pantalla "Países" con botones (Chile, Perú, Colombia, USA, Alemania). Al elegir, fija `country` en el formulario.
- Backend: usa `SUPABASE_SERVICE_ROLE_KEY` (no pública) para `upsert` sobre la tabla `services`.

### Ejemplo Node.js

```js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function upsertService(service) {
  // service incluye { id, slug, name, category, categorySlug, country, active, ... }
  const { data, error } = await supabase
    .from('services')
    .upsert(service, { onConflict: 'id' })
    .select();
  if (error) throw error;
  return data;
}
```

## Preguntas Frecuentes

- ¿Una sola cuenta de Supabase?
  - Sí. Un solo proyecto con segmentación por `country`. Si en el futuro quieres aislar por compliance/latencia, puedes crear proyectos adicionales, pero no es necesario ahora.

- ¿Cinco repos distintos?
  - No. Es el mismo repo. En Vercel crearás 5 proyectos que apuntan al mismo repo, cada uno con envs y dominio diferentes.

- ¿Necesito una plantilla por proyecto?
  - No. El mismo código funciona. Si quieres branding distinto por país, usa variables de entorno para nombre/colores y condicionales de UI.

## SEO y Rendimiento

- Cache: usa `revalidate` (60–120s) en páginas de listado y detalle para reducir lecturas a Supabase.
- Sitemap: genera `sitemap.ts` con el dominio del país (puede leer `NEXT_PUBLIC_COUNTRY`/`NEXT_PUBLIC_BASE_URL`).
- Meta: ajusta `src/app/metadata.ts` para cada proyecto (título/description por país usando envs).

## Checklist de Validación por País

1. `.env` de Vercel configurado (Supabase URL/Key + `NEXT_PUBLIC_COUNTRY`)
2. Dominio agregado y verificado
3. `supabase_setup.sql` ejecutado (columna `country` e índice presentes)
4. Inserciones desde panel admin incluyen `country`
5. Páginas `/servicios` y `/servicio/{id}` muestran datos del país correcto
6. Métricas de activos: `count(active=true)` por país para calcular fees mensuales

## Mantenimiento

- Actualizaciones de código: haces push al repo, Vercel redeploya los 5 proyectos. Si una app requiere contenido/config especial, ajusta con variables.
- Observabilidad: usa logs en Supabase y Vercel; si hay errores de lectura, valida envs y RLS.

---

Ante cualquier duda, esta estructura te permite vender por país con control centralizado y mínimos cambios de operación: un único backend (Supabase) y múltiples frontends (Vercel) filtrados por `country`.