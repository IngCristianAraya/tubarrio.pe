// Script para crear un servicio de prueba real en Firebase
require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function createTestService() {
  try {
    console.log('🔧 Creando servicio de prueba en Firebase...');
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Datos del servicio de prueba con problemas específicos
    const testServiceData = {
      name: 'Servicio de Prueba',
      category: 'Restaurantes',
      description: 'Este es un servicio de prueba para verificar problemas de imagen y dirección',
      
      // PROBLEMA 1: Imagen inválida
      image: 'none', // Imagen inválida que causará problemas
      images: ['none', 'invalid-url'], // Array de imágenes inválidas
      
      // PROBLEMA 2: Dirección duplicada
      address: 'Av. Principal 123, Lima', // Dirección principal
      reference: 'Av. Principal 123, Lima', // Referencia igual a la dirección (problema)
      location: 'Av. Principal 123, Lima', // Location también igual
      
      // Otros datos
      phone: '+51987654321',
      whatsapp: '+51987654321',
      rating: 4.5,
      reviewCount: 10,
      horario: 'Lun-Dom 9:00-18:00',
      contactUrl: 'https://wa.me/51987654321',
      detailsUrl: '/servicio/servicio-de-prueba',
      tags: ['prueba', 'test', 'restaurante'],
      plan: 'basic',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Crear el documento en Firebase
    const serviceRef = doc(db, 'services', 'servicio-de-prueba');
    await setDoc(serviceRef, testServiceData);
    
    console.log('✅ Servicio de prueba creado exitosamente!');
    console.log('📋 Datos del servicio:');
    console.log('  - ID: servicio-de-prueba');
    console.log('  - Nombre:', testServiceData.name);
    console.log('  - Imagen:', testServiceData.image);
    console.log('  - Imágenes:', testServiceData.images);
    console.log('  - Dirección:', testServiceData.address);
    console.log('  - Referencia:', testServiceData.reference);
    console.log('  - Location:', testServiceData.location);
    console.log('\n🔗 URL para probar: https://www.tubarrio.pe/servicio/servicio-de-prueba');
    console.log('🔗 URL local: http://localhost:3000/servicio/servicio-de-prueba');
    
    // Crear también un servicio con datos correctos para comparar
    const correctServiceData = {
      name: 'Servicio Correcto',
      category: 'Panaderías',
      description: 'Este servicio tiene datos correctos para comparación',
      
      // Imagen válida
      image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg',
      images: [
        'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg',
        'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg'
      ],
      
      // Dirección y referencia diferentes
      address: 'Jr. Los Panes 456, Lima',
      reference: 'Frente al parque central',
      location: 'Jr. Los Panes 456, Lima',
      
      phone: '+51912345678',
      whatsapp: '+51912345678',
      rating: 4.8,
      reviewCount: 25,
      horario: 'Lun-Dom 6:00-20:00',
      contactUrl: 'https://wa.me/51912345678',
      detailsUrl: '/servicio/servicio-correcto',
      tags: ['panadería', 'correcto', 'test'],
      plan: 'premium',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const correctServiceRef = doc(db, 'services', 'servicio-correcto');
    await setDoc(correctServiceRef, correctServiceData);
    
    console.log('\n✅ Servicio correcto creado para comparación!');
    console.log('🔗 URL: http://localhost:3000/servicio/servicio-correcto');
    
  } catch (error) {
    console.error('❌ Error creando servicio de prueba:', error.message);
  }
}

createTestService();