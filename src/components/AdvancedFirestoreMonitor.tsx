'use client';

import React, { useState, useEffect } from 'react';
import { useFirestoreReadTracker } from '@/hooks/useFirestoreReadTracker';

interface AdvancedFirestoreMonitorProps {
  enabled?: boolean;
  autoShow?: boolean;
}

export default function AdvancedFirestoreMonitor({ 
  enabled = true, 
  autoShow = false 
}: AdvancedFirestoreMonitorProps) {
  const [isVisible, setIsVisible] = useState(autoShow);
  const [isExpanded, setIsExpanded] = useState(false);
  const { stats, resetStats, getStatsByComponent, isTracking } = useFirestoreReadTracker(enabled);

  // Auto-mostrar cuando hay lecturas
  useEffect(() => {
    if (stats.totalReads > 0 && !isVisible) {
      setIsVisible(true);
    }
  }, [stats.totalReads, isVisible]);

  if (!enabled) return null;

  const componentStats = getStatsByComponent();
  const sortedComponents = Object.entries(componentStats)
    .sort(([,a], [,b]) => b.reads - a.reads);

  const getOptimizationLevel = () => {
    if (stats.totalReads === 0) return { level: 'excellent', color: 'green', message: 'Sin lecturas detectadas' };
    if (stats.totalReads <= 5) return { level: 'good', color: 'blue', message: 'Consumo bajo' };
    if (stats.totalReads <= 15) return { level: 'warning', color: 'yellow', message: 'Consumo moderado' };
    return { level: 'critical', color: 'red', message: 'Consumo alto - Requiere optimización' };
  };

  const optimization = getOptimizationLevel();

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className={`px-4 py-2 rounded-full text-white font-bold shadow-lg transition-all duration-300 ${
            optimization.color === 'green' ? 'bg-green-500 hover:bg-green-600' :
            optimization.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' :
            optimization.color === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600' :
            'bg-red-500 hover:bg-red-600'
          }`}
          title="Monitor de Lecturas Firestore"
        >
          🔥 {stats.totalReads}
        </button>
      </div>

      {/* Panel de monitoreo */}
      {isVisible && (
        <div className="fixed top-4 right-4 z-40 bg-white rounded-lg shadow-2xl border border-gray-200 max-w-md w-full max-h-96 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              🔥 Monitor Firestore Avanzado
              {isTracking && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                {isExpanded ? '📊' : '📋'}
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-4 overflow-y-auto max-h-80">
            {/* Estadísticas principales */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  optimization.color === 'green' ? 'text-green-600' :
                  optimization.color === 'blue' ? 'text-blue-600' :
                  optimization.color === 'yellow' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {stats.totalReads}
                </div>
                <div className="text-xs text-gray-500">Lecturas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">{stats.totalDocs}</div>
                <div className="text-xs text-gray-500">Documentos</div>
              </div>
            </div>

            {/* Estado de optimización */}
            <div className={`p-3 rounded-lg mb-4 ${
              optimization.color === 'green' ? 'bg-green-50 border border-green-200' :
              optimization.color === 'blue' ? 'bg-blue-50 border border-blue-200' :
              optimization.color === 'yellow' ? 'bg-yellow-50 border border-yellow-200' :
              'bg-red-50 border border-red-200'
            }`}>
              <div className={`text-sm font-medium ${
                optimization.color === 'green' ? 'text-green-800' :
                optimization.color === 'blue' ? 'text-blue-800' :
                optimization.color === 'yellow' ? 'text-yellow-800' :
                'text-red-800'
              }`}>
                {optimization.message}
              </div>
            </div>

            {/* Estadísticas por componente */}
            {sortedComponents.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">📊 Lecturas por Componente:</h4>
                <div className="space-y-2">
                  {sortedComponents.map(([component, data]) => (
                    <div key={component} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-700">{component}</span>
                      <div className="flex gap-2 text-xs">
                        <span className={`px-2 py-1 rounded ${
                          data.reads > 10 ? 'bg-red-100 text-red-700' :
                          data.reads > 5 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {data.reads} lecturas
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {data.docs} docs
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Eventos detallados (modo expandido) */}
            {isExpanded && stats.events.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">📋 Historial de Lecturas:</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {stats.events.slice(-10).reverse().map((event) => (
                    <div key={event.id} className="text-xs p-2 bg-gray-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">#{event.id} - {event.component}</span>
                        <span className="text-gray-500">{event.timestamp}</span>
                      </div>
                      <div className="text-gray-600 mt-1">
                        {event.collection}: {event.docsRead} docs en {event.queryTime}ms
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recomendaciones */}
            {stats.totalReads > 5 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-2">💡 Recomendaciones:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  {sortedComponents.some(([,data]) => data.reads > 5) && (
                    <li>• Implementar cache más agresivo en componentes con muchas lecturas</li>
                  )}
                  {stats.totalReads > 15 && (
                    <li>• Considerar usar datos mock en desarrollo</li>
                  )}
                  {sortedComponents.filter(([,data]) => data.reads > 3).length > 2 && (
                    <li>• Revisar useEffect dependencies para evitar re-renders</li>
                  )}
                  <li>• Verificar que no hay consultas duplicadas</li>
                </ul>
              </div>
            )}

            {/* Controles */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={resetStats}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
              >
                🔄 Reset
              </button>
              <button
                onClick={() => console.log('Firestore Stats:', { stats, componentStats })}
                className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
              >
                📊 Log Stats
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}