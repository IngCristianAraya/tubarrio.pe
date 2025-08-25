// Script simple para actualizar las imágenes de la panadería
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updatePanaderiaImages() {
  try {
    console.log('Actualizando imágenes de Panadería El Molinos...');
    
    const images = [
      '/images/panaderia-el-molinos/panaderia_molino_2.webp',
      '/images/panaderia-el-molinos/panaderia_molino_3.webp',
      '/images/panaderia-el-molinos/panaderia_molino_4.webp',
      '/images/panaderia-el-molinos/panaderia_molino_5.webp'
    ];
    
    const serviceRef = doc(db, 'services', 'panaderia-el-molinos');
    
    await updateDoc(serviceRef, {
      image: images[0], // Primera imagen como imagen principal
      images: images    // Array completo de imágenes
    });
    
    console.log('✅ Imágenes actualizadas correctamente');
    console.log('Imagen principal:', images[0]);
    console.log('Total de imágenes:', images.length);
    
  } catch (error) {
    console.error('❌ Error al actualizar:', error);
  }
}

updateImages();

// Función alternativa con nombre correcto
async function updateImages() {
  await updatePanaderiaImages();
}