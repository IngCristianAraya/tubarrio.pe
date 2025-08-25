// Script para verificar el servicio BarbarinaStore en Firestore
const { initializeApp, getApps, getApp } = require('@firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('@firebase/firestore');
require('dotenv').config({ path: '.env.local' });

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tubarriope-7ed1d',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(firebaseApp);

async function checkBarbarinaStore() {
  try {
    console.log('Buscando servicio BarbarinaStore...');
    
    const servicesCollection = collection(db, 'services');
    const querySnapshot = await getDocs(servicesCollection);
    
    let found = false;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.name && data.name.toLowerCase().includes('barbarina')) {
        found = true;
        console.log('\n=== SERVICIO ENCONTRADO ===');
        console.log('ID del documento:', doc.id);
        console.log('Nombre:', data.name);
        console.log('Address:', data.address || 'NO DEFINIDO');
        console.log('Reference:', data.reference || 'NO DEFINIDO');
        console.log('Location:', data.location || 'NO DEFINIDO');
        console.log('Descripción:', data.description || 'NO DEFINIDO');
        console.log('\n=== TODOS LOS CAMPOS ===');
        Object.keys(data).forEach(key => {
          console.log(`${key}:`, data[key]);
        });
      }
    });
    
    if (!found) {
      console.log('❌ No se encontró ningún servicio con "barbarina" en el nombre');
    }
    
  } catch (error) {
    console.error('Error al consultar servicios:', error);
  }
}

// Ejecutar la función
checkBarbarinaStore();