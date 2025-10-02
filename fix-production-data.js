const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config({ path: '.env.local' });

// Configuración de Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'tubarriope-7ed1d',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@tubarriope-7ed1d.iam.gserviceaccount.com',
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

console.log('🔧 Inicializando Firebase Admin para correcciones...');

const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.projectId
});

const db = getFirestore(app);

async function fixProductionData() {
  try {
    console.log('🔧 Aplicando correcciones a los datos problemáticos...');
    
    const fixes = [
      { 
        id: "mercado-don-pedrito", 
        field: "images", 
        currentValue: "not array: string",
        action: "convert_string_to_array"
      },
      { 
        id: "mgc-dental-health", 
        field: "image", 
        currentValue: "undefined",
        action: "set_default_image"
      },
    ];
    
    for (const fix of fixes) {
      console.log(`\n🔧 Corrigiendo servicio: ${fix.id}`);
      console.log(`   Campo: ${fix.field}`);
      console.log(`   Problema: ${fix.currentValue}`);
      
      try {
        const docRef = db.collection('services').doc(fix.id);
        const doc = await docRef.get();
        
        if (!doc.exists) {
          console.log(`   ❌ Servicio ${fix.id} no encontrado`);
          continue;
        }
        
        const data = doc.data();
        const updates = {};
        
        if (fix.action === "convert_string_to_array") {
          // Convertir string a array
          if (typeof data.images === 'string') {
            updates.images = [data.images]; // Convertir string a array con un elemento
            console.log(`   ✅ Convirtiendo images de string a array: ["${data.images}"]`);
          }
        } else if (fix.action === "set_default_image") {
          // Establecer imagen por defecto
          updates.image = '/images/placeholder-service.jpg';
          console.log(`   ✅ Estableciendo imagen por defecto: ${updates.image}`);
        }
        
        if (Object.keys(updates).length > 0) {
          await docRef.update(updates);
          console.log(`   ✅ Corrección aplicada exitosamente`);
        } else {
          console.log(`   ℹ️  No se requieren cambios`);
        }
        
      } catch (error) {
        console.error(`   ❌ Error al corregir ${fix.id}:`, error.message);
      }
    }
    
    console.log('\n🎉 Todas las correcciones han sido aplicadas!');
    console.log('\n📋 Resumen de cambios:');
    console.log('1. "Mercado Don Pedrito": images convertido de string a array');
    console.log('2. "Mgc Dental Health": image establecido con valor por defecto');
    
    console.log('\n💡 Estos cambios deberían resolver el error de Next.js Image en producción.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar correcciones
fixProductionData()
  .then(() => {
    console.log('\n🏁 Correcciones completadas');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });