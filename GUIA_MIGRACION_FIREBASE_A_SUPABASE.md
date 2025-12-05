# Guía de Migración de Firebase/Firestore a Supabase (Postgres)

Objetivo: migrar lecturas/escrituras a Supabase en ~1 mes, manteniendo fallback y minimizando riesgo y costes.

Estado actual del repo: la app ya es Supabase‑only y no utiliza Firebase en producción ni desarrollo. Este documento queda como referencia histórica para la migración.

**Estado Actual (resumen)**
- Lecturas cliente: `src/lib/services.ts`, `src/hooks/useServices.ts`, `src/hooks/useService.ts` usando Firestore (`collection`, `query`, `where`, `orderBy`, `limit`, `startAfter`, `getDoc`, `getDocs`).
- Fallback: `src/lib/firebase/fallback.ts` y funciones `filterFallbackServices`, `getFallbackServiceById`.
- Admin API (server): `src/app/api/services/route.ts` y `[id]/route.ts` con Firebase Admin para CRUD.
- Analítica: `src/context/AnalyticsContext.tsx` (lecturas y eventos), `analytics` collection (parte comentada y diagnósticos).
- Auth de app: `src/context/AuthContext.tsx` (mock/localStorage), Firestore rules definen admin real en entorno Firebase.

**Modelo de Datos Actual (resumen)**
- `services`: id (docId), `slug`, `name`, `description`, `category`/`categorySlug`, `barrio`, `address`, `featured`, `active`/`status`, `images[]`, `contact{ phone, whatsapp, email }`, `hours{...}`, `rating`, `reviewCount`, `userId`, `createdAt`.
- `categories`: `slug`, `name`, `icon` (+ posibles extras).
- Inconsistencias detectadas: uso mixto `active` y `status`, `category` vs `categorySlug`, `tag` vs `tags`.

**Esquema Objetivo en Supabase**
- Tabla `public.services` (mantener `id` texto para no romper enlaces):
  - `id text primary key`, `slug text unique`, `name text not null`, `description text`, `category text`, `category_slug text`, `barrio text`, `address text`, `featured boolean default false`, `active boolean default true`, `images text[] default '{}'`, `contact jsonb`, `hours jsonb`, `rating numeric default 0`, `review_count integer default 0`, `user_id uuid null`, `created_at timestamptz default now()`, `updated_at timestamptz default now()`.
- Tabla `public.categories`:
  - `id uuid primary key default gen_random_uuid()`, `slug text unique`, `name text not null`, `icon text`, `created_at timestamptz default now()`, `updated_at timestamptz default now()`.
- Tabla `public.analytics_events`:
  - `id bigserial primary key`, `type text not null`, `page text`, `service_id text`, `method text`, `session_id text`, `user_id uuid null`, `user_agent text`, `referrer text`, `metadata jsonb`, `created_at timestamptz default now()`.
- Índices recomendados:
  - `services(category_slug, active, featured, name)`, `services(active, featured)`, `services(user_id)`, `services(created_at desc)`, `categories(slug unique)`, `analytics_events(type, created_at)`.

**Políticas de Seguridad (RLS)**
- `services` y `categories`: sólo `SELECT` para rol `anon`. Escritos vía clave `service_role` en servidor (bypassa RLS).
  - `alter table services enable row level security;`
  - `create policy read_public on services for select using (true);`
  - Igual para `categories`.
- `analytics_events`: permitir `INSERT` a `anon`, sin `UPDATE/DELETE`.
  - `alter table analytics_events enable row level security;`
  - `create policy insert_public on analytics_events for insert with check (true);`

**Cambios de Código (mapa)**
- Nuevo cliente Supabase:
  - Crear `src/lib/supabase/client.ts` con `createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)`.
  - Crear `src/lib/supabase/admin.ts` con `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)` sólo en API routes.
- Reemplazos en lecturas:
  - `src/lib/services.ts`: portar `getServicesByCategory`, `getAllCategories`, `getCategoryBySlug` a Supabase.
  - `src/hooks/useServices.ts`: usar `supabase.from('services')...` manteniendo alias y cache; conservar fallback si offline.
  - `src/hooks/useService.ts`: `supabase.from('services').select('*').eq('id', id).single()` con fallback.
- Admin API:
  - `src/app/api/services/route.ts` y `[id]/route.ts`: usar `supabaseAdmin.from('services')` para `select/insert/update/delete`.
- Analítica:
  - `AnalyticsContext.tsx`: enviar eventos a `analytics_events` con `insert`; agregar lectura de métricas vía agregaciones (`count`, `group by` usando RPC o consultas filtradas).

**Consultas Equivalentes (ejemplos mínimos)**
- Listar servicios por categoría/condiciones:
  - `supabase.from('services').select('*').eq('active', true).eq('category_slug', slug).in('category_slug', aliases).eq('barrio', barrio).order('featured', { ascending: false }).order('name', { ascending: true }).range(offset, offset+limit-1)`.
- Detalle:
  - `supabase.from('services').select('*').eq('id', id).single()`.
- Paginación:
  - Preferir keyset: `order('created_at', { ascending: false })` + `lt('created_at', cursor)`; si necesario, `range(offset, ...)`.

**Migración de Datos**
- Exportar Firestore a JSON (conservando `id` y normalizando `Timestamp` a ISO).
- Transformar claves: unificar `categorySlug`, asegurar `active boolean`, convertir `tags` a `text[]`, `contact/hours` a `jsonb`.
- Cargar en Supabase:
  - Opción rápida: `supabaseAdmin.from('services').insert(batch)` en script Node.
  - Opción masiva: CSV y `psql`/`
\copy` a Postgres.
- Verificar integridad: conteos por categoría, muestra aleatoria de 50 servicios, revisión de slugs/IDs.

**Plan de Corte**
- Feature flag eliminado; el origen de datos es exclusivamente Supabase.
- Fase 1 (staging): lecturas en Supabase, escrituras siguen en Firebase (si aplica).
- Fase 2 (canary): 5–10% tráfico Supabase + logs/observabilidad.
- Fase 3 (prod): 100% lecturas Supabase; API admin a Supabase.
- Mantener `fallbackServices` para resiliencia y modo offline.

**Checklist Técnica**
- Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Crear archivos `src/lib/supabase/client.ts` y `admin.ts`.
- RLS y políticas aplicadas; índices creados.
- Queries equivalentes implementadas y testeadas (categoría, barrio, featured, active, slug/id).
- Paginación validada (keyset) y ordenamientos.
- Analítica insert-only verificada y paneles básicos.

**Cronograma Sugerido (4 semanas)**
- Semana 1: Esquema + RLS + clientes Supabase + migración de dev.
- Semana 2: Portar lecturas (`services.ts`, hooks) + pruebas E2E.
- Semana 3: Portar API admin + analítica + canary.
- Semana 4: Corte total + monitoreo + limpieza Firebase.

**Riesgos y Mitigaciones**
- Inconsistencias de campos: auditar y normalizar en script de migración.
- Paginación distinta: usar keyset en Supabase para estabilidad.
- Reglas de seguridad: validar RLS y usar `service_role` sólo en servidor.
- Costes de consultas: añadir índices; evitar `select *` con columnas innecesarias.
- Fallback: mantener `fallbackServices` y caches para resiliencia.
