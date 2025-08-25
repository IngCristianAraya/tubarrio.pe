# 🔥 Guía para Resolver Problemas de Firebase en Vercel

## 🚨 Problema
Después de hacer commit y deploy en Vercel, la aplicación no puede acceder a Firebase/Firestore.

## 🔍 Causa Principal
Las variables de entorno de Firebase no están configuradas en Vercel, o están mal configuradas.

## ✅ Solución Paso a Paso

### 1. 📋 Configurar Variables de Entorno en Vercel

1. **Ir al Dashboard de Vercel:**
   - Visita: https://vercel.com/dashboard
   - Inicia sesión con tu cuenta

2. **Seleccionar tu Proyecto:**
   - Busca y selecciona el proyecto `tubarrio-pe` (o como se llame tu proyecto)

3. **Acceder a Configuración:**
   - Haz clic en **Settings** (Configuración)
   - En el menú lateral, selecciona **Environment Variables**

4. **Agregar Variables de Firebase:**
   Agrega las siguientes variables una por una:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyCyUy8zFbyy0VwYVUZo9TnfDMoMU3eqAUI
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = tubarriope-7ed1d.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID = tubarriope-7ed1d
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = tubarriope-7ed1d.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 1097392406942
   NEXT_PUBLIC_FIREBASE_APP_ID = 1:1097392406942:web:aa206fa1542c74c235568f
   ```

5. **Configurar Variables Adicionales:**
   ```
   NEXT_PUBLIC_WHATSAPP_NUMBER = 51901426737
   NEXT_PUBLIC_SITE_URL = https://tu-dominio-vercel.vercel.app
   NEXT_PUBLIC_SITE_NAME = Tu Barrio PE
   NEXT_PUBLIC_SITE_DESCRIPTION = Directorio de servicios locales en tu barrio
   ```

   **⚠️ IMPORTANTE:** Reemplaza `https://tu-dominio-vercel.vercel.app` con tu URL real de Vercel.

6. **Configurar Entornos:**
   - Para cada variable, selecciona: **Production**, **Preview**, y **Development**
   - Esto asegura que las variables estén disponibles en todos los entornos

### 2. 🌐 Configurar Dominio Autorizado en Firebase

1. **Ir a Firebase Console:**
   - Visita: https://console.firebase.google.com/
   - Selecciona tu proyecto `tubarriope-7ed1d`

2. **Configurar Dominios Autorizados:**
   - Ve a **Authentication** > **Settings** > **Authorized domains**
   - Agrega tu dominio de Vercel: `tu-proyecto.vercel.app`
   - También agrega cualquier dominio personalizado que uses

3. **Verificar Reglas de Firestore:**
   - Ve a **Firestore Database** > **Rules**
   - Asegúrate de que las reglas permitan lectura:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

### 3. 🚀 Redesplegar la Aplicación

1. **Forzar Nuevo Deploy:**
   - En Vercel Dashboard, ve a tu proyecto
   - Ve a la pestaña **Deployments**
   - Haz clic en los tres puntos (...) del último deployment
   - Selecciona **Redeploy**

2. **O hacer un nuevo commit:**
   ```bash
   git add .
   git commit -m "Update environment variables for Vercel"
   git push
   ```

### 4. 🧪 Verificar la Configuración

1. **Usar el Script de Diagnóstico:**
   - Abre tu sitio en producción
   - Abre las herramientas de desarrollador (F12)
   - Ve a la pestaña **Console**
   - Pega y ejecuta el contenido del archivo `debug-vercel-firebase.js`

2. **Verificar Manualmente:**
   - Abre la consola del navegador en tu sitio de producción
   - Ejecuta: `console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)`
   - Debería mostrar tu API key, no `undefined`

### 5. 🔧 Solución de Problemas Comunes

#### ❌ Variables de Entorno No Definidas
- **Síntoma:** `process.env.NEXT_PUBLIC_FIREBASE_API_KEY` es `undefined`
- **Solución:** Verificar que las variables estén configuradas en Vercel y hacer redeploy

#### ❌ Error de Dominio No Autorizado
- **Síntoma:** Error de CORS o "unauthorized domain"
- **Solución:** Agregar el dominio de Vercel a los dominios autorizados en Firebase

#### ❌ Error de Permisos de Firestore
- **Síntoma:** "Permission denied" al leer datos
- **Solución:** Verificar y actualizar las reglas de Firestore

#### ❌ Error de Red
- **Síntoma:** "Network error" o timeouts
- **Solución:** Verificar que Firebase esté funcionando y que no haya problemas de conectividad

### 6. 📝 Lista de Verificación Final

- [ ] Variables de entorno configuradas en Vercel
- [ ] Dominio de Vercel agregado a Firebase Auth
- [ ] Reglas de Firestore permiten lectura
- [ ] Aplicación redesployada después de cambios
- [ ] Script de diagnóstico ejecutado sin errores
- [ ] Funcionalidad de Firebase probada en producción

## 🆘 Si Aún No Funciona

1. **Verificar Logs de Vercel:**
   - Ve a tu proyecto en Vercel
   - Revisa los logs de build y runtime

2. **Verificar Consola del Navegador:**
   - Busca errores específicos de Firebase
   - Anota cualquier mensaje de error para debugging

3. **Contactar Soporte:**
   - Si el problema persiste, documenta todos los pasos realizados
   - Incluye screenshots de la configuración de Vercel y Firebase

## 📚 Recursos Adicionales

- [Documentación de Variables de Entorno en Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
- [Documentación de Firebase Web](https://firebase.google.com/docs/web/setup)
- [Solución de Problemas de Firebase](https://firebase.google.com/docs/web/troubleshooting)

---

**💡 Tip:** Guarda esta guía para futuras referencias y compártela con tu equipo.