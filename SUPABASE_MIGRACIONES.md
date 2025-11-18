# Supabase: cómo aplicar migraciones de geolocalización

Este documento explica cómo aplicar las migraciones SQL que agregan soporte de campos de ubicación en la tabla `public.services`.

## Archivos de migración
- `scripts/migrations/2025-11-18_add_lat_lon_publico.sql`
  - Añade `latitude` (real), `longitude` (real) y `publico_objetivo` (text)
  - Crea índice compuesto `idx_services_lat_lon` para prefiltrado por bounding box
  - Habilita `postgis`
  - Añade `geo_location` (`geography(POINT,4326)`) para evitar conflicto con posibles columnas text `location`
  - Crea índice espacial GIST `idx_services_geo_location`
  - Trigger que sincroniza `geo_location` cuando cambian `lat/lon`
  - Función `public.negocios_cercanos(lat, lon, max_dist_km)`
- `scripts/migrations/2025-11-18_add_indexes_tags_publico.sql`
  - Crea índice `GIN` sobre `tags` (`jsonb_path_ops`) para consultas de contención `@>`
  - Habilita `pg_trgm` y crea índice `GIN (gin_trgm_ops)` sobre `publico_objetivo` para búsquedas de texto (`ILIKE`)

## ¿Cuándo usar PostGIS?
- Usa **solo lat/lon** si:
  - El dataset es pequeño/medio (< 10–20k registros)
  - Las consultas por radio son ocasionales y puedes calcular distancia en el backend
- Usa **PostGIS** si:
  - Harás muchas consultas de proximidad, necesitarás rendimiento y ordenamiento por distancia
  - Quieres índice espacial y funciones avanzadas (`ST_DWithin`, `ST_Distance`, etc.)

## Aplicación de migraciones

### Opción A: Supabase SQL Editor (rápida)
1. Abre tu proyecto en Supabase → **SQL** → **New query**
2. Copia el contenido del archivo SQL correspondiente
3. Ejecuta primero `2025-11-18_add_lat_lon_publico.sql`
4. Si decides usar PostGIS, ejecuta después `2025-11-18_enable_postgis_and_location.sql`
5. Ejecuta `2025-11-18_add_indexes_tags_publico.sql` para optimizar consultas sobre `tags` y `publico_objetivo`
6. Limpieza opcional: `2025-11-18_cleanup_duplicate_slug_index.sql` si tienes índices duplicados en `slug`

### Opción B: `psql` (línea de comandos)
1. Obtén tu cadena de conexión (Host, DB, User, Password, SSL)
2. Ejecuta:
   ```bash
   psql "postgres://USER:PASSWORD@HOST:PORT/DB?sslmode=require" -f scripts/migrations/2025-11-18_add_lat_lon_publico.sql
   # Opcional PostGIS:
   psql "postgres://USER:PASSWORD@HOST:PORT/DB?sslmode=require" -f scripts/migrations/2025-11-18_enable_postgis_and_location.sql
   ```

## Verificación posterior
- Confirmar columnas:
  ```sql
  SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'services';
  ```
- Verificar índices:
  ```sql
  SELECT indexname, indexdef
  FROM pg_indexes
  WHERE schemaname = 'public' AND tablename = 'services';
  ```
  - Confirmar presencia de:
    - `idx_services_lat_lon` (btree)
    - `idx_services_geo_location` (gist, si PostGIS)
    - `idx_services_tags_gin` (gin)
    - `idx_services_publico_trgm` (gin)
- Probar la función (si PostGIS):
  ```sql
  SELECT COUNT(*) FROM public.negocios_cercanos( -12.0464, -77.0428, 5 );
  ```

## Uso en consultas
- Sin PostGIS (ejemplo en SQL con Haversine): ver bloque de ejemplo dentro de `2025-11-18_add_lat_lon_publico.sql`
- Con PostGIS (distancia en km):
  ```sql
  SELECT s.*, ST_Distance(
    s.location,
    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography
  ) / 1000 AS distance_km
  FROM public.negocios_cercanos(:lat, :lon, :radius_km) s
  ORDER BY distance_km ASC;
  ```

## Notas
- El trigger actualiza `location` automáticamente cuando `latitude` o `longitude` cambian.
- `publico_objetivo` se almacena como `text` inicialmente (ej. "18-30"). Se puede migrar a `int4range` más adelante si conviene.
Error común: intentar crear `GIST` sobre `text`/`jsonb` sin opclass. Usa `GIN` para `jsonb` (`jsonb_path_ops`/`jsonb_ops`) y `pg_trgm` para texto (`gin_trgm_ops`). Si ya tienes una columna `location` tipo `text`, la migración espacial usa `geo_location` para evitar conflicto.