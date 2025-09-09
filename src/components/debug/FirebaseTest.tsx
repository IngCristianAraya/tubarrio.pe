'use client';

import React, { useEffect, useState } from 'react';
import { useServices } from '@/context/ServicesContext';

export default function FirebaseTest() {
  const { services, loading, error, loadServicesFromFirestore } = useServices();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('🔍 Componente FirebaseTest montado');
    addLog(`📊 Estado inicial - Services: ${services.length}, Loading: ${loading}, Error: ${error}`);
  }, []);

  useEffect(() => {
    addLog(`📊 Services actualizados: ${services.length} servicios`);
    if (services.length > 0) {
      addLog(`✅ Primer servicio: ${services[0].title}`);
    }
  }, [services]);

  useEffect(() => {
    addLog(`🔄 Loading state: ${loading}`);
  }, [loading]);

  useEffect(() => {
    if (error) {
      addLog(`❌ Error: ${error}`);
    }
  }, [error]);

  const handleManualLoad = async () => {
    addLog('🔄 Iniciando carga manual de servicios...');
    try {
      await loadServicesFromFirestore();
      addLog('✅ Carga manual completada');
    } catch (err) {
      addLog(`❌ Error en carga manual: ${err}`);
    }
  };

  const handleTestFirebase = async () => {
    addLog('🔥 Probando Firebase directamente...');
    try {
      const { db } = await import('@/lib/firebase/config');
      if (!db) {
        addLog('❌ Firebase db no disponible');
        return;
      }
      
      addLog('✅ Firebase db disponible');
      
      // Probar una consulta simple
      const { collection, getDocs, query, where, limit } = await import('firebase/firestore');
      const servicesRef = collection(db, 'services');
      const q = query(servicesRef, where('active', '==', true), limit(5));
      
      addLog('🔄 Ejecutando consulta a Firestore...');
      const snapshot = await getDocs(q);
      addLog(`✅ Consulta exitosa: ${snapshot.size} documentos`);
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        addLog(`📄 Documento: ${doc.id} - ${data.title || 'Sin título'}`);
      });
      
    } catch (err) {
      addLog(`❌ Error probando Firebase: ${err}`);
    }
  };

  return (
    <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">🔥 Test Firebase & Services</h3>
      
      <div className="mb-4">
        <p><strong>Services:</strong> {services.length}</p>
        <p><strong>Loading:</strong> {loading ? 'Sí' : 'No'}</p>
        <p><strong>Error:</strong> {error || 'Ninguno'}</p>
      </div>

      <div className="mb-4 space-x-2">
        <button 
          onClick={handleManualLoad}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Cargar Servicios Manualmente
        </button>
        <button 
          onClick={handleTestFirebase}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Probar Firebase Directamente
        </button>
      </div>

      <div className="bg-gray-100 p-2 rounded max-h-60 overflow-y-auto">
        <h4 className="font-semibold mb-2">Logs:</h4>
        {testResults.map((result, index) => (
          <p key={index} className="text-sm font-mono">{result}</p>
        ))}
      </div>
    </div>
  );
}