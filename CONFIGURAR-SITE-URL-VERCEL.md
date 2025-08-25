# Configurar NEXT_PUBLIC_SITE_URL en Vercel

## 🎯 Problema Identificado

La variable `NEXT_PUBLIC_SITE_URL` está configurada para desarrollo local (`http://localhost:3000`) pero necesita ser actualizada en Vercel con la URL de producción.

## 📋 Pasos para Configurar

### 1. Obtener la URL de tu proyecto en Vercel

1. Ve a tu dashboard de Vercel: https://vercel.com/dashboard
2. Busca tu proyecto `tubarrio.pe` o similar
3. Copia la URL de producción (ejemplo: `https://tubarrio-pe.vercel.app`)

### 2. Configurar la Variable de Entorno

1. En el dashboard de Vercel, ve a tu proyecto
2. Navega a **Settings** > **Environment Variables**
3. Busca `NEXT_PUBLIC_SITE_URL` o agrégala si no existe:
   - **Name**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: `https://tu-proyecto.vercel.app` (reemplaza con tu URL real)
   - **Environments**: Selecciona **Production** y **Preview**

### 3. Verificar Configuración Actual

**Variables que YA tienes configuradas:**
- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY`
- ✅ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- ✅ `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_APP_ID`

**Variable que FALTA configurar:**
- ❌ `NEXT_PUBLIC_SITE_URL` (probablemente está en `http://localhost:3000`)

### 4. Otras Variables Opcionales

Si quieres, también puedes agregar:
```
NEXT_PUBLIC_SITE_NAME=Tu Barrio PE
NEXT_PUBLIC_SITE_DESCRIPTION=Directorio de servicios locales en tu barrio
NEXT_PUBLIC_WHATSAPP_NUMBER=51901426737
```

## 🔄 Después de Configurar

1. **Forzar redespliegue**: Ve a **Deployments** y haz clic en **Redeploy**
2. **Probar la conexión**: Usa el script `debug-firebase-production-issue.js` en el navegador
3. **Verificar dominios**: Asegúrate de que tu dominio de Vercel esté autorizado en Firebase Console

## 🚨 Importante

- La URL debe ser **HTTPS** (no HTTP)
- No incluyas barra final (`/`) al final de la URL
- Debe coincidir exactamente con la URL donde se despliega tu app

## 📝 Ejemplo de Configuración Correcta

```
NEXT_PUBLIC_SITE_URL=https://tubarrio-pe.vercel.app
```

## 🔍 Verificación

Después de configurar, puedes verificar que funciona:
1. Abre tu app en producción
2. Abre las herramientas de desarrollador (F12)
3. En la consola, ejecuta: `console.log(process.env.NEXT_PUBLIC_SITE_URL)`
4. Debería mostrar tu URL de producción, no `localhost:3000`