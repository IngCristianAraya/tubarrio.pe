-- Migration opcional: habilitar PostGIS y columna geography para consultas espaciales
-- Tabla objetivo: public.services
-- Añade: extension postgis, geo_location (geography(POINT,4326)), índice GIST
-- Incluye: trigger para sincronizar location desde lat/lon y función negocios_cercanos(lat, lon, max_dist_km)

BEGIN;

-- Habilitar PostGIS (seguro si ya está instalado)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Columna geography para consultas espaciales
-- Nota: usamos 'geo_location' para evitar colisión con posibles columnas text 'location'
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS geo_location geography(POINT, 4326);

-- Índice espacial GIST sobre la columna geography
CREATE INDEX IF NOT EXISTS idx_services_geo_location
  ON public.services USING GIST (geo_location);

-- Trigger para mantener location sincronizado cuando cambian lat/lon
CREATE OR REPLACE FUNCTION public.services_update_location_from_lat_lon()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.geo_location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  ELSE
    NEW.geo_location := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_services_geo_location_from_lat_lon ON public.services;
CREATE TRIGGER trg_services_geo_location_from_lat_lon
BEFORE INSERT OR UPDATE OF latitude, longitude ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.services_update_location_from_lat_lon();

-- Función utilitaria: devuelve servicios dentro de un radio (km) alrededor de (lat, lon)
-- Nota: devuelve SETOF public.services; si necesitas la distancia, calcúlala en la consulta llamante con ST_Distance.
CREATE OR REPLACE FUNCTION public.negocios_cercanos(
  lat double precision,
  lon double precision,
  max_dist_km double precision
)
RETURNS SETOF public.services
LANGUAGE sql STABLE
AS $$
  SELECT s.*
  FROM public.services s
  WHERE s.geo_location IS NOT NULL
    AND ST_DWithin(
      s.geo_location,
      ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography,
      max_dist_km * 1000
    )
  ORDER BY ST_Distance(
      s.geo_location,
      ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography
    );
$$;

COMMIT;

-- Uso de ejemplo para incluir distancia en la llamada:
-- SELECT s.*, ST_Distance(
--   s.geo_location,
--   ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography
-- ) / 1000 AS distance_km
-- FROM public.negocios_cercanos(:lat, :lon, :radius_km) s
-- ORDER BY distance_km ASC;