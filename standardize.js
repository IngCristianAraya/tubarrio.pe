const fs = require('fs');
const path = require('path');

// Configuración
const INPUT_FILE = path.join(__dirname, 'services.json');
const OUTPUT_FILE = path.join(__dirname, 'services_standardized.json');

// Estructura completa con valores por defecto
const DEFAULT_SERVICE = {
  id: 'none',
  name: 'Sin nombre',
  category: 'Otros',
  image: 'none',
  localImages: [],
  rating: 0,
  description: 'Sin descripción',
  horario: 'No especificado',
  location: 'Ubicación no especificada',
  contactUrl: 'none',
  detailsUrl: 'none',
  whatsapp: 'none',
  tags: [],
  plan: 'básico'
};

function standardizeServices() {
  try {
    // 1. Leer el archivo actual
    const services = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
    
    console.log(`🔍 Procesando ${services.length} servicios...`);

    // 2. Estandarizar cada servicio
    const standardizedServices = services.map(service => {
      // Crear un nuevo objeto con los valores por defecto
      const standardized = { ...DEFAULT_SERVICE };
      
      // Copiar los valores existentes (si existen)
      Object.keys(service).forEach(key => {
        if (key in standardized) {
          // Si el campo existe en los valores por defecto, copiarlo
          standardized[key] = service[key];
        } else {
          console.log(`⚠️  Campo no estándar en ${service.id || 'servicio'}: ${key}`);
        }
      });

      // Asegurar que el ID esté en minúsculas
      if (standardized.id) {
        standardized.id = standardized.id.toLowerCase().replace(/\s+/g, '-');
      }

      // Asegurar que las imágenes sean un array
      if (standardized.image && !Array.isArray(standardized.images)) {
        standardized.images = [standardized.image];
      }

      // Establecer el plan basado en el número de imágenes
      if (standardized.images && standardized.images.length > 1) {
        standardized.plan = 'premium';
      } else {
        standardized.plan = 'básico';
      }

      return standardized;
    });

    // 3. Guardar el archivo estandarizado
    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(standardizedServices, null, 2),
      'utf8'
    );

    console.log(`\n✅ Archivo estandarizado guardado en: ${OUTPUT_FILE}`);
    console.log(`📊 Total de servicios procesados: ${standardizedServices.length}`);
    
    // Mostrar ejemplo del primer servicio
    const sample = standardizedServices[0];
    console.log('\n📝 Ejemplo de servicio estandarizado:');
    console.log(JSON.stringify({
      id: sample.id,
      name: sample.name,
      category: sample.category,
      image: sample.image,
      rating: sample.rating,
      description: sample.description,
      horario: sample.horario,
      location: sample.location,
      contactUrl: sample.contactUrl,
      detailsUrl: sample.detailsUrl,
      whatsapp: sample.whatsapp,
      tags: sample.tags,
      plan: sample.plan
    }, null, 2));

  } catch (error) {
    console.error('❌ Error al estandarizar los servicios:', error.message);
    process.exit(1);
  }
}

// Ejecutar la estandarización
standardizeServices();
