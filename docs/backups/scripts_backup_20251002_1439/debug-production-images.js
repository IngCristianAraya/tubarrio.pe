const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config({ path: '.env.local' });

// Configuración de Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'tubarriope-7ed1d',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@tubarriope-7ed1d.iam.gserviceaccount.com',
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

console.log('🔧 Inicializando Firebase Admin para debug detallado...');

const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.projectId
});

const db = getFirestore(app);

async function debugProductionImages() {
  try {
    console.log('🔍 Analizando TODOS los servicios en detalle...');
    
    const servicesRef = db.collection('services');
    const querySnapshot = await servicesRef.get();
    
    console.log(`📊 Total de servicios encontrados: ${querySnapshot.size}`);
    console.log('\n🔍 Análisis detallado de cada servicio:\n');
    
    let serviceCount = 0;
    let suspiciousUrls = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const serviceId = doc.id;
      serviceCount++;
      
      console.log(`\n--- Servicio ${serviceCount}: ${data.name || 'Sin nombre'} (${serviceId}) ---`);
      console.log(`Estado: ${data.active ? 'Activo' : 'Inactivo'}`);
      
      // Analizar image principal
      if (data.image !== undefined) {
        console.log(`image: "${data.image}" (tipo: ${typeof data.image})`);
        
        if (data.image === null) {
          console.log('  ⚠️  image es null');
          suspiciousUrls.push({ service: data.name, field: 'image', value: 'null', id: serviceId });
        } else if (data.image === '') {
          console.log('  ⚠️  image es string vacío');
          suspiciousUrls.push({ service: data.name, field: 'image', value: 'empty string', id: serviceId });
        } else if (typeof data.image === 'string') {
          if (data.image.length === 1) {
            console.log(`  🚨 image es un solo carácter: "${data.image}"`);
            suspiciousUrls.push({ service: data.name, field: 'image', value: data.image, id: serviceId });
          } else if (data.image.startsWith('h') && !data.image.startsWith('http')) {
            console.log(`  🚨 image empieza con 'h' pero no es http: "${data.image}"`);
            suspiciousUrls.push({ service: data.name, field: 'image', value: data.image, id: serviceId });
          } else if (!data.image.startsWith('/') && !data.image.startsWith('http')) {
            console.log(`  ⚠️  image no empieza con / ni http: "${data.image}"`);
            suspiciousUrls.push({ service: data.name, field: 'image', value: data.image, id: serviceId });
          }
        }
      } else {
        console.log('image: undefined');
        suspiciousUrls.push({ service: data.name, field: 'image', value: 'undefined', id: serviceId });
      }
      
      // Analizar images array
      if (data.images !== undefined) {
        console.log(`images: ${JSON.stringify(data.images)} (tipo: ${typeof data.images})`);
        
        if (Array.isArray(data.images)) {
          data.images.forEach((img, index) => {
            if (img === null) {
              console.log(`  ⚠️  images[${index}] es null`);
              suspiciousUrls.push({ service: data.name, field: `images[${index}]`, value: 'null', id: serviceId });
            } else if (img === '') {
              console.log(`  ⚠️  images[${index}] es string vacío`);
              suspiciousUrls.push({ service: data.name, field: `images[${index}]`, value: 'empty string', id: serviceId });
            } else if (typeof img === 'string') {
              if (img.length === 1) {
                console.log(`  🚨 images[${index}] es un solo carácter: "${img}"`);
                suspiciousUrls.push({ service: data.name, field: `images[${index}]`, value: img, id: serviceId });
              } else if (img.startsWith('h') && !img.startsWith('http')) {
                console.log(`  🚨 images[${index}] empieza con 'h' pero no es http: "${img}"`);
                suspiciousUrls.push({ service: data.name, field: `images[${index}]`, value: img, id: serviceId });
              }
            }
          });
        } else if (data.images !== null) {
          console.log(`  ⚠️  images no es array: ${typeof data.images}`);
          suspiciousUrls.push({ service: data.name, field: 'images', value: `not array: ${typeof data.images}`, id: serviceId });
        }
      } else {
        console.log('images: undefined');
      }
      
      // Verificar otros campos que podrían tener imágenes
      ['logo', 'thumbnail', 'banner', 'avatar'].forEach(field => {
        if (data[field] !== undefined) {
          console.log(`${field}: "${data[field]}"`);
          if (typeof data[field] === 'string' && data[field].startsWith('h') && !data[field].startsWith('http')) {
            console.log(`  🚨 ${field} empieza con 'h' pero no es http: "${data[field]}"`);
            suspiciousUrls.push({ service: data.name, field: field, value: data[field], id: serviceId });
          }
        }
      });
    });
    
    console.log('\n\n🚨 RESUMEN DE URLs SOSPECHOSAS:');
    console.log(`Total encontradas: ${suspiciousUrls.length}`);
    
    if (suspiciousUrls.length > 0) {
      console.log('\nDetalles:');
      suspiciousUrls.forEach((item, index) => {
        console.log(`${index + 1}. Servicio: "${item.service}" (${item.id})`);
        console.log(`   Campo: ${item.field}`);
        console.log(`   Valor: "${item.value}"`);
        console.log('');
      });
      
      // Generar script de corrección
      console.log('\n🔧 Script de corrección sugerido:');
      console.log('const fixes = [');
      suspiciousUrls.forEach(item => {
        console.log(`  { id: "${item.id}", field: "${item.field}", currentValue: "${item.value}" },`);
      });
      console.log('];');
    } else {
      console.log('✅ No se encontraron URLs sospechosas');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar debug
debugProductionImages()
  .then(() => {
    console.log('\n🏁 Debug completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });