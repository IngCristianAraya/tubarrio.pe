'use client';

import React, { useState } from 'react';
import { useFirestoreReadMonitor } from '@/hooks/useFirestoreReadMonitor';

interface FirestoreReadMonitorProps {
  enabled?: boolean;
  autoShow?: boolean;
}

export default function FirestoreReadMonitor({ 
  enabled = true, 
  autoShow = false 
}: FirestoreReadMonitorProps) {
  const [isVisible, setIsVisible] = useState(autoShow);
  const { stats, resetStats, isEnabled } = useFirestoreReadMonitor(enabled);
  
  // Determinar estado de optimización
  let optimizationColor = 'text-green-600';
  let optimizationBg = 'bg-green-50';
  
  if (stats.optimizationLevel === 'high') {
    optimizationColor = 'text-red-600';
    optimizationBg = 'bg-red-50';
  } else if (stats.optimizationLevel === 'moderate') {
    optimizationColor = 'text-orange-600';
    optimizationBg = 'bg-orange-50';
  } else if (stats.optimizationLevel === 'good') {
    optimizationColor = 'text-yellow-600';
    optimizationBg = 'bg-yellow-50';
  }

  if (!enabled) {
    return null;
  }

  return (
    <>
      {/* Botón flotante para mostrar/ocultar */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        title={`Monitor de Lecturas Firestore ${isEnabled ? '(Activo)' : '(Inactivo)'}`}
      >
        📊
        {stats.totalReads > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {stats.totalReads}
          </span>
        )}
      </button>

      {/* Panel de estadísticas */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-96 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              📊 Monitor Firestore
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded ${isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isEnabled ? 'Activo' : 'Inactivo'}
              </span>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Estadísticas principales */}
          <div className={`p-3 rounded-lg mb-4 ${optimizationBg}`}>
            <div className={`text-sm font-medium ${optimizationColor} mb-2`}>
              Estado: {stats.optimizationLevel === 'excellent' ? '🟢 Excelente' : 
                      stats.optimizationLevel === 'good' ? '🟡 Bueno' :
                      stats.optimizationLevel === 'moderate' ? '🟠 Moderado' : '🔴 Alto consumo'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Lecturas:</span> {stats.totalReads}
              </div>
              <div>
                <span className="font-medium">Docs:</span> {stats.totalDocs}
              </div>
              <div>
                <span className="font-medium">Tiempo:</span> {stats.totalTime.toFixed(1)}s
              </div>
              <div>
                <span className="font-medium">Promedio:</span> {stats.avgDocsPerQuery.toFixed(1)} docs/query
              </div>
            </div>
          </div>

          {/* Botón de reset */}
          <button
            onClick={resetStats}
            className="w-full mb-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded transition-colors"
          >
            🔄 Resetear Estadísticas
          </button>

          {/* Lista de consultas recientes */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Consultas Recientes ({stats.queries.length})
            </h4>
            {stats.queries.slice(-5).reverse().map((query) => (
              <div key={query.queryNumber} className="bg-gray-50 p-2 rounded text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-medium">#{query.queryNumber}</span>
                  <span className="text-gray-500">{query.timestamp}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>{query.docsRead} docs</span>
                  <span>{query.queryTime}ms</span>
                </div>
                <div className="text-gray-600 mt-1">
                  {query.collection || query.queryType}
                </div>
              </div>
            ))}
          </div>

          {/* Recomendaciones */}
          {stats.totalReads > 5 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                💡 Recomendaciones
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                {stats.totalReads > 10 && (
                  <li>• Implementar cache más agresivo</li>
                )}
                {stats.avgDocsPerQuery > 20 && (
                  <li>• Reducir límite de documentos por consulta</li>
                )}
                {stats.queries.length > 8 && (
                  <li>• Optimizar useEffect dependencies</li>
                )}
                <li>• Verificar que no hay consultas duplicadas</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}