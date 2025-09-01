# Diagnóstico de Permisos de Firestore

## Problema Identificado
El usuario puede autenticarse correctamente en la aplicación, pero al intentar editar servicios aparece el error:
```
FirebaseError: Missing or insufficient permissions.
```

## Análisis Realizado

### ✅ Verificaciones Completadas:
1. **Reglas de Firestore**: Las reglas están correctamente configuradas para permitir escritura a usuarios autenticados
2. **Configuración de Firebase**: Las variables de entorno están correctamente configuradas
3. **Autenticación Frontend**: El AuthContext funciona correctamente
4. **Código de Edición**: La lógica de actualización de servicios es correcta

### 🔍 Posibles Causas del Problema:
1. **Token de autenticación no válido**: El token puede estar expirado o corrupto
2. **Reglas no desplegadas**: Las reglas pueden no estar desplegadas en Firebase Console
3. **Configuración del proyecto**: Problema con la configuración del proyecto Firebase
4. **Cache del navegador**: Problemas con el cache del navegador

## Scripts de Diagnóstico Creados

### 1. `debug-auth-firestore.js`
Script completo de diagnóstico que verifica:
- Inicialización de Firebase
- Estado de autenticación
- Conexión a Firestore
- Operaciones de lectura y escritura

### 2. `test-firestore-auth.js`
Script específico para probar autenticación y operaciones de escritura.

## Instrucciones para Ejecutar el Diagnóstico

### Paso 1: Preparación
1. Abrir Chrome y navegar a `http://localhost:3000/admin`
2. Hacer login con las credenciales de administrador
3. Abrir las herramientas de desarrollador (F12)
4. Ir a la pestaña "Console"

### Paso 2: Ejecutar Diagnóstico
Copiar y pegar este código en la consola:

```javascript
// Cargar y ejecutar el script de diagnóstico
fetch('/test-firestore-auth.js')
  .then(response => response.text())
  .then(script => {
    eval(script);
  })
  .catch(error => {
    console.error('Error cargando script:', error);
    // Si no se puede cargar, ejecutar diagnóstico básico
    runBasicDiagnostic();
  });

// Función de diagnóstico básico
const runBasicDiagnostic = async () => {
  console.log('🔍 DIAGNÓSTICO BÁSICO DE FIRESTORE');
  
  try {
    // Verificar Firebase
    const { db, auth } = await import('./src/lib/firebase/config.js');
    
    if (!db || !auth) {
      console.error('❌ Firebase no inicializado');
      return;
    }
    
    // Verificar usuario
    const user = auth.currentUser;
    if (!user) {
      console.error('❌ Usuario no autenticado');
      return;
    }
    
    console.log('✅ Usuario:', user.email);
    
    // Probar operación de escritura
    const { collection, addDoc, deleteDoc, doc } = await import('firebase/firestore');
    
    const testDoc = await addDoc(collection(db, 'services'), {
      name: 'Test - ' + Date.now(),
      test: true,
      createdAt: new Date()
    });
    
    console.log('✅ Escritura exitosa:', testDoc.id);
    
    await deleteDoc(doc(db, 'services', testDoc.id));
    console.log('✅ Eliminación exitosa');
    
    console.log('🎉 FIRESTORE FUNCIONA CORRECTAMENTE');
    
  } catch (error) {
    console.error('❌ ERROR:', error.code, error.message);
    
    if (error.code === 'permission-denied') {
      console.log('\n💡 SOLUCIONES SUGERIDAS:');
      console.log('1. Verificar reglas en Firebase Console');
      console.log('2. Hacer logout y login nuevamente');
      console.log('3. Limpiar cache del navegador');
      console.log('4. Verificar configuración del proyecto');
    }
  }
};
```

### Paso 3: Interpretar Resultados

#### ✅ Si el diagnóstico es exitoso:
- El problema puede ser específico de la página de edición
- Verificar la consola cuando se intenta editar un servicio específico
- El problema puede estar en el código de la página de edición

#### ❌ Si aparece "permission-denied":
1. **Verificar reglas en Firebase Console**:
   - Ir a Firebase Console > Firestore Database > Rules
   - Verificar que las reglas estén desplegadas
   - Las reglas deben permitir escritura para `request.auth != null`

2. **Hacer logout y login nuevamente**:
   - Cerrar sesión en `/admin`
   - Limpiar cache del navegador
   - Volver a hacer login

3. **Verificar configuración del proyecto**:
   - Verificar que el proyecto Firebase sea el correcto
   - Verificar que las variables de entorno coincidan

#### ❌ Si aparece "unauthenticated":
- El usuario no está correctamente autenticado
- Hacer logout y login nuevamente
- Verificar que el token no esté expirado

## Soluciones Recomendadas

### Solución 1: Refrescar Token de Autenticación
```javascript
// Ejecutar en la consola para refrescar el token
const { auth } = await import('./src/lib/firebase/config.js');
if (auth.currentUser) {
  const newToken = await auth.currentUser.getIdToken(true);
  console.log('Token refrescado');
}
```

### Solución 2: Verificar y Redesplegar Reglas
1. Ir a Firebase Console
2. Firestore Database > Rules
3. Verificar que las reglas sean:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Función para verificar si el usuario es admin
    function isAdmin() {
      return request.auth != null;
    }
    
    // Reglas para servicios
    match /services/{document} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Reglas para servicios en español
    match /servicios/{document} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
  }
}
```
4. Hacer clic en "Publish"

### Solución 3: Limpiar Cache y Reiniciar
1. Cerrar todas las pestañas de la aplicación
2. Limpiar cache del navegador (Ctrl+Shift+Delete)
3. Reiniciar el servidor de desarrollo
4. Volver a hacer login

## Problema con Brave Browser

El usuario reportó que en Brave no aparece la página de login. Esto puede deberse a:

1. **Configuración de privacidad de Brave**:
   - Brave bloquea trackers y scripts por defecto
   - Puede estar bloqueando Firebase Auth

2. **Solución para Brave**:
   - Desactivar "Shields" para localhost
   - Permitir todos los scripts en la configuración de sitio
   - Usar modo incógnito para probar

## Próximos Pasos

1. Ejecutar el diagnóstico en Chrome
2. Según los resultados, aplicar las soluciones correspondientes
3. Probar la edición de servicios
4. Si el problema persiste, verificar logs del servidor
5. Considerar usar Firebase Emulator para desarrollo local