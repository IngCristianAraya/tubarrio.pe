import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Diagnóstico de Variables de Entorno en Vercel');
    console.log('================================================');

    // Variables Firebase Admin SDK (las críticas para el error)
    const adminVars = {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY
    };

    const envVars = {
      // Variables de servidor (sin NEXT_PUBLIC_)
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      
      // Variables Firebase Admin SDK
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
      
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

    // Análisis específico de Firebase Admin SDK
    const adminAnalysis = {
      FIREBASE_PROJECT_ID: {
        exists: !!adminVars.FIREBASE_PROJECT_ID,
        value: adminVars.FIREBASE_PROJECT_ID || 'NO_CONFIGURADA',
        type: typeof adminVars.FIREBASE_PROJECT_ID,
        length: adminVars.FIREBASE_PROJECT_ID?.length || 0,
        isEmpty: (adminVars.FIREBASE_PROJECT_ID || '').trim() === ''
      },
      FIREBASE_CLIENT_EMAIL: {
        exists: !!adminVars.FIREBASE_CLIENT_EMAIL,
        value: adminVars.FIREBASE_CLIENT_EMAIL ? `${adminVars.FIREBASE_CLIENT_EMAIL.substring(0, 30)}...` : 'NO_CONFIGURADA',
        type: typeof adminVars.FIREBASE_CLIENT_EMAIL,
        length: adminVars.FIREBASE_CLIENT_EMAIL?.length || 0,
        isEmpty: (adminVars.FIREBASE_CLIENT_EMAIL || '').trim() === ''
      },
      FIREBASE_PRIVATE_KEY: {
        exists: !!adminVars.FIREBASE_PRIVATE_KEY,
        type: typeof adminVars.FIREBASE_PRIVATE_KEY,
        length: adminVars.FIREBASE_PRIVATE_KEY?.length || 0,
        isEmpty: (adminVars.FIREBASE_PRIVATE_KEY || '').trim() === '',
        hasBeginMarker: adminVars.FIREBASE_PRIVATE_KEY?.includes('-----BEGIN PRIVATE KEY-----') || false,
        hasEndMarker: adminVars.FIREBASE_PRIVATE_KEY?.includes('-----END PRIVATE KEY-----') || false,
        hasEscapedNewlines: adminVars.FIREBASE_PRIVATE_KEY?.includes('\\n') || false,
        first50: adminVars.FIREBASE_PRIVATE_KEY?.substring(0, 50) || 'NO_CONFIGURADA'
      }
    };

    // Test de service account object (el que está fallando)
    let serviceAccountTest;
    try {
      const serviceAccount = {
        projectId: (process.env.FIREBASE_PROJECT_ID || '').trim(),
        clientEmail: (process.env.FIREBASE_CLIENT_EMAIL || '').trim(),
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim(),
      };
      
      serviceAccountTest = {
        success: true,
        projectId: {
          value: serviceAccount.projectId,
          type: typeof serviceAccount.projectId,
          isEmpty: serviceAccount.projectId === '',
          length: serviceAccount.projectId.length,
          isString: typeof serviceAccount.projectId === 'string'
        },
        clientEmail: {
          value: serviceAccount.clientEmail ? `${serviceAccount.clientEmail.substring(0, 30)}...` : '',
          type: typeof serviceAccount.clientEmail,
          isEmpty: serviceAccount.clientEmail === '',
          length: serviceAccount.clientEmail.length,
          isString: typeof serviceAccount.clientEmail === 'string'
        },
        privateKey: {
          type: typeof serviceAccount.privateKey,
          isEmpty: serviceAccount.privateKey === '',
          length: serviceAccount.privateKey.length,
          isString: typeof serviceAccount.privateKey === 'string',
          hasBeginMarker: serviceAccount.privateKey.includes('-----BEGIN PRIVATE KEY-----'),
          hasEndMarker: serviceAccount.privateKey.includes('-----END PRIVATE KEY-----')
        }
      };
    } catch (error) {
      serviceAccountTest = {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }

    // Log para Vercel
    console.log('🔧 FIREBASE ADMIN SDK ANALYSIS:');
    console.log('FIREBASE_PROJECT_ID:', adminAnalysis.FIREBASE_PROJECT_ID.exists ? `✅ "${adminAnalysis.FIREBASE_PROJECT_ID.value}" (${adminAnalysis.FIREBASE_PROJECT_ID.type})` : '❌ No configurada');
    console.log('FIREBASE_CLIENT_EMAIL:', adminAnalysis.FIREBASE_CLIENT_EMAIL.exists ? `✅ "${adminAnalysis.FIREBASE_CLIENT_EMAIL.value}" (${adminAnalysis.FIREBASE_CLIENT_EMAIL.type})` : '❌ No configurada');
    console.log('FIREBASE_PRIVATE_KEY:', adminAnalysis.FIREBASE_PRIVATE_KEY.exists ? `✅ Configurada (${adminAnalysis.FIREBASE_PRIVATE_KEY.length} caracteres, ${adminAnalysis.FIREBASE_PRIVATE_KEY.type})` : '❌ No configurada');
    console.log('Service Account Test:', serviceAccountTest.success ? '✅ Exitoso' : `❌ Error: ${serviceAccountTest.error}`);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      adminAnalysis,
      serviceAccountTest,
      environment: 'production',
      variables: cleanedVars,
      issues: issues,
      hasIssues: Object.keys(issues).length > 0,
      summary: {
        totalVars: Object.keys(envVars).length,
        configuredVars: Object.values(envVars).filter(v => v !== null && v !== undefined).length,
        varsWithIssues: Object.keys(issues).length,
        adminVarsConfigured: Object.values(adminAnalysis).filter(v => v.exists).length,
        adminVarsTotal: Object.keys(adminAnalysis).length
      }
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