import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  // En desarrollo, simular éxito sin guardar en base de datos
  if (process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV !== 'production') {
    console.log('Simulando registro de negocio exitoso (modo desarrollo)');
    return NextResponse.json({
      success: true,
      message: 'Registro simulado exitosamente (modo desarrollo)',
      id: 'demo-id-123'
    });
  }
  
  // En producción, devolver error controlado
  console.warn('Intento de registro de negocio sin Firebase Admin configurado');
  return NextResponse.json(
    { success: false, message: 'Funcionalidad temporalmente no disponible' },
    { status: 503 }
  );
}
