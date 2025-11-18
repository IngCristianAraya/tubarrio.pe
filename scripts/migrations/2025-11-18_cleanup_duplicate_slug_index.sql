-- Limpieza: eliminar índice duplicado en slug
-- Actualmente existen dos índices únicos sobre slug:
-- - services_slug_unique_idx
-- - services_slug_unique
-- Mantendremos 'services_slug_unique' y eliminaremos el duplicado para reducir bloat.

BEGIN;

DROP INDEX IF EXISTS public.services_slug_unique_idx;

COMMIT;