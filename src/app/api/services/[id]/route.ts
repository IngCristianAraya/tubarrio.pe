import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Configuración de Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    // Usar variables de entorno para Firebase Admin
    const serviceAccount = {
      projectId: (process.env.FIREBASE_PROJECT_ID || 'tubarriope-7ed1d').trim(),
      clientEmail: (process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@tubarriope-7ed1d.iam.gserviceaccount.com').trim(),
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim(),
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

// Inicializar Firebase Admin
const app = initializeFirebaseAdmin();
const db = getFirestore(app);

// GET - Obtener servicio específico por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('📖 Consultando servicio con Firebase Admin:', id);
    
    const serviceRef = db.collection('services').doc(id);
    const serviceDoc = await serviceRef.get();
    
    if (!serviceDoc.exists) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }
    
    const serviceData = {
      id: serviceDoc.id,
      ...serviceDoc.data()
    };
    
    console.log(`✅ Servicio encontrado: ${serviceData.name}`);
    
    return NextResponse.json(serviceData);
    
  } catch (error) {
    console.error('❌ Error al obtener servicio:', error);
    return NextResponse.json(
      { error: 'Error al obtener servicio', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar servicio específico
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    console.log('🔄 Actualizando servicio con Firebase Admin:', id);
    
    // Verificar que el servicio existe
    const serviceRef = db.collection('services').doc(id);
    const serviceDoc = await serviceRef.get();
    
    if (!serviceDoc.exists) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }
    
    // Actualizar con timestamp
    const updatedData = {
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    await serviceRef.update(updatedData);
    
    console.log(`✅ Servicio ${id} actualizado`);
    
    // Obtener datos actualizados
    const updatedDoc = await serviceRef.get();
    const result = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ Error al actualizar servicio:', error);
    return NextResponse.json(
      { error: 'Error al actualizar servicio', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar servicio específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('🗑️ Eliminando servicio con Firebase Admin:', id);
    
    // Verificar que el servicio existe
    const serviceRef = db.collection('services').doc(id);
    const serviceDoc = await serviceRef.get();
    
    if (!serviceDoc.exists) {
      return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 });
    }
    
    await serviceRef.delete();
    
    console.log(`✅ Servicio ${id} eliminado`);
    
    return NextResponse.json({ message: 'Servicio eliminado correctamente', id });
    
  } catch (error) {
    console.error('❌ Error al eliminar servicio:', error);
    return NextResponse.json(
      { error: 'Error al eliminar servicio', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}