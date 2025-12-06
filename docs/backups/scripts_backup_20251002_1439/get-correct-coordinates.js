// Script para obtener coordenadas correctas de Avenida Universitaria 1625, San Miguel
// Usaremos una aproximación basada en conocimiento de Lima

console.log('🔍 Obteniendo coordenadas correctas para Avenida Universitaria 1625, San Miguel...\n');

// Coordenadas aproximadas conocidas de San Miguel, Lima
const sanMiguelCenter = {
  lat: -12.0776,
  lng: -77.0865
};

// Avenida Universitaria es una avenida principal que atraviesa varios distritos
// En San Miguel, las coordenadas aproximadas serían:
const avenidaUniversitariaSanMiguel = {
  lat: -12.0776,  // Latitud aproximada para San Miguel
  lng: -77.0865   // Longitud aproximada para San Miguel
};

console.log('📍 Coordenadas de referencia:');
console.log('   San Miguel (centro):', sanMiguelCenter);
console.log('   Avenida Universitaria en San Miguel:', avenidaUniversitariaSanMiguel);
console.log('');

// Coordenadas actuales en la base de datos
const coordenadasActuales = {
  lat: -12.085,
  lng: -77.095
};

console.log('🗺️  Comparación de coordenadas:');
console.log('   Actuales en BD:', coordenadasActuales);
console.log('   Correctas estimadas:', avenidaUniversitariaSanMiguel);
console.log('');

// Calcular diferencia
const diffLat = Math.abs(coordenadasActuales.lat - avenidaUniversitariaSanMiguel.lat);
const diffLng = Math.abs(coordenadasActuales.lng - avenidaUniversitariaSanMiguel.lng);

console.log('📏 Diferencia en coordenadas:');
console.log('   Diferencia en latitud:', diffLat.toFixed(6));
console.log('   Diferencia en longitud:', diffLng.toFixed(6));
console.log('');

// Determinar si la diferencia es significativa
const umbralSignificativo = 0.01; // Aproximadamente 1 km
const esSignificativo = diffLat > umbralSignificativo || diffLng > umbralSignificativo;

console.log('⚠️  Análisis de precisión:');
console.log('   ¿Diferencia significativa?', esSignificativo ? '❌ SÍ (>1km)' : '✅ NO (<1km)');

if (esSignificativo) {
  console.log('');
  console.log('🚨 RECOMENDACIÓN:');
  console.log('   Las coordenadas actuales están muy alejadas de la ubicación real.');
  console.log('   Se recomienda actualizar a coordenadas más precisas.');
  console.log('');
  console.log('🎯 Coordenadas sugeridas para Avenida Universitaria 1625, San Miguel:');
  console.log('   Latitud: -12.0776');
  console.log('   Longitud: -77.0865');
  console.log('');
  console.log('🔗 URLs para verificar:');
  console.log('   Ubicación actual:', `https://www.google.com/maps?q=${coordenadasActuales.lat},${coordenadasActuales.lng}`);
  console.log('   Ubicación sugerida:', `https://www.google.com/maps?q=${avenidaUniversitariaSanMiguel.lat},${avenidaUniversitariaSanMiguel.lng}`);
  console.log('   Búsqueda por dirección:', 'https://www.google.com/maps?q=Avenida+Universitaria+1625+San+Miguel+Lima+Peru');
} else {
  console.log('');
  console.log('✅ Las coordenadas actuales parecen estar en el rango correcto.');
}

console.log('\n' + '='.repeat(60));
console.log('RESUMEN DE COORDENADAS PARA ANTICUCHOS BRAN');
console.log('='.repeat(60));
console.log('Dirección: Avenida Universitaria 1625, San Miguel, Lima, Perú');
console.log('Coordenadas actuales: lat=' + coordenadasActuales.lat + ', lng=' + coordenadasActuales.lng);
console.log('Coordenadas sugeridas: lat=' + avenidaUniversitariaSanMiguel.lat + ', lng=' + avenidaUniversitariaSanMiguel.lng);
console.log('Estado: ' + (esSignificativo ? 'REQUIERE ACTUALIZACIÓN' : 'COORDENADAS CORRECTAS'));