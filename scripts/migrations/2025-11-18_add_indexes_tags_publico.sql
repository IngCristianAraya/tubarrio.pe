-- Índices recomendados para consultas en tags (jsonb) y publico_objetivo (text)
-- Evita usar GIST sobre columnas text/jsonb sin opclass específico.

BEGIN;

-- GIN para jsonb: optimiza consultas de contención @> en tags
-- Usa jsonb_path_ops para contención; si necesitas operadores variados, usa jsonb_ops.
CREATE INDEX IF NOT EXISTS idx_services_tags_gin
  ON public.services USING GIN (tags jsonb_path_ops);

-- Trigram para búsquedas por texto (ILIKE, similitud) en publico_objetivo
-- Requiere extensión pg_trgm
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_services_publico_trgm
  ON public.services USING GIN (publico_objetivo gin_trgm_ops);

COMMIT;

-- Notas:
-- - Si consultas publico_objetivo por igualdad exacta, un índice BTREE simple puede ser suficiente:
--   CREATE INDEX IF NOT EXISTS idx_services_publico_btree ON public.services (publico_objetivo);
-- - Para rangos reales, considera migrar publico_objetivo a int4range y usar GIST:
--   ALTER TABLE public.services ADD COLUMN publico_rango int4range;
--   -- poblar publico_rango desde texto "18-30" con una función de parsing antes de remover el campo antiguo.
--   CREATE INDEX idx_services_publico_rango_gist ON public.services USING GIST (publico_rango);