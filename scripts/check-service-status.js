// Script para verificar el estado de los servicios en Firestore
const { initializeApp, getApps, getApp } = require('@firebase/app');
const { getFirestore, collection, getDocs } = require('@firebase/firestore');
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

async function checkServiceStatus() {
  try {
    console.log('Consultando servicios en Firestore...');
    
    const servicesCollection = collection(db, 'services');
    const querySnapshot = await getDocs(servicesCollection);
    
    console.log(`\nEncontrados ${querySnapshot.docs.length} servicios:\n`);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const status = data.active === false ? '❌ INACTIVO' : '✅ ACTIVO';
      console.log(`${status} - ${data.name || doc.id} (active: ${data.active})`);
    });
    
    console.log('\n=== RESUMEN ===');
    const activeServices = querySnapshot.docs.filter(doc => doc.data().active !== false);
    const inactiveServices = querySnapshot.docs.filter(doc => doc.data().active === false);
    
    console.log(`Servicios activos: ${activeServices.length}`);
    console.log(`Servicios inactivos: ${inactiveServices.length}`);
    console.log(`Total: ${querySnapshot.docs.length}`);
    
  } catch (error) {
    console.error('Error al consultar servicios:', error);
  }
}

// Ejecutar la función
checkServiceStatus();