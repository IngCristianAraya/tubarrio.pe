# Probar Conexión Firebase en Producción

## 🎯 Objetivo

Verificar si Firebase funciona correctamente en tu aplicación desplegada en Vercel usando el script de diagnóstico.

## 📋 Pasos para Probar

### 1. Preparación

Antes de probar, asegúrate de haber completado:
- ✅ Configurado todas las variables de entorno de Firebase en Vercel
- ✅ Configurado `NEXT_PUBLIC_SITE_URL` con tu URL de producción
- ✅ Agregado tu dominio de Vercel a los dominios autorizados en Firebase Console

### 2. Acceder a tu Aplicación en Producción

1. Ve a tu dashboard de Vercel: https://vercel.com/dashboard
2. Busca tu proyecto y haz clic en él
3. Copia la URL de producción (ejemplo: `https://tubarrio-pe.vercel.app`)
4. Abre esa URL en tu navegador

### 3. Ejecutar el Script de Diagnóstico

1. **Abre las herramientas de desarrollador** (F12)
2. **Ve a la pestaña Console**
3. **Copia y pega** el siguiente script completo:

```javascript
// Script de diagnóstico Firebase para producción
console.log('🔍 DIAGNÓSTICO FIREBASE EN PRODUCCIÓN');
console.log('==========================================');

// 1. Verificar variables de entorno
console.log('\n📊 VARIABLES DE ENTORNO:');
const firebaseVars = {
  'NEXT_PUBLIC_FIREBASE_API_KEY': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  'NEXT_PUBLIC_FIREBASE_APP_ID': process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  'NEXT_PUBLIC_SITE_URL': process.env.NEXT_PUBLIC_SITE_URL
};

Object.entries(firebaseVars).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${key}: NO DEFINIDA`);
  }
});

// 2. Verificar configuración de Firebase
console.log('\n🔥 CONFIGURACIÓN FIREBASE:');
try {
  if (typeof window !== 'undefined' && window.firebase) {
    console.log('✅ Firebase SDK cargado');
    const apps = window.firebase.apps;
    console.log(`📱 Apps de Firebase: ${apps.length}`);
    
    if (apps.length > 0) {
      const app = apps[0];
      console.log('✅ App de Firebase inicializada');
      console.log(`📋 Proyecto: ${app.options.projectId}`);
      console.log(`🌐 Auth Domain: ${app.options.authDomain}`);
    } else {
      console.log('❌ No hay apps de Firebase inicializadas');
    }
  } else {
    console.log('❌ Firebase SDK no encontrado en window');
  }
} catch (error) {
  console.log('❌ Error al verificar Firebase:', error);
}

// 3. Probar conexión a Firestore
console.log('\n💾 PRUEBA DE FIRESTORE:');
try {
  if (typeof window !== 'undefined' && window.firebase && window.firebase.firestore) {
    const db = window.firebase.firestore();
    console.log('✅ Firestore inicializado');
    
    // Intentar una operación de lectura simple
    db.collection('services').limit(1).get()
      .then((snapshot) => {
        console.log('✅ Conexión a Firestore exitosa');
        console.log(`📊 Documentos encontrados: ${snapshot.size}`);
        if (snapshot.size > 0) {
          console.log('✅ Datos disponibles en Firestore');
        } else {
          console.log('⚠️ No hay documentos en la colección services');
        }
      })
      .catch((error) => {
        console.log('❌ Error al conectar con Firestore:', error);
        console.log('🔍 Código de error:', error.code);
        console.log('📝 Mensaje:', error.message);
      });
  } else {
    console.log('❌ Firestore no disponible');
  }
} catch (error) {
  console.log('❌ Error al probar Firestore:', error);
}

// 4. Información del entorno
console.log('\n🌍 INFORMACIÓN DEL ENTORNO:');
console.log(`🌐 URL actual: ${window.location.href}`);
console.log(`🏠 Origen: ${window.location.origin}`);
console.log(`📱 User Agent: ${navigator.userAgent.substring(0, 50)}...`);

console.log('\n✅ Diagnóstico completado. Revisa los resultados arriba.');
```

4. **Presiona Enter** para ejecutar el script

### 4. Interpretar los Resultados

#### ✅ **Resultado Exitoso**
```
✅ Todas las variables de entorno definidas
✅ Firebase SDK cargado
✅ App de Firebase inicializada
✅ Conexión a Firestore exitosa
✅ Datos disponibles en Firestore
```

#### ❌ **Problemas Comunes**

**Variables no definidas:**
```
❌ NEXT_PUBLIC_FIREBASE_API_KEY: NO DEFINIDA
```
**Solución**: Verificar configuración en Vercel Dashboard

**Firebase no cargado:**
```
❌ Firebase SDK no encontrado en window
```
**Solución**: Problema de build o importación

**Error de dominio:**
```
❌ Error al conectar con Firestore: auth/unauthorized-domain
```
**Solución**: Agregar dominio en Firebase Console

**Error de permisos:**
```
❌ Error al conectar con Firestore: permission-denied
```
**Solución**: Verificar reglas de Firestore

### 5. Comparar con Desarrollo Local

Para comparar, también ejecuta el script en tu entorno local:

1. Ve a: http://localhost:3000
2. Abre la consola (F12)
3. Ejecuta el mismo script
4. Compara los resultados

### 6. Acciones Según Resultados

#### Si TODO funciona ✅
- El problema puede estar en otra parte
- Verificar logs de Vercel
- Revisar errores específicos de la aplicación

#### Si hay errores de variables ❌
- Verificar configuración en Vercel Dashboard
- Forzar redespliegue
- Esperar propagación de variables (5-10 minutos)

#### Si hay errores de dominio ❌
- Verificar dominios autorizados en Firebase Console
- Agregar dominio exacto de Vercel
- Esperar propagación (1-2 minutos)

#### Si hay errores de conexión ❌
- Revisar logs de Vercel para errores de build
- Verificar que Firebase esté correctamente importado
- Comprobar reglas de Firestore

## 📝 Reporte de Resultados

Después de ejecutar el script, toma una captura de pantalla de la consola y compártela para análisis adicional si es necesario.

## 🔄 Próximos Pasos

Basándote en los resultados:
1. Si funciona: ✅ Problema resuelto
2. Si falla: Revisar logs de Vercel y aplicar soluciones específicas
3. Si persiste: Forzar redespliegue completo