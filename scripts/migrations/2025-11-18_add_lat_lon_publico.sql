-- Migration: campos básicos para recomendaciones por ubicación (sin PostGIS)
-- Tabla objetivo: public.services
-- Añade: latitude (real), longitude (real), publico_objetivo (text)
-- También crea un índice compuesto (latitude, longitude) para prefiltrado por bounding box.

BEGIN;

-- Añadir columnas básicas si no existen
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS latitude real,
  ADD COLUMN IF NOT EXISTS longitude real,
  ADD COLUMN IF NOT EXISTS publico_objetivo text;

-- Índice compuesto para consultas por caja (lat/lon)
CREATE INDEX IF NOT EXISTS idx_services_lat_lon
  ON public.services (latitude, longitude);

COMMIT;

-- Nota de uso (referencia):
-- Para buscar por radio sin PostGIS, puedes usar bounding box + Haversine en la consulta:
-- Ejemplo:
-- WITH params AS (
--   SELECT CAST(:lat AS double precision) AS lat,
--          CAST(:lon AS double precision) AS lon,
--          CAST(:radius_km AS double precision) AS radius_km
-- )
-- SELECT s.*,
--   (
--     6371 * acos(
--       cos(radians(p.lat)) * cos(radians(s.latitude)) *
--       cos(radians(s.longitude) - radians(p.lon)) +
--       sin(radians(p.lat)) * sin(radians(s.latitude))
--     )
--   ) AS distance_km
-- FROM public.services s
-- CROSS JOIN params p
-- WHERE s.latitude BETWEEN (p.lat - (p.radius_km/111.045)) AND (p.lat + (p.radius_km/111.045))
--   AND s.longitude BETWEEN (p.lon - (p.radius_km/111.045)) AND (p.lon + (p.radius_km/111.045))
-- HAVING distance_km <= p.radius_km
-- ORDER BY distance_km ASC;