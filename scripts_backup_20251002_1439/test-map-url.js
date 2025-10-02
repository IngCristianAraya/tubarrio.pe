// Script para probar la generación de URL del mapa para MGC Dental Health

// Simular los datos del servicio MGC como están en Firebase
const mgcService = {
  nombre: "Mgc Dental Health",
  direccion: "Santa Nicerata 372",
  direccion_completa: "Santa Nicerata 372, Lima, Perú",
  coordenadas: {
    lat: -12.0432,
    lng: -77.0282
  },
  zona: "Lima Centro",
  neighborhood: "Lima Centro"
};

// Función getMapUrl del componente ServiceMap
function getMapUrl(service) {
  console.log('🔍 Procesando datos del servicio:');
  console.log('   Coordenadas:', service.coordenadas);
  console.log('   Dirección completa:', service.direccion_completa);
  console.log('   Address:', service.address);
  console.log('   Neighborhood:', service.neighborhood);
  console.log('');

  // Prioridad: coordenadas > dirección completa > dirección existente > barrio
  if (service.coordenadas) {
    const { lat, lng } = service.coordenadas;
    const url = `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
    console.log('✅ Usando COORDENADAS para generar URL:');
    console.log('   URL:', url);
    return url;
  }
  
  if (service.direccion_completa) {
    const query = encodeURIComponent(service.direccion_completa);
    const url = `https://www.google.com/maps?q=${query}&output=embed`;
    console.log('✅ Usando DIRECCIÓN COMPLETA para generar URL:');
    console.log('   URL:', url);
    return url;
  }
  
  if (service.address) {
    const query = encodeURIComponent(service.address);
    const url = `https://www.google.com/maps?q=${query}&output=embed`;
    console.log('✅ Usando ADDRESS para generar URL:');
    console.log('   URL:', url);
    return url;
  }
  
  if (service.neighborhood) {
    const query = encodeURIComponent(`${service.neighborhood}, Lima, Perú`);
    const url = `https://www.google.com/maps?q=${query}&output=embed`;
    console.log('✅ Usando NEIGHBORHOOD para generar URL:');
    console.log('   URL:', url);
    return url;
  }
  
  console.log('❌ No se pudo generar URL - sin datos de ubicación');
  return null;
}

// Función getDirectionsUrl del componente ServiceMap
function getDirectionsUrl(service) {
  console.log('\n🧭 Generando URL de direcciones:');
  
  if (service.coordenadas) {
    const { lat, lng } = service.coordenadas;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    console.log('✅ Usando COORDENADAS para direcciones:');
    console.log('   URL:', url);
    return url;
  }
  
  const address = service.direccion_completa || service.address || service.neighborhood;
  if (address) {
    const query = encodeURIComponent(address);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
    console.log('✅ Usando DIRECCIÓN para direcciones:');
    console.log('   Dirección:', address);
    console.log('   URL:', url);
    return url;
  }
  
  console.log('❌ No se pudo generar URL de direcciones');
  return null;
}

console.log('🗺️  PRUEBA DE GENERACIÓN DE URLs PARA MGC DENTAL HEALTH');
console.log('=====================================================\n');

const mapUrl = getMapUrl(mgcService);
const directionsUrl = getDirectionsUrl(mgcService);

console.log('\n📋 RESUMEN:');
console.log('===========');
console.log('URL del mapa:', mapUrl);
console.log('URL de direcciones:', directionsUrl);

// Verificar si las URLs apuntan a la ubicación correcta
if (mapUrl && mapUrl.includes('-12.0432,-77.0282')) {
  console.log('✅ La URL del mapa contiene las coordenadas correctas');
} else if (mapUrl && mapUrl.includes('Santa%20Nicerata%20372')) {
  console.log('✅ La URL del mapa contiene la dirección correcta');
} else {
  console.log('⚠️  La URL del mapa podría no apuntar a la ubicación correcta');
}

console.log('\n🔗 URLs para probar manualmente:');
console.log('================================');
console.log('Mapa embebido:', mapUrl);
console.log('Direcciones:', directionsUrl);
console.log('Mapa normal:', mapUrl?.replace('&output=embed', ''));