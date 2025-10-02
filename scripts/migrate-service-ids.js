// Script para migrar servicios con IDs automáticos a slugs basados en nombres
// Este script debe ejecutarse desde la consola del navegador en la aplicación web

console.log(`
// ===== SCRIPT DE MIGRACIÓN DE SERVICIOS =====
// Copia y pega este código en la consola del navegador
// cuando estés en la aplicación web (localhost:3000)

(async function migrateServiceIds() {
  // Importar Firebase desde la aplicación
  const { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } = await import('firebase/firestore');
  
  // Obtener la instancia de Firestore desde la aplicación
  const db = getFirestore();
  
  // Función para generar slug desde el nombre
  function generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[\\s\\W-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50)
      .replace(/-+$/, '');
  }
  
  // Función para generar slug único
  function generateUniqueSlug(baseSlug, existingSlugs) {
    let slug = baseSlug;
    let counter = 1;
    
    while (existingSlugs.includes(slug)) {
      slug = \`\${baseSlug}-\${counter}\`;
      counter++;
    }
    
    return slug;
  }
  
  // Función para verificar si un ID es automático de Firebase
  function isFirebaseAutoId(id) {
    // Los IDs automáticos de Firebase tienen 20 caracteres alfanuméricos
    return /^[a-zA-Z0-9]{20}$/.test(id);
  }
  
  try {
    console.log('🚀 Iniciando migración de IDs de servicios...');
    
    // Obtener todos los servicios
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    const services = servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));
    
    console.log(\`📊 Total de servicios encontrados: \${services.length}\`);
    
    // Filtrar servicios con IDs automáticos
    const servicesWithAutoIds = services.filter(service => isFirebaseAutoId(service.id));
    console.log(\`🔍 Servicios con IDs automáticos: \${servicesWithAutoIds.length}\`);
    
    if (servicesWithAutoIds.length === 0) {
      console.log('✅ No hay servicios que migrar. Todos ya tienen slugs personalizados.');
      return;
    }
    
    // Mostrar servicios que se van a migrar
    console.log('\n📋 Servicios que se migrarán:');
    servicesWithAutoIds.forEach(service => {
      const slug = generateSlug(service.data.name || 'sin-nombre');
      console.log(\`  - "\${service.data.name}" (\${service.id}) → \${slug}\`);
    });
    
    // Obtener slugs existentes para evitar duplicados
    const existingSlugs = services
      .filter(service => !isFirebaseAutoId(service.id))
      .map(service => service.id);
    
    let migrated = 0;
    let errors = 0;
    
    for (const service of servicesWithAutoIds) {
      try {
        const serviceName = service.data.name;
        if (!serviceName) {
          console.log(\`⚠️ Servicio \${service.id} no tiene nombre, saltando...\`);
          continue;
        }
        
        // Generar slug único
        const baseSlug = generateSlug(serviceName);
        const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
        
        // Agregar el nuevo slug a la lista para evitar duplicados
        existingSlugs.push(uniqueSlug);
        
        console.log(\`📝 Migrando: "\${serviceName}" de \${service.id} a \${uniqueSlug}\`);
        
        // Crear nuevo documento con el slug
        await setDoc(doc(db, 'services', uniqueSlug), {
          ...service.data,
          updatedAt: new Date()
        });
        
        // Eliminar el documento anterior
        await deleteDoc(doc(db, 'services', service.id));
        
        console.log(\`✅ Migrado exitosamente: \${uniqueSlug}\`);
        migrated++;
        
      } catch (error) {
        console.error(\`❌ Error migrando servicio \${service.id}:\`, error);
        errors++;
      }
    }
    
    console.log(\`\\n🎉 Migración completada!\`);
    console.log(\`✅ Servicios migrados: \${migrated}\`);
    console.log(\`❌ Errores: \${errors}\`);
    
    // Verificar servicios finales
    const finalServices = await getDocs(collection(db, 'services'));
    const finalAutoIds = finalServices.docs.filter(doc => isFirebaseAutoId(doc.id));
    console.log(\`📊 Servicios con IDs automáticos restantes: \${finalAutoIds.length}\`);
    
    console.log('\\n💡 Recarga la página para ver los cambios reflejados.');
    
  } catch (error) {
    console.error('💥 Error durante la migración:', error);
  }
})();

// ===== FIN DEL SCRIPT =====`);

console.log('\n💡 Para ejecutar la migración:');
console.log('1. Abre la aplicación web en el navegador (localhost:3000)');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña "Console"');
console.log('4. Copia y pega el código que aparece arriba');
console.log('5. Presiona Enter para ejecutar');
console.log('\n⚠️ IMPORTANTE: Haz una copia de seguridad de la base de datos antes de ejecutar.');