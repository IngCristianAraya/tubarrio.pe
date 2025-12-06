// Script para importar servicios usando Firebase Web SDK (cliente)
// Este script se ejecuta en el navegador y usa las credenciales del cliente

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, setDoc, doc } from 'firebase/firestore';
import servicesData from './services.json' assert { type: 'json' };

// Función para generar slug desde el nombre
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50)
    .replace(/-+$/, '');
}

// Función para generar slug único
function generateUniqueSlug(baseSlug, existingSlugs) {
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

// Configuración de Firebase (usando variables de entorno)
const firebaseConfig = {
  apiKey: "AIzaSyCyUy8zFbyy0VwYVUZo9TnfDMoMU3eqAUI",
  authDomain: "tubarriope-7ed1d.firebaseapp.com",
  projectId: "tubarriope-7ed1d",
  storageBucket: "tubarriope-7ed1d.appspot.com",
  messagingSenderId: "1097392406942",
  appId: "1:1097392406942:web:aa206fa1542c74c235568f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importServices() {
  try {
    console.log('🚀 Iniciando importación de servicios...');
    
    // Verificar si ya existen servicios
    const existingServices = await getDocs(collection(db, 'services'));
    console.log(`📊 Servicios existentes en Firestore: ${existingServices.size}`);
    
    if (existingServices.size > 0) {
      console.log('⚠️  Ya existen servicios en Firestore. ¿Deseas continuar? (Esto agregará más servicios)');
      if (!confirm('¿Continuar con la importación?')) {
        return;
      }
    }
    
    console.log(`📝 Importando ${servicesData.length} servicios...`);
    
    // Obtener todos los servicios existentes para verificar slugs únicos
    const existingServices = await getDocs(collection(db, 'services'));
    const existingSlugs = existingServices.docs.map(doc => doc.id);
    
    let imported = 0;
    let errors = 0;
    
    for (const service of servicesData) {
      try {
        // Generar slug único basado en el nombre
        const baseSlug = generateSlug(service.name);
        const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
        
        // Agregar el nuevo slug a la lista para evitar duplicados en esta sesión
        existingSlugs.push(uniqueSlug);
        
        // Preparar datos del servicio
        const serviceData = {
          name: service.name,
          category: service.category,
          image: service.image || '/images/placeholder.jpg',
          rating: service.rating || 0,
          location: service.location || '',
          description: service.description || '',
          contactUrl: service.contactUrl || '',
          detailsUrl: service.detailsUrl || '',
          hours: service.horario || service.hours || '',
          whatsapp: service.whatsapp || '',
          tags: service.tags || [],
          plan: service.plan || 'básico',
          images: service.images || [service.image || '/images/placeholder.jpg'],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Guardar servicio con ID personalizado (slug)
        await setDoc(doc(db, 'services', uniqueSlug), serviceData);
        console.log(`✅ Importado: ${service.name} (ID: ${uniqueSlug})`);
        imported++;
        
      } catch (error) {
        console.error(`❌ Error importando ${service.name}:`, error);
        errors++;
      }
    }
    
    console.log(`\n🎉 Importación completada!`);
    console.log(`✅ Servicios importados: ${imported}`);
    console.log(`❌ Errores: ${errors}`);
    
    // Verificar servicios finales
    const finalServices = await getDocs(collection(db, 'services'));
    console.log(`📊 Total de servicios en Firestore: ${finalServices.size}`);
    
  } catch (error) {
    console.error('💥 Error durante la importación:', error);
  }
}

// Ejecutar importación
importServices();

// También exportar la función para uso manual
window.importServices = importServices;
console.log('💡 Puedes ejecutar importServices() manualmente desde la consola del navegador');