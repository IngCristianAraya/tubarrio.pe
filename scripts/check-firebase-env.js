console.log('🔍 Verificando variables de entorno de Firebase:');

const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

let allVarsPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const isSet = !!value;
  console.log(`  ${varName}: ${isSet ? '✅ Set' : '❌ Missing'}`);
  if (!isSet) allVarsPresent = false;
});

if (allVarsPresent) {
  console.log('\n✅ Todas las variables de Firebase están configuradas correctamente.');
} else {
  console.log('\n❌ Faltan algunas variables de configuración de Firebase.');
  console.log('Asegúrate de configurar las variables en el archivo .env.local');
}
