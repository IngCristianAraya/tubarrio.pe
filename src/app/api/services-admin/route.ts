import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Configuración de Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    // Usar variables de entorno para Firebase Admin
    const serviceAccount = {
      projectId: (process.env.FIREBASE_PROJECT_ID || '').trim(),
      clientEmail: (process.env.FIREBASE_CLIENT_EMAIL || '').trim(),
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim(),
    };
    
    console.log('🔧 Inicializando Firebase Admin con:', {
      projectId: serviceAccount.projectId,
      hasClientEmail: !!serviceAccount.clientEmail,
      hasPrivateKey: !!serviceAccount.privateKey
    });
    
    return initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.projectId
    });
  }
  return getApps()[0];
};

export async function GET() {
  try {
    console.log('🚀 Iniciando consulta con Firebase Admin SDK...');
    
    // Inicializar Firebase Admin
    const app = initializeFirebaseAdmin();
    const db = getFirestore(app);
    
    console.log('✅ Firebase Admin inicializado correctamente');
    
    // Consultar servicios
    const servicesRef = db.collection('services');
    const snapshot = await servicesRef.orderBy('name').get();
    
    console.log(`📊 Encontrados ${snapshot.size} servicios`);
    
    const allServices: any[] = [];
    const activeServices: any[] = [];
    const inactiveServices: any[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const service = {
        id: doc.id,
        name: data.name,
        active: data.active,
        category: data.category
      };
      
      allServices.push(service);
      
      if (data.active !== false) {
        activeServices.push(service);
      } else {
        inactiveServices.push(service);
      }
    });
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      method: 'Firebase Admin SDK',
      total: allServices.length,
      active: activeServices.length,
      inactive: inactiveServices.length,
      allServices: allServices.slice(0, 5), // Solo primeros 5 para evitar respuesta muy grande
      activeServices: activeServices.slice(0, 5),
      inactiveServices: inactiveServices.slice(0, 5),
      success: true
    });
    
  } catch (error) {
    console.error('❌ Error con Firebase Admin SDK:', error);
    
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Error desconocido',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      envVars: {
        hasProjectId: !!(process.env.FIREBASE_PROJECT_ID || '').trim(),
        hasClientEmail: !!(process.env.FIREBASE_CLIENT_EMAIL || '').trim(),
        hasPrivateKey: !!(process.env.FIREBASE_PRIVATE_KEY || '').trim(),
        projectId: (process.env.FIREBASE_PROJECT_ID || '').trim()
      }
    };
    
    return NextResponse.json(
      { 
        error: 'Error al consultar servicios con Firebase Admin SDK', 
        details: errorDetails,
        timestamp: new Date().toISOString(),
        method: 'Firebase Admin SDK'
      },
      { status: 500 }
    );
  }
}