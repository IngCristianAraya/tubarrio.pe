const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Inicializar Firebase Admin
if (!admin.apps.length) {
  // Configuración de Firebase Admin usando las variables de entorno correctas
  const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tubarriope-7ed1d',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@tubarriope-7ed1d.iam.gserviceaccount.com',
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.projectId
  });
}

const db = admin.firestore();

// Especificaciones y condiciones por categoría
const dataByCategory = {
  'restaurantes': {
    specifications: [
      'Cocina tradicional con ingredientes frescos',
      'Ambiente familiar y acogedor',
      'Servicio de delivery disponible',
      'Menú variado para todos los gustos',
      'Atención personalizada'
    ],
    conditions: [
      'Horario: Lunes a Domingo 11:00 AM - 10:00 PM',
      'Reservas recomendadas para grupos grandes',
      'Aceptamos efectivo y tarjetas',
      'Delivery gratuito en pedidos mayores a $20.000',
      'Consultar disponibilidad de platos especiales'
    ]
  },
  'panaderias': {
    specifications: [
      'Pan fresco horneado diariamente',
      'Ingredientes naturales sin conservantes',
      'Variedad de productos dulces y salados',
      'Servicio desde las 6:00 AM',
      'Productos artesanales'
    ],
    conditions: [
      'Horario: Lunes a Sábado 6:00 AM - 8:00 PM',
      'Domingos 7:00 AM - 6:00 PM',
      'Pedidos especiales con 24 horas de anticipación',
      'Delivery gratuito en compras mayores a $15.000',
      'Productos frescos del día'
    ]
  },
  'salud': {
    specifications: [
      'Profesionales certificados y especializados',
      'Equipos médicos de última tecnología',
      'Atención personalizada y confidencial',
      'Instalaciones modernas y sanitizadas',
      'Seguimiento post-consulta'
    ],
    conditions: [
      'Citas programadas con anticipación',
      'Horario: Lunes a Viernes 8:00 AM - 6:00 PM',
      'Sábados 8:00 AM - 2:00 PM',
      'Aceptamos seguros médicos',
      'Cancelaciones con 2 horas de anticipación'
    ]
  },
  'servicios-profesionales': {
    specifications: [
      'Profesionales con experiencia comprobada',
      'Servicio personalizado según necesidades',
      'Presupuestos sin compromiso',
      'Garantía en todos los trabajos',
      'Atención rápida y eficiente'
    ],
    conditions: [
      'Evaluación gratuita del proyecto',
      'Horarios flexibles según disponibilidad',
      'Pago 50% adelanto, 50% al finalizar',
      'Garantía de 6 meses en trabajos realizados',
      'Materiales incluidos en el presupuesto'
    ]
  },
  'default': {
    specifications: [
      'Servicio profesional de calidad',
      'Atención personalizada',
      'Experiencia comprobada',
      'Compromiso con la excelencia',
      'Satisfacción garantizada'
    ],
    conditions: [
      'Horarios de atención flexibles',
      'Consultas y presupuestos gratuitos',
      'Aceptamos diferentes formas de pago',
      'Términos y condiciones generales aplican',
      'Contactar para más información'
    ]
  }
};

async function addSpecificationsAndConditions() {
  try {
    console.log('🔄 Iniciando actualización de servicios...');
    
    // Obtener todos los servicios
    const servicesSnapshot = await db.collection('services').get();
    
    if (servicesSnapshot.empty) {
      console.log('❌ No se encontraron servicios en la base de datos');
      return;
    }

    console.log(`📊 Encontrados ${servicesSnapshot.size} servicios para actualizar`);

    let updatedCount = 0;
    let skippedCount = 0;

    // Procesar cada servicio
    for (const doc of servicesSnapshot.docs) {
      const serviceData = doc.data();
      const serviceId = doc.id;
      
      // Verificar si ya tiene los campos
      if (serviceData.specifications && serviceData.conditions) {
        console.log(`⏭️  Servicio ${serviceId} ya tiene specifications y conditions`);
        skippedCount++;
        continue;
      }

      // Determinar la categoría del servicio
      const category = serviceData.category || 'default';
      const categoryKey = Object.keys(dataByCategory).find(key => 
        category.toLowerCase().includes(key.replace('-', ' ')) || 
        category.toLowerCase().includes(key)
      ) || 'default';

      const { specifications, conditions } = dataByCategory[categoryKey];

      // Actualizar el documento
      await doc.ref.update({
        specifications: specifications,
        conditions: conditions,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      console.log(`✅ Actualizado servicio: ${serviceData.name || serviceId} (${category})`);
      updatedCount++;
    }

    console.log('\n🎉 Actualización completada:');
    console.log(`   ✅ Servicios actualizados: ${updatedCount}`);
    console.log(`   ⏭️  Servicios omitidos: ${skippedCount}`);
    console.log(`   📊 Total procesados: ${servicesSnapshot.size}`);

  } catch (error) {
    console.error('❌ Error al actualizar servicios:', error);
  }
}

// Ejecutar el script
addSpecificationsAndConditions()
  .then(() => {
    console.log('🏁 Script finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });