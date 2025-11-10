# Variables de entorno para Supabase y selección de origen de datos

Esta guía explica cómo configurar las variables de entorno necesarias para habilitar Supabase y seleccionar el origen de datos (Firebase o Supabase) durante la migración.

## Archivo `.env.local`

Agrega las siguientes variables al archivo `.env.local` en la raíz del proyecto:

```
# Selección de origen de datos: 'firebase' (por defecto) o 'supabase'
NEXT_PUBLIC_DATA_SOURCE=firebase

# Configuración Supabase (requerida cuando NEXT_PUBLIC_DATA_SOURCE='supabase')
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## Instalación del SDK de Supabase

Instala el SDK si aún no está presente en el proyecto:

```
npm i @supabase/supabase-js
```

## Cómo funciona

- La utilidad de flags en `src/lib/featureFlags.ts` lee `NEXT_PUBLIC_DATA_SOURCE` y decide si consultar Firebase o Supabase.
- El cliente de Supabase en `src/lib/supabase/client.ts` valida que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén definidos cuando se selecciona Supabase.
- El repositorio en `src/lib/repositories/servicesRepository.ts` obtiene los datos desde el origen seleccionado y el `ServicesContext` usa ese repositorio para cargar y consultar servicios.

## Recomendaciones de seguridad

- `NEXT_PUBLIC_*` expone variables al cliente; usa la `ANON_KEY` y evita incluir llaves de servicio (`service_role`) en el frontend.
- Para operaciones administrativas (ETL/migración), usa procesos backend con llaves seguras y políticas RLS adecuadas en Supabase.

## Pasos de verificación rápida

1. Define `NEXT_PUBLIC_DATA_SOURCE=supabase` y completa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Arranca el servidor de desarrollo con `npm run dev`.
3. Abre `/todos-los-servicios` y verifica que los servicios se carguen desde Supabase.