// SOLUCIÓN INMEDIATA PARA FIRESTORE PERMISSIONS
// Ejecutar este script en la consola del navegador en /admin

console.log('🔧 INICIANDO SOLUCIÓN INMEDIATA PARA FIRESTORE...');

// Función para refrescar token y probar operaciones
async function solucionInmediata() {
  try {
    // 1. Verificar Firebase Auth
    if (!window.firebase || !window.firebase.auth) {
      console.error('❌ Firebase Auth no está disponible');
      return;
    }

    const auth = window.firebase.auth();
    const user = auth.currentUser;

    if (!user) {
      console.error('❌ Usuario no autenticado');
      console.log('💡 SOLUCIÓN: Vuelve a hacer login en /admin/login');
      return;
    }

    console.log('✅ Usuario autenticado:', user.email);

    // 2. Forzar refresh del token
    console.log('🔄 Refrescando token de autenticación...');
    const newToken = await user.getIdToken(true);
    console.log('✅ Token refrescado exitosamente');

    // 3. Verificar Firestore
    if (!window.firebase.firestore) {
      console.error('❌ Firestore no está disponible');
      return;
    }

    const db = window.firebase.firestore();

    // 4. Probar operación de lectura
    console.log('📖 Probando lectura de servicios...');
    const servicesSnapshot = await db.collection('services').limit(1).get();
    console.log('✅ Lectura exitosa, documentos encontrados:', servicesSnapshot.size);

    // 5. Probar operación de escritura
    console.log('✏️ Probando operación de escritura...');
    const testDocRef = db.collection('services').doc('test-permissions-' + Date.now());
    
    await testDocRef.set({
      name: 'Test de Permisos',
      description: 'Documento de prueba para verificar permisos',
      createdAt: new Date(),
      testField: true
    });
    
    console.log('✅ Escritura exitosa');

    // 6. Limpiar documento de prueba
    await testDocRef.delete();
    console.log('✅ Limpieza exitosa');

    console.log('🎉 SOLUCIÓN COMPLETADA: Los permisos están funcionando correctamente');
    console.log('💡 Ahora puedes intentar editar servicios normalmente');

  } catch (error) {
    console.error('❌ ERROR EN SOLUCIÓN:', error);
    
    if (error.code === 'permission-denied') {
      console.log('🔧 DIAGNÓSTICO: Error de permisos de Firestore');
      console.log('💡 SOLUCIONES POSIBLES:');
      console.log('1. Verificar que las reglas de Firestore estén desplegadas');
      console.log('2. Verificar que el usuario tenga claims de admin');
      console.log('3. Ejecutar: await firebase.auth().currentUser.getIdToken(true)');
    } else if (error.code === 'unauthenticated') {
      console.log('🔧 DIAGNÓSTICO: Token de autenticación inválido');
      console.log('💡 SOLUCIÓN: Hacer logout y login nuevamente');
      console.log('Ejecutar: await firebase.auth().signOut(); luego ir a /admin/login');
    } else {
      console.log('🔧 DIAGNÓSTICO: Error desconocido');
      console.log('💡 SOLUCIÓN: Revisar consola de Firebase y reglas de seguridad');
    }
  }
}

// Función para limpiar caché del navegador
function limpiarCache() {
  console.log('🧹 Limpiando caché del navegador...');
  
  // Limpiar localStorage
  const firebaseKeys = Object.keys(localStorage).filter(key => 
    key.includes('firebase') || key.includes('firestore')
  );
  firebaseKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log('🗑️ Eliminado de localStorage:', key);
  });
  
  // Limpiar sessionStorage
  const sessionKeys = Object.keys(sessionStorage).filter(key => 
    key.includes('firebase') || key.includes('firestore')
  );
  sessionKeys.forEach(key => {
    sessionStorage.removeItem(key);
    console.log('🗑️ Eliminado de sessionStorage:', key);
  });
  
  console.log('✅ Caché limpiado. Recarga la página.');
}

// Función para verificar bloqueos del navegador
function verificarBloqueos() {
  console.log('🛡️ Verificando bloqueos del navegador...');
  
  // Verificar si es Brave
  if (navigator.brave) {
    console.log('⚠️ DETECTADO: Navegador Brave');
    console.log('💡 SOLUCIÓN: Desactivar "Shields" para este sitio');
    console.log('1. Hacer clic en el icono del escudo en la barra de direcciones');
    console.log('2. Desactivar "Shields" para localhost');
  }
  
  // Verificar bloqueadores de anuncios
  if (typeof window.adblock !== 'undefined') {
    console.log('⚠️ DETECTADO: Bloqueador de anuncios activo');
    console.log('💡 SOLUCIÓN: Desactivar bloqueador para localhost');
  }
  
  console.log('✅ Verificación de bloqueos completada');
}

// Ejecutar solución completa
console.log('🚀 EJECUTANDO SOLUCIÓN COMPLETA...');
verificarBloqueos();
solucionInmediata();

// Exportar funciones para uso manual
window.solucionInmediata = solucionInmediata;
window.limpiarCache = limpiarCache;
window.verificarBloqueos = verificarBloqueos;

console.log('📋 FUNCIONES DISPONIBLES:');
console.log('- solucionInmediata() - Ejecutar diagnóstico y solución completa');
console.log('- limpiarCache() - Limpiar caché de Firebase');
console.log('- verificarBloqueos() - Verificar bloqueos del navegador');