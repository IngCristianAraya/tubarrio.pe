// Test simple de conectividad con Firebase
require('dotenv').config({ path: '.env.local' });

// Verificar variables de entorno
console.log('🔍 Verificando variables de entorno...');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Configurado' : '❌ Faltante');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Configurado' : '❌ Faltante');
console.log('NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Configurado' : '❌ Faltante');

// Test de conectividad básica usando fetch
async function testFirebaseConnectivity() {
  try {
    console.log('\n🌐 Probando conectividad básica con Firebase...');
    
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tubarriope-7ed1d';
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    
    if (!apiKey) {
      throw new Error('API Key no configurada');
    }
    
    // Test en ambas colecciones
    const collections = ['servicios', 'services'];
    
    for (const collection of collections) {
      console.log(`\n📂 Verificando colección: ${collection}`);
      const testUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}?key=${apiKey}`;
      
      console.log('📡 Realizando petición HTTP a Firestore...');
      const response = await fetch(testUrl);
      
      console.log('📊 Status de respuesta:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Conectividad exitosa!');
        console.log('📄 Documentos encontrados:', data.documents ? data.documents.length : 0);
        
        if (data.documents && data.documents.length > 0) {
          console.log(`\n📋 Primeros documentos en ${collection}:`);
          data.documents.slice(0, 3).forEach((doc, index) => {
            const docId = doc.name.split('/').pop();
            const fields = doc.fields || {};
            const name = fields.name?.stringValue || 'Sin nombre';
            const active = fields.active?.booleanValue;
            console.log(`  ${index + 1}. ${docId}: ${name} (activo: ${active})`);
          });
        } else {
          console.log(`❌ No se encontraron documentos en ${collection}`);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Error en la respuesta:', response.status, response.statusText);
        console.error('📄 Contenido del error:', errorText);
      }
    }
    
  } catch (error) {
    console.error('💥 Error durante la prueba:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('💡 Sugerencia: Problema de conectividad de red');
    } else if (error.message.includes('API')) {
      console.log('💡 Sugerencia: Verifica la configuración de la API Key');
    }
  }
}

// Ejecutar la prueba
testFirebaseConnectivity().then(() => {
  console.log('\n🏁 Prueba finalizada');
}).catch((error) => {
  console.error('💥 Error fatal:', error);
});