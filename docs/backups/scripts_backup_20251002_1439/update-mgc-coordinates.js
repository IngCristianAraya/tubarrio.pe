require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

// Configuración de Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tubarriope-7ed1d",
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tubarriope-7ed1d"
  });
}

const db = admin.firestore();

async function updateMGCLocation() {
  try {
    console.log('🔍 Buscando servicio MGC Dental Health...');
    
    // Buscar el servicio por diferentes variaciones del nombre
    const servicesRef = db.collection('services');
    
    // Intentar diferentes búsquedas
    let snapshot = await servicesRef.where('nombre', '==', 'MGC Dental Health').get();
    
    if (snapshot.empty) {
      console.log('Intentando con "mgc-dental-health"...');
      snapshot = await servicesRef.where('nombre', '==', 'mgc-dental-health').get();
    }
    
    if (snapshot.empty) {
      console.log('Intentando buscar por ID "mgc-dental-health"...');
      const docRef = servicesRef.doc('mgc-dental-health');
      const doc = await docRef.get();
      if (doc.exists) {
        snapshot = { docs: [doc], empty: false };
      }
    }
    
    if (snapshot.empty) {
      console.log('Buscando todos los servicios que contengan "mgc" o "dental"...');
      const allServices = await servicesRef.get();
      const mgcServices = allServices.docs.filter(doc => {
        const data = doc.data();
        const nombre = (data.nombre || '').toLowerCase();
        return nombre.includes('mgc') || nombre.includes('dental');
      });
      
      if (mgcServices.length > 0) {
        console.log('Servicios encontrados con "mgc" o "dental":');
        mgcServices.forEach(doc => {
          console.log(`- ID: ${doc.id}, Nombre: ${doc.data().nombre}`);
        });
        
        // Usar el primer servicio que contenga "mgc"
        const mgcService = mgcServices.find(doc => doc.data().nombre.toLowerCase().includes('mgc'));
        if (mgcService) {
          snapshot = { docs: [mgcService], empty: false };
        }
      }
    }
    
    if (snapshot.empty) {
      console.log('❌ No se encontró ningún servicio relacionado con MGC Dental Health');
      return;
    }
    
    const doc = snapshot.docs[0];
    console.log('✅ Servicio encontrado:', doc.id, '- Nombre:', doc.data().nombre);
    
    // Datos actualizados con la dirección correcta basados en la búsqueda web
    const updatedData = {
      direccion: 'Santa Nicerata 372',
      direccion_completa: 'Santa Nicerata 372, Lima, Perú',
      coordenadas: {
        lat: -12.0432,  // Coordenadas más precisas de Lima centro
        lng: -77.0282
      },
      zona: 'Lima Centro',
      neighborhood: 'Lima Centro'
    };
    
    // Actualizar el documento
    await doc.ref.update(updatedData);
    
    console.log('✅ Servicio actualizado correctamente:');
    console.log('   📍 Nueva dirección:', updatedData.direccion_completa);
    console.log('   🗺️  Nuevas coordenadas:', updatedData.coordenadas);
    console.log('   🏘️  Nueva zona:', updatedData.zona);
    
  } catch (error) {
    console.error('❌ Error al actualizar:', error);
  } finally {
    process.exit(0);
  }
}

updateMGCLocation();