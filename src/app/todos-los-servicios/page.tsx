'use client';

import TodosLosServicios from './TodosLosServicios';
import FirebaseStatus from '@/components/FirebaseStatus';
import dynamic from 'next/dynamic';

// Importación dinámica del monitor avanzado de lecturas Firestore (solo para desarrollo)
const AdvancedFirestoreMonitor = dynamic(
  () => import('@/components/AdvancedFirestoreMonitor'),
  { ssr: false }
);
// import FirestorePermissionsDiagnostic from '@/components/FirestorePermissionsDiagnostic';

export default function Page() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <FirebaseStatus />
        {/* Comentado temporalmente para reducir lecturas de Firestore */}
        {/* <FirestorePermissionsDiagnostic /> */}
      </div>
      <TodosLosServicios />
      
      {/* Monitor avanzado de lecturas Firestore (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <AdvancedFirestoreMonitor enabled={true} autoShow={false} />
      )}
    </div>
  );
}
