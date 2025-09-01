// SCRIPT DIRECTO PARA CONSOLA - SOLUCIÓN FIRESTORE PERMISSIONS
// Copiar y pegar directamente en la consola del navegador en /admin

console.log('🔧 INICIANDO SOLUCIÓN DIRECTA FIRESTORE...');

// Función principal de solución
async function solucionFirestoreDirecta() {
  try {
    // 1. Verificar que estamos en el contexto correcto
    if (typeof window === 'undefined') {
      console.error('❌ Este script debe ejecutarse en el navegador');
      return;
    }

    // 2. Buscar Firebase en diferentes ubicaciones
    let firebaseAuth, firestore;
    
    // Intentar acceder a Firebase desde diferentes contextos
    if (window.firebase) {
      console.log('✅ Firebase encontrado en window.firebase');
      firebaseAuth = window.firebase.auth();
      firestore = window.firebase.firestore();
    } else if (window.next && window.next.router) {
      console.log('🔍 Buscando Firebase en contexto Next.js...');
      // Intentar acceder desde el contexto de React
      const reactFiber = document.querySelector('#__next')._reactInternalFiber ||
                        document.querySelector('#__next')._reactInternals;
      if (reactFiber) {
        console.log('✅ Contexto React encontrado');
      }
    }

    // 3. Si no encontramos Firebase, intentar importarlo dinámicamente
    if (!firebaseAuth) {
      console.log('🔄 Intentando cargar Firebase dinámicamente...');
      try {
        // Intentar acceder desde el módulo cargado
        const firebaseModule = await import('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
        console.log('✅ Firebase cargado dinámicamente');
      } catch (e) {
        console.log('⚠️ No se pudo cargar Firebase dinámicamente');
      }
    }

    // 4. Verificar autenticación actual
    if (!firebaseAuth) {
      console.error('❌ No se puede acceder a Firebase Auth');
      console.log('💡 SOLUCIÓN ALTERNATIVA:');
      console.log('1. Asegúrate de estar en la página /admin');
      console.log('2. Verifica que hayas hecho login');
      console.log('3. Recarga la página y vuelve a intentar');
      return;
    }

    const user = firebaseAuth.currentUser;
    if (!user) {
      console.error('❌ Usuario no autenticado');
      console.log('💡 SOLUCIÓN: Ve a /admin/login y autentica nuevamente');
      return;
    }

    console.log('✅ Usuario autenticado:', user.email);

    // 5. Refrescar token de autenticación
    console.log('🔄 Refrescando token de autenticación...');
    const newToken = await user.getIdToken(true); // true para forzar refresh
    console.log('✅ Token refrescado exitosamente');
    console.log('🔑 Nuevo token (primeros 50 chars):', newToken.substring(0, 50) + '...');

    // 6. Verificar Firestore
    if (!firestore) {
      console.error('❌ No se puede acceder a Firestore');
      return;
    }

    // 7. Probar operación de lectura
    console.log('📖 Probando lectura de servicios...');
    const servicesSnapshot = await firestore.collection('services').limit(1).get();
    console.log('✅ Lectura exitosa, documentos encontrados:', servicesSnapshot.size);

    // 8. Probar operación de escritura
    console.log('✏️ Probando operación de escritura...');
    const testDocId = 'test-permissions-' + Date.now();
    const testDocRef = firestore.collection('services').doc(testDocId);
    
    await testDocRef.set({
      name: 'Test de Permisos',
      description: 'Documento de prueba para verificar permisos',
      createdAt: new Date(),
      testField: true,
      timestamp: Date.now()
    });
    
    console.log('✅ Escritura exitosa - Documento creado:', testDocId);

    // 9. Verificar que se escribió correctamente
    const testDoc = await testDocRef.get();
    if (testDoc.exists) {
      console.log('✅ Verificación exitosa - Documento existe y contiene:', testDoc.data());
    }

    // 10. Limpiar documento de prueba
    await testDocRef.delete();
    console.log('✅ Limpieza exitosa - Documento de prueba eliminado');

    console.log('🎉 SOLUCIÓN COMPLETADA EXITOSAMENTE');
    console.log('💡 Los permisos de Firestore están funcionando correctamente');
    console.log('🚀 Ahora puedes editar servicios sin problemas');

  } catch (error) {
    console.error('❌ ERROR EN SOLUCIÓN:', error);
    
    if (error.code === 'permission-denied') {
      console.log('🔧 DIAGNÓSTICO: Error de permisos de Firestore');
      console.log('💡 SOLUCIONES:');
      console.log('1. Verificar reglas de Firestore en Firebase Console');
      console.log('2. Verificar que el usuario tenga claims de admin');
      console.log('3. Intentar logout/login: await firebase.auth().signOut()');
    } else if (error.code === 'unauthenticated') {
      console.log('🔧 DIAGNÓSTICO: Token de autenticación inválido');
      console.log('💡 SOLUCIÓN: Hacer logout y login nuevamente');
    } else if (error.message && error.message.includes('firebase')) {
      console.log('🔧 DIAGNÓSTICO: Error de configuración de Firebase');
      console.log('💡 SOLUCIÓN: Verificar configuración en config.ts');
    } else {
      console.log('🔧 DIAGNÓSTICO: Error desconocido');
      console.log('💡 Detalles del error:', error.message);
    }
  }
}

// Función para limpiar caché
function limpiarCacheFirebase() {
  console.log('🧹 Limpiando caché de Firebase...');
  
  const keysToRemove = [];
  
  // Limpiar localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('firebase') || key.includes('firestore'))) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log('🗑️ Eliminado:', key);
  });
  
  // Limpiar sessionStorage
  const sessionKeys = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && (key.includes('firebase') || key.includes('firestore'))) {
      sessionKeys.push(key);
    }
  }
  
  sessionKeys.forEach(key => {
    sessionStorage.removeItem(key);
    console.log('🗑️ Eliminado de session:', key);
  });
  
  console.log('✅ Caché limpiado completamente');
}

// Ejecutar solución automáticamente
console.log('🚀 EJECUTANDO SOLUCIÓN AUTOMÁTICA...');
solucionFirestoreDirecta();

// Hacer funciones disponibles globalmente
window.solucionFirestoreDirecta = solucionFirestoreDirecta;
window.limpiarCacheFirebase = limpiarCacheFirebase;

console.log('📋 FUNCIONES DISPONIBLES EN CONSOLA:');
console.log('- solucionFirestoreDirecta() - Ejecutar diagnóstico completo');
console.log('- limpiarCacheFirebase() - Limpiar caché de Firebase');
console.log('');
console.log('⏱️ La solución se está ejecutando automáticamente...');