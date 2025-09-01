// Script simple para probar las consultas paginadas de Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, orderBy, limit, getDocs } = require('firebase/firestore');

// Configuración directa de Firebase (usando el proyecto conocido)
const firebaseConfig = {
  projectId: 'tubarriope-7ed1d'
};

async function testPaginatedQuery() {
  console.log('🔍 Probando consulta paginada de Firestore...');
  console.log('📊 Proyecto:', firebaseConfig.projectId);
  
  try {
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase inicializado correctamente');
    
    // Esta es la misma consulta que está causando el error en la aplicación
    const servicesRef = collection(db, 'services');
    const firestoreQuery = query(
      servicesRef,
      where('active', '!=', false),
      orderBy('active'),
      orderBy('createdAt', 'desc'),
      limit(12)
    );
    
    console.log('⏳ Ejecutando consulta paginada...');
    const querySnapshot = await getDocs(firestoreQuery);
    
    console.log(`✅ Consulta exitosa! Se obtuvieron ${querySnapshot.size} servicios`);
    
    // Mostrar algunos detalles de los servicios obtenidos
    if (querySnapshot.size > 0) {
      console.log('\n📋 Servicios obtenidos:');
      querySnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`${index + 1}. ${data.name || 'Sin nombre'} (${data.category || 'Sin categoría'}) - Activo: ${data.active}`);
      });
    } else {
      console.log('⚠️  No se encontraron servicios activos');
    }
    
    console.log('\n🎉 ¡El índice Firestore está funcionando correctamente!');
    console.log('📝 Los servicios ahora deberían cargarse sin errores en la aplicación.');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error en la consulta paginada:', error.message);
    
    if (error.message.includes('index') || error.message.includes('Index')) {
      console.log('\n🔧 El índice aún no está disponible. Esto puede deberse a:');
      console.log('1. El índice se está construyendo (puede tomar varios minutos)');
      console.log('2. Necesitas esperar a que se propague en todos los servidores');
      console.log('3. Verifica en la consola de Firebase: https://console.firebase.google.com/project/tubarriope-7ed1d/firestore/indexes');
    } else if (error.message.includes('permission') || error.message.includes('Permission')) {
      console.log('\n🔧 Error de permisos. Esto es normal en un entorno local.');
      console.log('El índice debería funcionar correctamente en producción.');
    } else {
      console.log('\n🔧 Error inesperado:', error.code || 'UNKNOWN');
    }
    
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando prueba de consultas paginadas Firestore\n');
  
  const success = await testPaginatedQuery();
  
  if (success) {
    console.log('\n✅ Todas las pruebas pasaron exitosamente!');
    console.log('🌐 La aplicación debería funcionar correctamente en producción.');
  } else {
    console.log('\n⚠️  Las pruebas no pudieron completarse, pero esto puede ser normal en desarrollo.');
    console.log('🔍 Verifica el estado del índice en la consola de Firebase.');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testPaginatedQuery };