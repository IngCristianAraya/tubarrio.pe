// Script para verificar el estado exacto de Firebase
// Ejecutar en la consola del navegador

console.log('🔍 === VERIFICACIÓN COMPLETA DE FIREBASE ===');

// 1. Verificar variables de entorno exactas
console.log('\n1. 📋 VARIABLES DE ENTORNO EXACTAS:');
console.log('NEXT_PUBLIC_DISABLE_FIREBASE:', `"${process.env.NEXT_PUBLIC_DISABLE_FIREBASE}"`);
console.log('Tipo:', typeof process.env.NEXT_PUBLIC_DISABLE_FIREBASE);
console.log('Es undefined:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE === undefined);
console.log('Es string "true":', process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true');
console.log('Es string "false":', process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'false');
console.log('Es string vacío:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE === '');

console.log('\nOtras variables:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Configurado' : 'No configurado');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

// 2. Verificar la condición exacta que usa el código
console.log('\n2. 🔍 EVALUACIÓN DE CONDICIONES:');
const disableFirebase = process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true';
console.log('process.env.NEXT_PUBLIC_DISABLE_FIREBASE === "true":', disableFirebase);

// 3. Verificar Firebase config
console.log('\n3. ⚙️ FIREBASE CONFIG:');
try {
  const configModule = await import('./src/lib/firebase/config');
  console.log('Config importado exitosamente');
  console.log('db:', configModule.db);
  console.log('db es null:', configModule.db === null);
  console.log('db es undefined:', configModule.db === undefined);
  console.log('!!db:', !!configModule.db);
  
  // Verificar la condición completa
  const shouldUseMock = disableFirebase || !configModule.db;
  console.log('\n🎯 CONDICIÓN FINAL:');
  console.log('disableFirebase || !db:', shouldUseMock);
  console.log('Por lo tanto, debería usar:', shouldUseMock ? 'DATOS MOCK' : 'FIREBASE');
  
} catch (error) {
  console.error('❌ Error importando config:', error);
}

// 4. Verificar getFirestoreFunctions
console.log('\n4. 🔧 VERIFICAR getFirestoreFunctions:');
try {
  // Simular la función getFirestoreFunctions del contexto
  let firestoreFunctions = null;
  
  const firestore = await import('firebase/firestore');
  firestoreFunctions = {
    collection: firestore.collection,
    getDocs: firestore.getDocs,
    getDoc: firestore.getDoc,
    doc: firestore.doc,
    query: firestore.query,
    orderBy: firestore.orderBy,
    where: firestore.where,
    limit: firestore.limit,
    startAfter: firestore.startAfter,
    onSnapshot: firestore.onSnapshot,
    DocumentSnapshot: firestore.DocumentSnapshot
  };
  
  console.log('✅ Funciones de Firestore obtenidas');
  console.log('!!firestoreFunctions:', !!firestoreFunctions);
  
  // Probar una consulta real
  const { db } = await import('./src/lib/firebase/config');
  if (db && firestoreFunctions) {
    console.log('\n🧪 PROBANDO CONSULTA REAL:');
    try {
      const servicesRef = firestoreFunctions.collection(db, 'services');
      const testQuery = firestoreFunctions.query(servicesRef, firestoreFunctions.limit(1));
      const snapshot = await firestoreFunctions.getDocs(testQuery);
      console.log('✅ Consulta exitosa! Documentos encontrados:', snapshot.size);
      
      if (snapshot.size > 0) {
        const firstDoc = snapshot.docs[0];
        console.log('Primer documento:', {
          id: firstDoc.id,
          name: firstDoc.data().name,
          category: firstDoc.data().category
        });
      }
    } catch (queryError) {
      console.error('❌ Error en consulta:', queryError);
    }
  } else {
    console.log('❌ No se puede probar consulta: db o functions no disponibles');
  }
  
} catch (error) {
  console.error('❌ Error verificando funciones:', error);
}

// 5. Verificar cache actual
console.log('\n5. 💾 CACHE ACTUAL:');
const featuredCache = localStorage.getItem('featuredServices');
const allServicesCache = localStorage.getItem('allServices');

console.log('featuredServices en localStorage:', featuredCache ? 'Presente' : 'Ausente');
console.log('allServices en localStorage:', allServicesCache ? 'Presente' : 'Ausente');

if (featuredCache) {
  try {
    const parsed = JSON.parse(featuredCache);
    console.log('Servicios destacados en cache:', parsed.length);
    if (parsed.length > 0) {
      console.log('Primer servicio en cache:', {
        id: parsed[0].id,
        name: parsed[0].name,
        category: parsed[0].category
      });
    }
  } catch (e) {
    console.log('Error parseando cache de servicios destacados');
  }
}

console.log('\n🏁 === FIN DE VERIFICACIÓN ===');
console.log('\n💡 RESUMEN:');
console.log('- Si Firebase está deshabilitado o db no está disponible, se usan datos mock');
console.log('- Si getFirestoreFunctions() retorna null, se usan datos mock');
console.log('- Si hay errores en las consultas, se hace fallback a datos mock');
console.log('\n🔍 Revisa los logs anteriores para identificar exactamente dónde está el problema.');