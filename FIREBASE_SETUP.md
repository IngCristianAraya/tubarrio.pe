# Configuración Firebase para Producción en Vercel

## Problema Identificado
El error "Service firestore is not available" en producción se debe a que faltan las variables de entorno necesarias para Firebase Admin SDK.

## Variables de Entorno Requeridas en Vercel

Para que Firebase funcione correctamente en el entorno serverless de Vercel, necesitas configurar estas variables:

### Variables Firebase Admin SDK (para API routes del servidor)
```
FIREBASE_PROJECT_ID=tubarriope-7ed1d
FIREBASE_CLIENT_EMAIL=[service-account-email]
FIREBASE_PRIVATE_KEY=[service-account-private-key]
```

### Variables Firebase Client SDK (para el frontend)
```
NEXT_PUBLIC_FIREBASE_API_KEY=[api-key]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tubarriope-7ed1d.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tubarriope-7ed1d
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tubarriope-7ed1d.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=[sender-id]
NEXT_PUBLIC_FIREBASE_APP_ID=[app-id]
```

## Cómo Obtener las Credenciales

### 1. Service Account (para Admin SDK)
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto `tubarriope-7ed1d`
3. Ve a **Configuración del proyecto** > **Cuentas de servicio**
4. Haz clic en **Generar nueva clave privada**
5. Descarga el archivo JSON
6. Del archivo JSON, extrae:
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### 2. Configuración Web (para Client SDK)
1. En Firebase Console, ve a **Configuración del proyecto** > **General**
2. En la sección "Tus apps", busca la configuración web
3. Copia los valores del objeto `firebaseConfig`

## Configurar en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Ve a **Settings** > **Environment Variables**
3. Agrega cada variable una por una
4. **Importante**: Para `FIREBASE_PRIVATE_KEY`, asegúrate de que los saltos de línea `\n` estén correctamente escapados

## Verificación

Después de configurar las variables:

1. Redespliega el proyecto
2. Prueba el endpoint: `https://www.tubarrio.pe/api/services-admin`
3. Debería devolver datos JSON en lugar de errores

## Estado Actual

✅ **FIREBASE_PROJECT_ID**: Configurado correctamente  
❌ **FIREBASE_CLIENT_EMAIL**: Falta configurar  
❌ **FIREBASE_PRIVATE_KEY**: Falta configurar  
❌ **Variables NEXT_PUBLIC_**: Faltan configurar  

## API Routes Disponibles

- `/api/debug-services` - Usa Firebase Client SDK (actualmente falla)
- `/api/services-admin` - Usa Firebase Admin SDK (falla por credenciales faltantes)
- `/api/debug-env` - Muestra estado de variables de entorno

Una vez configuradas las variables, el API route `/api/services-admin` debería funcionar correctamente.