const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config({ path: '.env.local' });

// Configuración de Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'tubarriope-7ed1d',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@tubarriope-7ed1d.iam.gserviceaccount.com',
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

console.log('🔧 Inicializando Firebase Admin...');
console.log('Project ID:', serviceAccount.projectId);
console.log('Client Email:', serviceAccount.clientEmail);
console.log('Private Key exists:', !!serviceAccount.privateKey);

const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.projectId
});

const db = getFirestore(app);

async function validateAndFixImageUrls() {
  try {
    console.log('🔍 Buscando servicios con URLs de imágenes inválidas...');
    
    const servicesRef = db.collection('services');
    const querySnapshot = await servicesRef.get();
    
    const invalidServices = [];
    const fixes = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const serviceId = doc.id;
      let hasInvalidImages = false;
      
      // Verificar image principal
      if (data.image && typeof data.image === 'string') {
        if (data.image.startsWith('h') && !data.image.startsWith('http')) {
          console.log(`🚨 Servicio "${data.name}" (${serviceId}) tiene image inválida: "${data.image}"`);
          invalidServices.push({
            id: serviceId,
            name: data.name,
            field: 'image',
            invalidValue: data.image
          });
          hasInvalidImages = true;
        }
      }
      
      // Verificar images array
      if (data.images && Array.isArray(data.images)) {
        data.images.forEach((img, index) => {
          if (img && typeof img === 'string') {
            if (img.startsWith('h') && !img.startsWith('http')) {
              console.log(`🚨 Servicio "${data.name}" (${serviceId}) tiene images[${index}] inválida: "${img}"`);
              invalidServices.push({
                id: serviceId,
                name: data.name,
                field: `images[${index}]`,
                invalidValue: img
              });
              hasInvalidImages = true;
            }
          }
        });
      }
      
      // Si hay imágenes inválidas, preparar corrección
      if (hasInvalidImages) {
        const fixData = {};
        
        // Corregir image principal si es inválida
        if (data.image && data.image.startsWith('h') && !data.image.startsWith('http')) {
          // Intentar completar la URL si parece ser una URL incompleta
          if (data.image.startsWith('h')) {
            fixData.image = data.image.startsWith('https://') ? data.image : 
                           data.image.startsWith('http://') ? data.image :
                           '/images/placeholder-service.jpg'; // Usar placeholder por defecto
          }
        }
        
        // Corregir images array
        if (data.images && Array.isArray(data.images)) {
          const cleanImages = data.images.filter(img => {
            if (!img || typeof img !== 'string') return false;
            if (img.startsWith('h') && !img.startsWith('http')) return false;
            return true;
          });
          
          // Si no quedan imágenes válidas, usar placeholder
          if (cleanImages.length === 0) {
            cleanImages.push('/images/placeholder-service.jpg');
          }
          
          fixData.images = cleanImages;
        }
        
        fixes.push({
          id: serviceId,
          name: data.name,
          updates: fixData
        });
      }
    });
    
    console.log(`\n📊 Resumen:`);
    console.log(`- Total de servicios: ${querySnapshot.size}`);
    console.log(`- Servicios con imágenes inválidas: ${invalidServices.length}`);
    console.log(`- Correcciones preparadas: ${fixes.length}`);
    
    if (invalidServices.length > 0) {
      console.log('\n🚨 URLs de imágenes inválidas encontradas:');
      invalidServices.forEach(item => {
        console.log(`- ${item.name} (${item.id}): ${item.field} = "${item.invalidValue}"`);
      });
      
      console.log('\n🔧 ¿Deseas aplicar las correcciones? (ejecuta con --fix para aplicar)');
      
      if (process.argv.includes('--fix')) {
        console.log('\n⚡ Aplicando correcciones...');
        
        for (const fix of fixes) {
          try {
            await servicesRef.doc(fix.id).update(fix.updates);
            console.log(`✅ Corregido: ${fix.name} (${fix.id})`);
          } catch (error) {
            console.error(`❌ Error al corregir ${fix.name} (${fix.id}):`, error.message);
          }
        }
        
        console.log('\n🎉 Correcciones aplicadas!');
      } else {
        console.log('\n💡 Para aplicar las correcciones, ejecuta: node validate-firebase-images.js --fix');
      }
    } else {
      console.log('\n✅ No se encontraron URLs de imágenes inválidas');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar validación
validateAndFixImageUrls()
  .then(() => {
    console.log('\n🏁 Validación completada');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });