// Script para probar autenticación de Firestore en la consola del navegador
// Ejecutar en /admin después de hacer login

const testFirestoreAuth = async () => {
  console.log('🔍 PROBANDO AUTENTICACIÓN DE FIRESTORE');
  console.log('=' .repeat(50));
  
  try {
    // 1. Verificar que Firebase esté inicializado
    console.log('\n1. Verificando inicialización de Firebase...');
    
    // Importar desde la ruta correcta
    const { db, auth } = await import('./src/lib/firebase/config.js');
    
    if (!db) {
      console.error('❌ Firestore no está inicializado');
      return;
    }
    
    if (!auth) {
      console.error('❌ Firebase Auth no está inicializado');
      return;
    }
    
    console.log('✅ Firebase inicializado correctamente');
    
    // 2. Verificar usuario autenticado
    console.log('\n2. Verificando usuario autenticado...');
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('❌ No hay usuario autenticado');
      console.log('💡 Asegúrate de estar logueado en /admin/login');
      return;
    }
    
    console.log('✅ Usuario autenticado:');
    console.log('   - UID:', currentUser.uid);
    console.log('   - Email:', currentUser.email);
    
    // 3. Obtener token de autenticación
    console.log('\n3. Obteniendo token de autenticación...');
    
    const token = await currentUser.getIdToken(true); // Force refresh
    console.log('✅ Token obtenido (length:', token.length, ')');
    
    // 4. Probar lectura de servicios
    console.log('\n4. Probando lectura de servicios...');
    
    const { collection, getDocs, limit, query } = await import('firebase/firestore');
    
    const servicesRef = collection(db, 'services');
    const testQuery = query(servicesRef, limit(1));
    const snapshot = await getDocs(testQuery);
    
    console.log('✅ Lectura exitosa - Documentos:', snapshot.size);
    
    if (snapshot.empty) {
      console.log('⚠️ No hay servicios en la base de datos');
      return;
    }
    
    // 5. Probar operación de escritura (actualización)
    console.log('\n5. Probando operación de escritura...');
    
    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
    
    // Obtener el primer servicio para actualizar
    const firstDoc = snapshot.docs[0];
    const serviceId = firstDoc.id;
    const serviceData = firstDoc.data();
    
    console.log('📝 Intentando actualizar servicio:', serviceId);
    
    // Preparar datos de actualización (sin cambios reales)
    const updateData = {
      updatedAt: serverTimestamp(),
      // Mantener todos los datos existentes
      ...serviceData,
      // Agregar un campo de prueba
      lastTestUpdate: new Date().toISOString()
    };
    
    // Intentar la actualización
    const serviceRef = doc(db, 'services', serviceId);
    await updateDoc(serviceRef, updateData);
    
    console.log('✅ Actualización exitosa!');
    
    // 6. Limpiar el campo de prueba
    console.log('\n6. Limpiando campo de prueba...');
    
    const { deleteField } = await import('firebase/firestore');
    await updateDoc(serviceRef, {
      lastTestUpdate: deleteField()
    });
    
    console.log('✅ Campo de prueba eliminado');
    
    console.log('\n' + '=' .repeat(50));
    console.log('🎉 TODAS LAS PRUEBAS EXITOSAS');
    console.log('✅ La autenticación de Firestore está funcionando correctamente');
    
  } catch (error) {
    console.error('\n❌ ERROR EN LA PRUEBA:', error);
    console.error('   - Código:', error.code);
    console.error('   - Mensaje:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('\n💡 DIAGNÓSTICO:');
      console.log('   - El usuario está autenticado pero Firestore rechaza la operación');
      console.log('   - Posibles causas:');
      console.log('     1. Las reglas de Firestore no están desplegadas');
      console.log('     2. El token de autenticación no es válido');
      console.log('     3. Hay un problema con la configuración del proyecto');
      console.log('\n🔧 SOLUCIONES:');
      console.log('   1. Verificar en Firebase Console que las reglas estén desplegadas');
      console.log('   2. Hacer logout y login nuevamente');
      console.log('   3. Verificar la configuración del proyecto Firebase');
    } else if (error.code === 'unauthenticated') {
      console.log('\n💡 DIAGNÓSTICO:');
      console.log('   - El usuario no está autenticado correctamente');
      console.log('   - Hacer logout y login nuevamente');
    }
  }
};

// Función para verificar el estado actual del auth
const checkAuthState = async () => {
  console.log('🔍 VERIFICANDO ESTADO DE AUTENTICACIÓN');
  
  try {
    const { auth } = await import('./src/lib/firebase/config.js');
    
    if (!auth) {
      console.log('❌ Firebase Auth no inicializado');
      return;
    }
    
    const user = auth.currentUser;
    if (!user) {
      console.log('❌ No hay usuario autenticado');
      return;
    }
    
    console.log('✅ Usuario autenticado:');
    console.log('   - UID:', user.uid);
    console.log('   - Email:', user.email);
    console.log('   - Email verificado:', user.emailVerified);
    console.log('   - Proveedor:', user.providerData[0]?.providerId);
    
    // Verificar token
    const token = await user.getIdToken();
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    console.log('✅ Token válido:');
    console.log('   - Emisor:', payload.iss);
    console.log('   - Audiencia:', payload.aud);
    console.log('   - Expira:', new Date(payload.exp * 1000));
    console.log('   - Emitido:', new Date(payload.iat * 1000));
    
  } catch (error) {
    console.error('❌ Error verificando auth:', error);
  }
};

// Ejecutar prueba automáticamente
testFirestoreAuth();

// Exportar funciones para uso manual
window.testFirestore = {
  test: testFirestoreAuth,
  checkAuth: checkAuthState
};

console.log('\n💡 Funciones disponibles:');
console.log('   - window.testFirestore.test(): Ejecutar prueba completa');
console.log('   - window.testFirestore.checkAuth(): Verificar estado de auth');