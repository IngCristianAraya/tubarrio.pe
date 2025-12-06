// Script para actualizar el campo reference del servicio BarbarinaStore
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, getDoc } = require('firebase/firestore');

// Configuración de Firebase (usando las mismas credenciales del proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyDJqJ5F5F5F5F5F5F5F5F5F5F5F5F5F5F5", // Placeholder - se usará la del entorno
  authDomain: "tubarriope-7ed1d.firebaseapp.com",
  projectId: "tubarriope-7ed1d",
  storageBucket: "tubarriope-7ed1d.appspot.com",
  messagingSenderId: "1097392406942"
};

async function updateBarbarinaReference() {
  try {
    console.log('Inicializando Firebase...');
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('Actualizando el campo reference del servicio BarbarinaStore...');
    
    const serviceRef = doc(db, 'services', 'barbarinastore');
    
    await updateDoc(serviceRef, {
      reference: 'Cerca de la Parroquia El Buen Remedio'
    });
    
    console.log('✅ Campo reference actualizado exitosamente');
    
    // Verificar la actualización
    const updatedDoc = await getDoc(serviceRef);
    const data = updatedDoc.data();
    
    console.log('\n📋 Datos actualizados del servicio:');
    console.log('ID:', updatedDoc.id);
    console.log('Nombre:', data.name);
    console.log('Dirección:', data.address);
    console.log('Referencia:', data.reference);
    console.log('Ubicación:', data.location);
    
  } catch (error) {
    console.error('❌ Error al actualizar el servicio:', error);
  }
}

updateBarbarinaReference();