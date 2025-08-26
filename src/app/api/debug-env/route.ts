import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envVars = {
      // Variables de servidor (sin NEXT_PUBLIC_)
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      
      // Variables de cliente (con NEXT_PUBLIC_)
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Verificar si hay caracteres extra en las variables
    const cleanedVars: any = {};
    const issues: any = {};
    
    Object.entries(envVars).forEach(([key, value]) => {
      if (value) {
        const trimmed = value.trim();
        cleanedVars[key] = {
          original: value,
          trimmed: trimmed,
          hasExtraChars: value !== trimmed,
          length: value.length,
          trimmedLength: trimmed.length
        };
        
        if (value !== trimmed) {
          issues[key] = {
            original: JSON.stringify(value),
            trimmed: JSON.stringify(trimmed),
            extraChars: value.length - trimmed.length
          };
        }
      } else {
        cleanedVars[key] = null;
      }
    });

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: 'production',
      variables: cleanedVars,
      issues: issues,
      hasIssues: Object.keys(issues).length > 0
    });
    
  } catch (error) {
    console.error('Error al verificar variables de entorno:', error);
    return NextResponse.json(
      { 
        error: 'Error al verificar variables de entorno', 
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}