'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, limit, where, orderBy } from 'firebase/firestore';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  details?: any;
}

export default function FirestorePermissionsDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    // Test 1: Firebase DB availability
    if (!db) {
      addResult({
        test: 'Firebase DB',
        status: 'error',
        message: 'Firebase db no está disponible'
      });
      setIsRunning(false);
      return;
    }

    addResult({
      test: 'Firebase DB',
      status: 'success',
      message: 'Firebase db disponible'
    });

    // Test 2: Simple read from services collection
    try {
      const servicesRef = collection(db, 'services');
      const simpleQuery = query(servicesRef, limit(1));
      const snapshot = await getDocs(simpleQuery);
      
      addResult({
        test: 'Lectura simple services',
        status: 'success',
        message: `Exitosa. Documentos encontrados: ${snapshot.size}`,
        details: snapshot.size > 0 ? {
          firstDocId: snapshot.docs[0].id,
          firstDocData: snapshot.docs[0].data()
        } : null
      });
    } catch (error: any) {
      addResult({
        test: 'Lectura simple services',
        status: 'error',
        message: `Error: ${error.code} - ${error.message}`,
        details: error
      });
    }

    // Test 3: Filtered query (may require indexes)
    try {
      const servicesRef = collection(db, 'services');
      const filteredQuery = query(
        servicesRef,
        where('active', '==', true),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const filteredSnapshot = await getDocs(filteredQuery);
      
      addResult({
        test: 'Consulta filtrada services',
        status: 'success',
        message: `Exitosa. Documentos encontrados: ${filteredSnapshot.size}`
      });
    } catch (error: any) {
      const indexUrl = error.message?.match(/https:\/\/[^\s]+/)?.[0];
      addResult({
        test: 'Consulta filtrada services',
        status: 'error',
        message: `Error: ${error.code} - ${error.message}`,
        details: {
          error,
          indexUrl: indexUrl || 'URL de índice no encontrada'
        }
      });
    }

    // Test 4: Access to public collections
    const publicCollections = ['categories'];
    const adminCollections = ['analytics', 'config'];
    
    // Test public collections (should work)
    for (const collectionName of publicCollections) {
      try {
        const collRef = collection(db, collectionName);
        const collQuery = query(collRef, limit(1));
        const collSnapshot = await getDocs(collQuery);
        
        addResult({
          test: `Acceso a ${collectionName}`,
          status: 'success',
          message: `Exitoso. Documentos: ${collSnapshot.size}`
        });
      } catch (error: any) {
        addResult({
          test: `Acceso a ${collectionName}`,
          status: 'error',
          message: `Error: ${error.code} - ${error.message}`,
          details: error
        });
      }
    }

    // Test admin-only collections (expected to fail without admin auth)
    for (const collectionName of adminCollections) {
      try {
        const collRef = collection(db, collectionName);
        const collQuery = query(collRef, limit(1));
        const collSnapshot = await getDocs(collQuery);
        
        addResult({
          test: `Acceso a ${collectionName} (admin)`,
          status: 'success',
          message: `Exitoso (usuario admin). Documentos: ${collSnapshot.size}`
        });
      } catch (error: any) {
        // This is expected behavior for non-admin users
        if (error.code === 'permission-denied') {
          addResult({
            test: `Acceso a ${collectionName} (admin)`,
            status: 'success',
            message: `Acceso denegado correctamente - Solo para administradores`,
            details: { note: 'Este es el comportamiento esperado para usuarios no administradores' }
          });
        } else {
          addResult({
            test: `Acceso a ${collectionName} (admin)`,
            status: 'error',
            message: `Error inesperado: ${error.code} - ${error.message}`,
            details: error
          });
        }
      }
    }

    setIsRunning(false);
  };

  useEffect(() => {
    // Auto-run diagnostics on component mount, but only on client
    if (typeof window !== 'undefined') {
      runDiagnostics();
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">🔍 Diagnóstico de Permisos Firestore</h2>
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isRunning ? 'Ejecutando...' : 'Ejecutar Diagnóstico'}
        </button>
      </div>

      <div className="space-y-3">
        {results.map((result, index) => (
          <div key={index} className="border rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-3 h-3 rounded-full ${
                result.status === 'success' ? 'bg-green-500' :
                result.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></span>
              <span className="font-medium">{result.test}</span>
            </div>
            <p className={`text-sm ${
              result.status === 'success' ? 'text-green-700' :
              result.status === 'error' ? 'text-red-700' : 'text-yellow-700'
            }`}>
              {result.message}
            </p>
            {result.details && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-gray-600">Ver detalles</summary>
                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {isRunning && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <p className="text-sm text-gray-600 mt-2">Ejecutando diagnósticos...</p>
        </div>
      )}
    </div>
  );
}