const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDhKJwjNmtRt0_Zt8xQQQQQQQQQQQQQQQQ",
  authDomain: "tubarriope-7ed1d.firebaseapp.com",
  projectId: "tubarriope-7ed1d",
  storageBucket: "tubarriope-7ed1d.appspot.com",
  messagingSenderId: "1097392406942",
  appId: "1:1097392406942:web:abc123def456ghi789"
};

async function debugBarbarinData() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    const docRef = doc(db, 'servicios', 'barbarinastore');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('=== DATOS COMPLETOS DEL SERVICIO ===');
      console.log(JSON.stringify(data, null, 2));
      
      console.log('\n=== ANÁLISIS DE CAMPOS DE UBICACIÓN ===');
      console.log('address:', JSON.stringify(data.address));
      console.log('reference:', JSON.stringify(data.reference));
      console.log('location:', JSON.stringify(data.location));
      
      console.log('\n=== VERIFICACIONES ===');
      console.log('¿Tiene address?', !!data.address);
      console.log('¿Address no está vacío?', data.address && data.address.trim() !== '');
      console.log('¿Tiene reference?', !!data.reference);
      console.log('¿Reference no es NO DEFINIDO?', data.reference !== 'NO DEFINIDO');
      console.log('¿Reference no está vacío?', data.reference && data.reference.trim() !== '');
      console.log('¿Tiene location?', !!data.location);
      
    } else {
      console.log('No se encontró el documento');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

debugBarbarinData();