// Script simple para actualizar servicios con campo active
// Este script se ejecutará desde el navegador en la consola de desarrollador

console.log(`
=== SCRIPT PARA ACTUALIZAR SERVICIOS ===

Por favor, copia y pega el siguiente código en la consola del navegador
en la página del admin panel (http://localhost:3000/admin):

`);

const scriptCode = `
// Importar Firebase desde el contexto global de la aplicación
const { db } = window.__NEXT_DATA__ ? 
  await import('/src/lib/firebase/config.js') : 
  { db: firebase.firestore() };

// Función para actualizar servicios
async function updateServicesActiveField() {
  try {
    console.log('Consultando servicios en Firestore...');
    
    // Obtener todos los servicios
    const servicesRef = firebase.firestore().collection('services');
    const querySnapshot = await servicesRef.get();
    
    console.log(\`Encontrados \${querySnapshot.docs.length} servicios\`);
    
    let updatedCount = 0;
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      
      // Si el servicio no tiene el campo 'active', lo agregamos como true
      if (data.active === undefined) {
        await doc.ref.update({
          active: true
        });
        
        console.log(\`✅ Actualizado servicio: \${data.name || doc.id} - active: true\`);
        updatedCount++;
      } else {
        console.log(\`ℹ️ Servicio ya tiene campo active: \${data.name || doc.id} - active: \${data.active}\`);
      }
    }
    
    console.log(\`\n🎉 Actualización completada. \${updatedCount} servicios actualizados.\`);
    
  } catch (error) {
    console.error('❌ Error al actualizar servicios:', error);
  }
}

// Ejecutar la función
updateServicesActiveField();
`;

console.log(scriptCode);
console.log(`
=== FIN DEL SCRIPT ===
`);
console.log('Instrucciones:');
console.log('1. Abre http://localhost:3000/admin en tu navegador');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña "Console"');
console.log('4. Copia y pega el código de arriba');
console.log('5. Presiona Enter para ejecutar');
console.log('\nEsto actualizará todos los servicios para agregar el campo "active: true"\n');