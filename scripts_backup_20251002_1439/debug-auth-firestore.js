// Script de diagnóstico para verificar autenticación y permisos de Firestore
// Ejecutar en la consola del navegador en /admin después de hacer login

console.log('🔍 DIAGNÓSTICO DE AUTENTICACIÓN Y FIRESTORE');
console.log('=' .repeat(50));

// 1. Verificar Firebase Auth
const checkFirebaseAuth = async () => {
  console.log('\n1. 🔐 VERIFICANDO FIREBASE AUTH...');
  
  try {
    // Importar Firebase Auth desde la configuración de la app
    const { auth } = await import('./src/lib/firebase/config.js');
    
    if (!auth) {
      console.log('❌ Firebase Auth no está inicializado');
      return false;
    }
    
    console.log('✅ Firebase Auth inicializado');
    
    // Verificar usuario actual
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('❌ No hay usuario autenticado');
      return false;
    }
    
    console.log('✅ Usuario autenticado:');
    console.log('   - UID:', currentUser.uid);
    console.log('   - Email:', currentUser.email);
    console.log('   - Email verificado:', currentUser.emailVerified);
    
    // Obtener token de autenticación
    try {
      const token = await currentUser.getIdToken();
      console.log('✅ Token de autenticación obtenido');
      console.log('   - Token length:', token.length);
      
      // Decodificar token para ver claims
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      console.log('   - Token claims:', {
        iss: tokenPayload.iss,
        aud: tokenPayload.aud,
        auth_time: new Date(tokenPayload.auth_time * 1000),
        exp: new Date(tokenPayload.exp * 1000),
        iat: new Date(tokenPayload.iat * 1000)
      });
      
      return true;
    } catch (tokenError) {
      console.log('❌ Error obteniendo token:', tokenError);
      return false;
    }
    
  } catch (error) {
    console.log('❌ Error verificando Firebase Auth:', error);
    return false;
  }
};

// 2. Verificar conexión a Firestore
const checkFirestoreConnection = async () => {
  console.log('\n2. 🔥 VERIFICANDO CONEXIÓN A FIRESTORE...');
  
  try {
    const { db } = await import('./src/lib/firebase/config.js');
    
    if (!db) {
      console.log('❌ Firestore no está inicializado');
      return false;
    }
    
    console.log('✅ Firestore inicializado');
    
    // Importar funciones de Firestore
    const { collection, getDocs, limit, query } = await import('firebase/firestore');
    
    // Probar lectura (debería funcionar)
    console.log('🔄 Probando lectura de servicios...');
    const servicesRef = collection(db, 'services');
    const testQuery = query(servicesRef, limit(1));
    const snapshot = await getDocs(testQuery);
    
    console.log('✅ Lectura exitosa - Documentos encontrados:', snapshot.size);
    
    return true;
    
  } catch (error) {
    console.log('❌ Error en conexión a Firestore:', error);
    console.log('   - Código:', error.code);
    console.log('   - Mensaje:', error.message);
    return false;
  }
};

// 3. Probar operación de escritura
const testFirestoreWrite = async () => {
  console.log('\n3. ✍️ PROBANDO OPERACIÓN DE ESCRITURA...');
  
  try {
    const { db } = await import('./src/lib/firebase/config.js');
    const { collection, addDoc, deleteDoc, doc } = await import('firebase/firestore');
    
    // Crear documento de prueba
    console.log('🔄 Creando documento de prueba...');
    const testData = {
      name: 'Test Service - ' + Date.now(),
      category: 'test',
      description: 'Documento de prueba para verificar permisos',
      active: true,
      createdAt: new Date(),
      isTest: true
    };
    
    const docRef = await addDoc(collection(db, 'services'), testData);
    console.log('✅ Documento creado exitosamente - ID:', docRef.id);
    
    // Eliminar documento de prueba
    console.log('🔄 Eliminando documento de prueba...');
    await deleteDoc(doc(db, 'services', docRef.id));
    console.log('✅ Documento eliminado exitosamente');
    
    return true;
    
  } catch (error) {
    console.log('❌ Error en operación de escritura:', error);
    console.log('   - Código:', error.code);
    console.log('   - Mensaje:', error.message);
    
    if (error.code === 'permission-denied') {
      console.log('\n💡 DIAGNÓSTICO DEL ERROR:');
      console.log('   - Las reglas de Firestore están bloqueando la escritura');
      console.log('   - Verificar que el usuario esté autenticado correctamente');
      console.log('   - Verificar que las reglas permitan escritura para usuarios autenticados');
    }
    
    return false;
  }
};

// 4. Verificar reglas de Firestore
const checkFirestoreRules = () => {
  console.log('\n4. 📋 INFORMACIÓN SOBRE REGLAS DE FIRESTORE...');
  console.log('\nReglas actuales esperadas:');
  console.log('   - Lectura: Permitida para todos');
  console.log('   - Escritura: Solo usuarios autenticados (request.auth != null)');
  console.log('\nSi las operaciones de escritura fallan:');
  console.log('   1. Verificar que el usuario esté autenticado');
  console.log('   2. Verificar que el token de autenticación sea válido');
  console.log('   3. Verificar que las reglas de Firestore estén desplegadas');
  console.log('   4. Verificar la configuración del proyecto Firebase');
};

// 5. Ejecutar todos los diagnósticos
const runFullDiagnostic = async () => {
  console.log('🚀 INICIANDO DIAGNÓSTICO COMPLETO...');
  
  const authOk = await checkFirebaseAuth();
  const firestoreOk = await checkFirestoreConnection();
  
  if (authOk && firestoreOk) {
    await testFirestoreWrite();
  }
  
  checkFirestoreRules();
  
  console.log('\n' + '=' .repeat(50));
  console.log('🏁 DIAGNÓSTICO COMPLETADO');
  console.log('\nSi el problema persiste:');
  console.log('1. Verificar variables de entorno de Firebase');
  console.log('2. Verificar que las reglas estén desplegadas en Firebase Console');
  console.log('3. Verificar la configuración del proyecto en Firebase Console');
  console.log('4. Intentar hacer logout y login nuevamente');
};

// Ejecutar diagnóstico automáticamente
runFullDiagnostic();

// Exportar funciones para uso manual
window.debugFirestore = {
  checkAuth: checkFirebaseAuth,
  checkFirestore: checkFirestoreConnection,
  testWrite: testFirestoreWrite,
  runFull: runFullDiagnostic
};

console.log('\n💡 Funciones disponibles en window.debugFirestore:');
console.log('   - checkAuth(): Verificar autenticación');
console.log('   - checkFirestore(): Verificar conexión');
console.log('   - testWrite(): Probar escritura');
console.log('   - runFull(): Ejecutar diagnóstico completo');