// Script para crear un servicio de prueba con address y reference
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJqJ5F5F5F5F5F5F5F5F5F5F5F5F5F5F5",
  authDomain: "tubarriope-7ed1d.firebaseapp.com",
  projectId: "tubarriope-7ed1d",
  storageBucket: "tubarriope-7ed1d.appspot.com",
  messagingSenderId: "1097392406942"
};

async function createTestService() {
  try {
    console.log('Creando servicio de prueba...');
    
    const testService = {
      name: "Panadería El Buen Pan",
      category: "Panaderías",
      description: "Panadería artesanal con productos frescos todos los días. Especialidad en panes integrales y postres caseros.",
      phone: "+51 999 123 456",
      whatsapp: "+51 999 123 456",
      address: "Av. Los Rosales 123",
      reference: "Frente al parque central, al lado de la farmacia",
      location: "Av. Los Rosales 123, frente al parque central",
      horario: "Lunes a Sábado: 6:00 AM - 8:00 PM, Domingos: 7:00 AM - 6:00 PM",
      contactUrl: "https://wa.me/51999123456",
      detailsUrl: "",
      images: [
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500"
      ],
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
      active: true,
      rating: 4.5,
      tags: ["panadería", "artesanal", "postres", "integral"],
      plan: "basic",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Usar un ID único para el servicio de prueba
    const serviceId = "panaderia-el-buen-pan-test";
    
    console.log('Servicio de prueba creado con ID:', serviceId);
    console.log('Dirección:', testService.address);
    console.log('Referencia:', testService.reference);
    console.log('\nPuedes verlo en: http://localhost:3000/servicio/' + serviceId);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTestService();