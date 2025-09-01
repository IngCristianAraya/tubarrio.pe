// Script para probar la conexión de Firebase y verificar datos
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, limit, addDoc } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCyUy8zFbyy0VwYVUZo9TnfDMoMU3eqAUI",
  authDomain: "tubarriope-7ed1d.firebaseapp.com",
  projectId: "tubarriope-7ed1d",
  storageBucket: "tubarriope-7ed1d.appspot.com",
  messagingSenderId: "1097392406942",
  appId: "1:1097392406942:web:aa206fa1542c74c235568f"
};

async function testFirebaseConnection() {
  try {
    console.log('🔥 Probando conexión a Firebase...');
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app inicializada');
    
    // Inicializar Firestore
    const db = getFirestore(app);
    console.log('✅ Firestore inicializado');
    
    // Probar consulta a la colección de servicios
    console.log('📊 Probando consulta a la colección "services"...');
    const servicesRef = collection(db, 'services');
    const q = query(servicesRef, limit(10));
    const querySnapshot = await getDocs(q);
    
    console.log(`✅ Consulta exitosa: ${querySnapshot.docs.length} servicios encontrados`);
    
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach((doc, index) => {
        const data = doc.data();
        console.log(`  ${index + 1}. ID: ${doc.id}`);
        console.log(`     Nombre: ${data.name || 'Sin nombre'}`);
        console.log(`     Categoría: ${data.category || 'Sin categoría'}`);
        console.log(`     Activo: ${data.active !== false ? 'Sí' : 'No'}`);
        console.log(`     Rating: ${data.rating || 'N/A'}`);
        console.log('     ---');
      });
    } else {
      console.log('⚠️  No se encontraron servicios en la colección "services"');
      console.log('💡 Esto significa que la base de datos está vacía o los datos están en otra colección.');
      
      // Intentar agregar un servicio de prueba
      console.log('🔧 Intentando agregar un servicio de prueba...');
      try {
        const testService = {
          name: 'Servicio de Prueba',
          category: 'Prueba',
          description: 'Este es un servicio de prueba para verificar la conexión',
          image: '/images/hero_001.webp',
          rating: 4.5,
          location: 'Lima, Perú',
          contactUrl: '#',
          detailsUrl: '#',
          hours: 'Lun-Dom 9:00 AM - 6:00 PM',
          whatsapp: '+51999999999',
          tags: ['prueba', 'test'],
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const docRef = await addDoc(servicesRef, testService);
        console.log('✅ Servicio de prueba agregado con ID:', docRef.id);
        
        // Verificar que se agregó correctamente
        const newQuery = query(servicesRef, limit(1));
        const newSnapshot = await getDocs(newQuery);
        console.log(`✅ Verificación: ${newSnapshot.docs.length} servicios encontrados después de agregar`);
        
      } catch (addError) {
        console.error('❌ Error al agregar servicio de prueba:', addError);
        if (addError.code === 'permission-denied') {
          console.log('💡 Problema de permisos - verifica las reglas de Firestore para escritura');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error al conectar con Firebase:', error);
    
    if (error.code === 'permission-denied') {
      console.log('💡 Problema de permisos - verifica las reglas de Firestore');
    } else if (error.code === 'unavailable') {
      console.log('💡 Servicio no disponible - verifica la conexión a internet');
    } else if (error.code === 'unauthenticated') {
      console.log('💡 No autenticado - verifica la configuración de Firebase');
    }
  }
}

testFirebaseConnection();