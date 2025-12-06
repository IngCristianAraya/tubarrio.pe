# Guía de Despliegue en Vercel

## Problema Identificado

La aplicación no se conecta a Firestore en producción porque **las variables de entorno no están configuradas en Vercel**.

## Solución: Configurar Variables de Entorno en Vercel

### 1. Acceder a la Configuración de Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** > **Environment Variables**

### 2. Variables Requeridas para Firebase

Agrega las siguientes variables de entorno en Vercel:

#### Variables del Cliente (NEXT_PUBLIC_*)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCyUy8zFbyy0VwYVUZo9TnfDMoMU3eqAUI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tubarriope-7ed1d.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tubarriope-7ed1d
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tubarriope-7ed1d.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1097392406942
NEXT_PUBLIC_FIREBASE_APP_ID=1:1097392406942:web:aa206fa1542c74c235568f
```

#### Variables de Configuración
```
NEXT_PUBLIC_WHATSAPP_NUMBER=51901426737
NEXT_PUBLIC_SITE_URL=https://tu-dominio-vercel.vercel.app
NEXT_PUBLIC_SITE_NAME=Tu Barrio PE
NEXT_PUBLIC_SITE_DESCRIPTION=Directorio de servicios locales en tu barrio
```

#### Variables de Cloudinary (Opcional)
```
CLOUDINARY_CLOUD_NAME=do2rpqupm
CLOUDINARY_API_KEY=686419979272171
CLOUDINARY_API_SECRET=bxlyqkDjGKDRawmEtYJ0dncNUS0
```

### 3. Pasos para Agregar Variables en Vercel

1. **Para cada variable:**
   - Clic en **Add New**
   - **Name**: Nombre de la variable (ej: `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - **Value**: Valor de la variable
   - **Environments**: Seleccionar **Production**, **Preview**, y **Development**
   - Clic en **Save**

2. **Importante**: Después de agregar todas las variables, **redeploy** la aplicación:
   - Ve a **Deployments**
   - Clic en los tres puntos del último deployment
   - Selecciona **Redeploy**

### 4. Verificar la Configuración

Después del redeploy, puedes verificar que las variables estén configuradas:

1. Visita: `https://tu-dominio.vercel.app/api/debug-env`
2. Deberías ver todas las variables configuradas

### 5. Variables Críticas para Firestore

Estas son las variables **OBLIGATORIAS** para que Firestore funcione:

- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY`
- ✅ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- ✅ `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_APP_ID`

## Troubleshooting

### Si sigue sin funcionar:

1. **Verificar que las variables estén bien escritas** (sin espacios extra)
2. **Hacer un redeploy completo** después de agregar las variables
3. **Verificar en la consola del navegador** si hay errores de Firebase
4. **Comprobar que el proyecto Firebase esté activo** y las reglas de Firestore configuradas

### Comandos útiles para debug:

```bash
# Verificar variables localmente
node debug-client-firebase.js

# Verificar conexión a Firestore
node test-firebase-connection.js
```

## Notas Importantes

- Las variables `NEXT_PUBLIC_*` son visibles en el cliente
- Nunca pongas claves privadas en variables `NEXT_PUBLIC_*`
- Después de cambiar variables de entorno, siempre haz redeploy
- El `projectId` está hardcodeado como `tubarriope-7ed1d` en algunos archivos

## Estado Actual

- ✅ Firestore Rules configuradas
- ✅ Firebase Config local funcionando
- ❌ Variables de entorno faltantes en Vercel
- ❌ Conexión a Firestore en producción

**Siguiente paso**: Configurar las variables en Vercel y hacer redeploy.