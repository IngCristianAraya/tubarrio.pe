import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Definir la interfaz para los datos del servicio
interface ServiceData {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  barrio?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  featured?: boolean;
  active?: boolean;
  images?: string[];
  logo?: string;
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
  userId?: string;
  [key: string]: any; // Para propiedades adicionales
}

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
    
    const serviceData: ServiceData = {
      id: serviceDoc.id,
      ...serviceDoc.data()
    } as ServiceData;
    
    console.log(`✅ Servicio encontrado: ${serviceData.name || 'Sin nombre'}`);
    
    // Convertir Timestamp a string para la respuesta
    const responseData = {
      ...serviceData,
      createdAt: serviceData.createdAt instanceof Timestamp ? serviceData.createdAt.toDate().toISOString() : serviceData.createdAt,
      updatedAt: serviceData.updatedAt instanceof Timestamp ? serviceData.updatedAt.toDate().toISOString() : serviceData.updatedAt
    };
    
    return NextResponse.json(responseData);
    
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
    const result: ServiceData = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    } as ServiceData;
    
    // Convertir Timestamp a string para la respuesta
    const responseData = {
      ...result,
      createdAt: result.createdAt instanceof Timestamp ? result.createdAt.toDate().toISOString() : result.createdAt,
      updatedAt: result.updatedAt instanceof Timestamp ? result.updatedAt.toDate().toISOString() : result.updatedAt
    };
    
    return NextResponse.json(responseData);
    
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