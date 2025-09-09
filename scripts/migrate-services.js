/**
 * Script de migración para actualizar servicios existentes
 * Agrega campos faltantes: barrio, category, type, rating, etc.
 * 
 * Uso: node scripts/migrate-services.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase Admin
if (!admin.apps.length) {
  // Asegúrate de tener el archivo de credenciales en la ruta correcta
  const serviceAccount = require('../firebase-admin-key.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Reemplaza con tu project ID
    projectId: 'tu-project-id'
  });
}

const db = admin.firestore();

// Mapeo de categorías basado en nombres o palabras clave
const categorizarServicio = (nombre, descripcion = '') => {
  const texto = `${nombre} ${descripcion}`.toLowerCase();
  
  if (texto.includes('peluquer') || texto.includes('salon') || texto.includes('belleza') || texto.includes('corte')) {
    return 'Peluquería';
  }
  if (texto.includes('abarrote') || texto.includes('bodega') || texto.includes('minimarket') || texto.includes('tienda')) {
    return 'Abarrotes';
  }
  if (texto.includes('veterinar') || texto.includes('mascota') || texto.includes('animal') || texto.includes('pet')) {
    return 'Veterinaria';
  }
  if (texto.includes('inmueble') || texto.includes('alquiler') || texto.includes('venta') || texto.includes('casa') || texto.includes('departamento')) {
    return 'Inmuebles';
  }
  if (texto.includes('restaurant') || texto.includes('comida') || texto.includes('cocina') || texto.includes('chef')) {
    return 'Restaurante';
  }
  if (texto.includes('tecnolog') || texto.includes('software') || texto.includes('web') || texto.includes('app') || texto.includes('sistema')) {
    return 'Tecnología';
  }
  if (texto.includes('salud') || texto.includes('medic') || texto.includes('doctor') || texto.includes('clinica')) {
    return 'Salud';
  }
  if (texto.includes('educac') || texto.includes('enseñ') || texto.includes('profesor') || texto.includes('curso')) {
    return 'Educación';
  }
  if (texto.includes('transport') || texto.includes('taxi') || texto.includes('delivery') || texto.includes('envio')) {
    return 'Transporte';
  }
  
  return 'Otros'; // Categoría por defecto
};

// Lista de barrios de Lima (puedes expandir según tu zona)
const barriosLima = [
  'San Isidro',
  'Miraflores', 
  'Barranco',
  'Surco',
  'La Molina',
  'San Borja',
  'Magdalena',
  'Pueblo Libre',
  'Jesús María',
  'Lince',
  'Breña',
  'Lima Centro',
  'Callao',
  'San Miguel',
  'Chorrillos'
];

// Asignar barrio aleatorio (en producción, esto debería ser manual o basado en datos reales)
const asignarBarrio = () => {
  return barriosLima[Math.floor(Math.random() * barriosLima.length)];
};

// Generar rating aleatorio entre 3.5 y 5.0
const generarRating = () => {
  return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
};

// Función principal de migración
async function migrarServicios() {
  try {
    console.log('🚀 Iniciando migración de servicios...');
    
    // Obtener todos los servicios
    const serviciosSnapshot = await db.collection('services').get();
    
    if (serviciosSnapshot.empty) {
      console.log('❌ No se encontraron servicios para migrar');
      return;
    }
    
    console.log(`📊 Encontrados ${serviciosSnapshot.docs.length} servicios para migrar`);
    
    const batch = db.batch();
    let contadorActualizados = 0;
    
    for (const doc of serviciosSnapshot.docs) {
      const data = doc.data();
      const actualizaciones = {};
      
      // Verificar y agregar campos faltantes
      
      // 1. Campo 'category'
      if (!data.category) {
        actualizaciones.category = categorizarServicio(data.name || data.title || '', data.description || '');
        console.log(`📝 ${doc.id}: Categoría asignada -> ${actualizaciones.category}`);
      }
      
      // 2. Campo 'barrio'
      if (!data.barrio) {
        actualizaciones.barrio = asignarBarrio();
        console.log(`📍 ${doc.id}: Barrio asignado -> ${actualizaciones.barrio}`);
      }
      
      // 3. Campo 'active' (por defecto true)
      if (data.active === undefined) {
        actualizaciones.active = true;
      }
      
      // 4. Campo 'rating' (si no existe)
      if (!data.rating) {
        actualizaciones.rating = generarRating();
        console.log(`⭐ ${doc.id}: Rating asignado -> ${actualizaciones.rating}`);
      }
      
      // 5. Campo 'type' (basado en category)
      if (!data.type) {
        actualizaciones.type = 'service'; // Por defecto, puede ser 'service', 'product', 'rental'
      }
      
      // 6. Campos de fecha
      if (!data.createdAt) {
        actualizaciones.createdAt = admin.firestore.FieldValue.serverTimestamp();
      }
      
      if (!data.updatedAt) {
        actualizaciones.updatedAt = admin.firestore.FieldValue.serverTimestamp();
      }
      
      // 7. Campo 'slug' para SEO
      if (!data.slug && (data.name || data.title)) {
        const nombre = data.name || data.title;
        actualizaciones.slug = nombre
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }
      
      // 8. URLs de imágenes con Cloudinary
      if (!data.images) {
        const cloudName = 'tubarrio-pe'; // Reemplaza con tu cloud name
        const serviceId = doc.id;
        actualizaciones.images = {
          main: `https://res.cloudinary.com/${cloudName}/image/upload/w_800,h_600,c_fill,f_auto,q_auto:good/services/${serviceId}/main`,
          gallery: [
            `https://res.cloudinary.com/${cloudName}/image/upload/w_1200,h_900,c_fill,f_auto,q_auto:good/services/${serviceId}/gallery_1`,
            `https://res.cloudinary.com/${cloudName}/image/upload/w_1200,h_900,c_fill,f_auto,q_auto:good/services/${serviceId}/gallery_2`
          ],
          thumbnail: `https://res.cloudinary.com/${cloudName}/image/upload/w_300,h_200,c_fill,f_auto,q_auto:eco/services/${serviceId}/main`
        };
      }
      
      // 9. Campo 'featured' (destacado)
      if (data.featured === undefined) {
        // Marcar como destacado solo algunos servicios con buen rating
        actualizaciones.featured = (actualizaciones.rating || data.rating || 0) >= 4.5;
      }
      
      // 10. Estructura de contacto
      if (!data.contact && (data.phone || data.email || data.whatsapp)) {
        actualizaciones.contact = {
          phone: data.phone || '',
          email: data.email || '',
          whatsapp: data.whatsapp || data.phone || '',
          website: data.website || ''
        };
      }
      
      // 11. Estructura de ubicación
      if (!data.location && (data.address || data.barrio)) {
        actualizaciones.location = {
          address: data.address || '',
          barrio: actualizaciones.barrio || data.barrio || '',
          district: actualizaciones.barrio || data.barrio || '',
          city: 'Lima',
          country: 'Perú'
        };
      }
      
      // Solo actualizar si hay cambios
      if (Object.keys(actualizaciones).length > 0) {
        batch.update(doc.ref, actualizaciones);
        contadorActualizados++;
        
        console.log(`✅ ${doc.id}: ${Object.keys(actualizaciones).length} campos actualizados`);
      } else {
        console.log(`⏭️  ${doc.id}: Sin cambios necesarios`);
      }
    }
    
    // Ejecutar batch update
    if (contadorActualizados > 0) {
      await batch.commit();
      console.log(`\n🎉 Migración completada exitosamente!`);
      console.log(`📊 Servicios actualizados: ${contadorActualizados}/${serviciosSnapshot.docs.length}`);
    } else {
      console.log(`\n✨ Todos los servicios ya están actualizados`);
    }
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

// Función para crear índices necesarios
async function crearIndices() {
  console.log('\n🔧 Creando índices recomendados...');
  
  const indices = [
    'category',
    'barrio', 
    'active',
    'featured',
    'rating',
    'createdAt',
    'userId'
  ];
  
  console.log('📋 Índices recomendados para crear en Firebase Console:');
  console.log('   1. Ir a Firebase Console > Firestore > Índices');
  console.log('   2. Crear índices compuestos para:');
  console.log('      - active (Ascending) + category (Ascending) + rating (Descending)');
  console.log('      - active (Ascending) + barrio (Ascending) + createdAt (Descending)');
  console.log('      - active (Ascending) + featured (Ascending) + rating (Descending)');
  console.log('      - userId (Ascending) + active (Ascending) + createdAt (Descending)');
  console.log('\n💡 Estos índices optimizarán las consultas y reducirán costos');
}

// Función para mostrar estadísticas
async function mostrarEstadisticas() {
  try {
    console.log('\n📊 Estadísticas de servicios:');
    
    const serviciosSnapshot = await db.collection('services').get();
    const servicios = serviciosSnapshot.docs.map(doc => doc.data());
    
    // Estadísticas por categoría
    const porCategoria = servicios.reduce((acc, servicio) => {
      const cat = servicio.category || 'Sin categoría';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n🏷️  Por categoría:');
    Object.entries(porCategoria).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });
    
    // Estadísticas por barrio
    const porBarrio = servicios.reduce((acc, servicio) => {
      const barrio = servicio.barrio || 'Sin barrio';
      acc[barrio] = (acc[barrio] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📍 Por barrio:');
    Object.entries(porBarrio).forEach(([barrio, count]) => {
      console.log(`   ${barrio}: ${count}`);
    });
    
    // Servicios activos vs inactivos
    const activos = servicios.filter(s => s.active !== false).length;
    const inactivos = servicios.length - activos;
    
    console.log('\n🔄 Estado:');
    console.log(`   Activos: ${activos}`);
    console.log(`   Inactivos: ${inactivos}`);
    
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
  }
}

// Ejecutar migración
if (require.main === module) {
  (async () => {
    await migrarServicios();
    await mostrarEstadisticas();
    await crearIndices();
    
    console.log('\n✨ Proceso completado. Recuerda crear los índices en Firebase Console.');
    process.exit(0);
  })();
}

module.exports = {
  migrarServicios,
  mostrarEstadisticas,
  crearIndices
};