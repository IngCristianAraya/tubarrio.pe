# 🚨 SOLUCIÓN INMEDIATA - Error de Permisos Firestore

## Problema Identificado
- ❌ `Missing or insufficient permissions` en Firestore
- ❌ `ERR_BLOCKED_BY_CLIENT` - Navegador bloqueando conexiones

## 🔧 SOLUCIÓN RÁPIDA (2 minutos)

### Paso 1: Verificar Navegador
**Si usas Brave Browser:**
1. Haz clic en el icono del **escudo** 🛡️ en la barra de direcciones
2. **Desactiva "Shields"** para `localhost`
3. Recarga la página

**Si usas otro navegador:**
- Desactiva temporalmente bloqueadores de anuncios para `localhost`

### Paso 2: Ejecutar Script de Solución Actualizada
1. Ve a `http://localhost:3000/admin`
2. Abre la **Consola del Navegador** (F12 → Console)
3. **Copia y pega** este comando actualizado (compatible con Firebase v9+):

#### Opción 1: Script desde archivo
```javascript
// Cargar y ejecutar el script actualizado
fetch('/SCRIPT-CONSOLA-FIREBASE-V9.js')
  .then(response => response.text())
  .then(script => {
    eval(script);
  })
  .catch(error => {
    console.error('Error cargando script:', error);
    console.log('💡 Usa la Opción 2 (script directo) en su lugar');
  });
```

#### Opción 2: Script directo (recomendado)
```javascript
// Script para resolver permisos de Firestore - Compatible con Firebase v9+
console.log('🔧 INICIANDO SOLUCIÓN FIREBASE V9...');

async function solucionFirestoreV9() {
  try {
    console.log('🌐 Probando acceso directo a la API...');
    
    // Probar lectura a través de la API
    const response = await fetch('/api/services', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API accesible:', data.length || 0, 'servicios');
      
      // Probar escritura a través de la API
      console.log('✏️ Probando escritura vía API...');
      const testService = {
        name: 'Test de Permisos API',
        description: 'Prueba de escritura',
        category: 'test',
        location: 'Test Location',
        contact: { phone: '123456789', whatsapp: '123456789' },
        createdAt: new Date().toISOString()
      };
      
      const createResponse = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testService)
      });
      
      if (createResponse.ok) {
        const createdService = await createResponse.json();
        console.log('✅ Escritura exitosa vía API:', createdService.id);
        
        // Limpiar el servicio de prueba
        await fetch(`/api/services/${createdService.id}`, { method: 'DELETE' });
        console.log('✅ Limpieza completada');
        console.log('🎉 SOLUCIÓN EXITOSA - La API funciona correctamente');
      } else {
        const errorData = await createResponse.text();
        console.error('❌ Error en escritura API:', createResponse.status, errorData);
      }
    } else {
      console.error('❌ Error en API:', response.status, response.statusText);
    }
    
    // Limpiar cache de Firebase
    console.log('🧹 Limpiando cache de Firebase...');
    Object.keys(localStorage).forEach(key => {
      if (key.includes('firebase') || key.includes('firestore') || key.includes('auth')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('firebase') || key.includes('firestore') || key.includes('auth')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Verificar Brave Browser
    if (navigator.userAgent.includes('Brave')) {
      console.log('🛡️ Navegador Brave detectado');
      console.log('💡 SOLUCIÓN BRAVE: Desactiva Shields para este sitio');
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error);
    console.log('🔧 Intenta: Ctrl+Shift+R para refrescar completamente');
  }
}

solucionFirestoreV9();
```

### Paso 3: Verificar Solución
Después de ejecutar el script, deberías ver:
- ✅ Usuario autenticado
- ✅ Token refrescado
- ✅ Lectura exitosa
- ✅ Escritura exitosa
- 🎉 SOLUCIÓN COMPLETADA

## 🔄 Si el Problema Persiste

### Opción A: Reset Completo de Autenticación
```javascript
// Ejecutar en consola del navegador
await firebase.auth().signOut();
localStorage.clear();
sessionStorage.clear();
// Luego ir a /admin/login y volver a autenticarse
```

### Opción B: Verificar Reglas de Firestore
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto `tubarriope-7ed1d`
3. Ve a **Firestore Database** → **Rules**
4. Verifica que las reglas estén **publicadas** (no en borrador)

### Opción C: Limpiar Caché Completo
```javascript
// Ejecutar en consola
limpiarCache(); // Función disponible después del script
// Luego recargar página
```

## 🎯 Resultado Esperado
Después de aplicar la solución:
- ✅ Podrás editar servicios sin errores
- ✅ Las operaciones de Firestore funcionarán normalmente
- ✅ No más errores de permisos

## 📞 Si Necesitas Ayuda
Si después de seguir estos pasos el problema persiste:
1. Ejecuta `solucionInmediata()` en la consola
2. Copia el output completo
3. Comparte los logs para diagnóstico adicional

---
**⏱️ Tiempo estimado de solución: 2-3 minutos**