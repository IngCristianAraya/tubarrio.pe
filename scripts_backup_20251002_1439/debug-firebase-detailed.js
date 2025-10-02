// Script de depuración detallada para Firebase
// Ejecutar en la consola del navegador

console.log('🔍 === DEPURACIÓN DETALLADA DE FIREBASE ===');

// 1. Verificar variables de entorno
console.log('\n1. 📋 VARIABLES DE ENTORNO:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Configurado' : 'No configurado');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log('NEXT_PUBLIC_DISABLE_FIREBASE:', process.env.NEXT_PUBLIC_DISABLE_FIREBASE);

// 2. Verificar módulos de Firebase
console.log('\n2. 🔥 MÓDULOS DE FIREBASE:');
try {
  const firebaseApp = await import('firebase/app');
  console.log('✅ firebase/app importado:', Object.keys(firebaseApp));
} catch (error) {
  console.error('❌ Error importando firebase/app:', error);
}

try {
  const firestore = await import('firebase/firestore');
  console.log('✅ firebase/firestore importado:', Object.keys(firestore).slice(0, 10), '...');
} catch (error) {
  console.error('❌ Error importando firebase/firestore:', error);
}

// 3. Verificar configuración de Firebase
console.log('\n3. ⚙️ CONFIGURACIÓN DE FIREBASE:');
try {
  const { db } = await import('./src/lib/firebase/config');
  console.log('db desde config:', db);
  console.log('tipo de db:', typeof db);
  console.log('db es null:', db === null);
  console.log('db es undefined:', db === undefined);
  
  if (db) {
    console.log('✅ Firebase db disponible');
    console.log('db.app:', db.app);
    console.log('db._delegate:', db._delegate);
  } else {
    console.log('❌ Firebase db no disponible');
  }
} catch (error) {
  console.error('❌ Error importando config:', error);
}

// 4. Probar funciones de Firestore dinámicamente
console.log('\n4. 🔧 FUNCIONES DE FIRESTORE:');
try {
  const firestore = await import('firebase/firestore');
  const firestoreFunctions = {
    collection: firestore.collection,
    getDocs: firestore.getDocs,
    query: firestore.query,
    orderBy: firestore.orderBy,
    limit: firestore.limit
  };
  
  console.log('✅ Funciones de Firestore obtenidas:');
  Object.keys(firestoreFunctions).forEach(key => {
    console.log(`  ${key}:`, typeof firestoreFunctions[key]);
  });
  
  // Probar una consulta simple
  const { db } = await import('./src/lib/firebase/config');
  if (db && firestoreFunctions.collection) {
    console.log('\n🧪 PROBANDO CONSULTA:');
    try {
      const servicesRef = firestoreFunctions.collection(db, 'services');
      console.log('✅ Referencia a colección creada:', servicesRef);
      
      const query = firestoreFunctions.query(
        servicesRef,
        firestoreFunctions.limit(1)
      );
      console.log('✅ Query creada:', query);
      
      const snapshot = await firestoreFunctions.getDocs(query);
      console.log('✅ Consulta ejecutada. Documentos:', snapshot.size);
      
      if (snapshot.size > 0) {
        const firstDoc = snapshot.docs[0];
        console.log('✅ Primer documento:', {
          id: firstDoc.id,
          data: firstDoc.data()
        });
      }
    } catch (queryError) {
      console.error('❌ Error en consulta:', queryError);
    }
  }
} catch (error) {
  console.error('❌ Error obteniendo funciones de Firestore:', error);
}

// 5. Verificar contexto de servicios
console.log('\n5. 📦 CONTEXTO DE SERVICIOS:');
try {
  // Verificar si el contexto está disponible
  const contextElement = document.querySelector('[data-services-context]');
  if (contextElement) {
    console.log('✅ Elemento del contexto encontrado');
  } else {
    console.log('❌ Elemento del contexto no encontrado');
  }
  
  // Verificar localStorage
  const featuredCache = localStorage.getItem('featuredServices');
  const allServicesCache = localStorage.getItem('allServices');
  
  console.log('Cache localStorage:');
  console.log('  featuredServices:', featuredCache ? 'Presente' : 'Ausente');
  console.log('  allServices:', allServicesCache ? 'Presente' : 'Ausente');
  
  if (featuredCache) {
    try {
      const parsed = JSON.parse(featuredCache);
      console.log('  featuredServices count:', parsed.length);
    } catch (e) {
      console.log('  featuredServices: Error parsing');
    }
  }
  
} catch (error) {
  console.error('❌ Error verificando contexto:', error);
}

console.log('\n🏁 === FIN DE DEPURACIÓN ===');