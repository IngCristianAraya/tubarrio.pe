import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Aquí puedes agregar verificaciones adicionales como:
    // - Conexión a la base de datos
    // - Estado de servicios externos
    // - Uso de memoria/CPU

    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { status: 'error', error: 'Service Unavailable' },
      { status: 503 }
    );
  }
}

// Configuración para evitar el caché en el endpoint de salud
export const dynamic = 'force-dynamic';
export const revalidate = 0;
