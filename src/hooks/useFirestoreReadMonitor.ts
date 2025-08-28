'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface ReadQuery {
  queryNumber: number;
  docsRead: number;
  queryTime: number;
  timestamp: string;
  queryType: string;
  collection?: string;
}

interface FirestoreStats {
  totalReads: number;
  totalDocs: number;
  queries: ReadQuery[];
  startTime: number;
}

export function useFirestoreReadMonitor(enabled: boolean = true) {
  const [stats, setStats] = useState<FirestoreStats>({
    totalReads: 0,
    totalDocs: 0,
    queries: [],
    startTime: Date.now()
  });
  
  const originalGetDocsRef = useRef<any>(null);
  const isInterceptorSetupRef = useRef(false);
  const readCounterRef = useRef(0);

  // Función para interceptar getDocs
  const setupInterceptor = useCallback(async () => {
    if (!enabled || isInterceptorSetupRef.current) return;

    try {
      // Importar dinámicamente las funciones de Firestore
      const firestoreModule = await import('firebase/firestore');
      const { getDocs } = firestoreModule;
      
      // Guardar la función original si no la tenemos
      if (!originalGetDocsRef.current) {
        originalGetDocsRef.current = getDocs;
      }

      // Crear función interceptora
      const interceptedGetDocs = async function(query: any) {
        const startTime = Date.now();
        readCounterRef.current += 1;
        const queryNumber = readCounterRef.current;
        
        console.log(`🔍 Firestore Read #${queryNumber} iniciada...`);
        
        try {
          // Ejecutar la consulta original
          const result = await originalGetDocsRef.current(query);
          const docsRead = result.size;
          const queryTime = Date.now() - startTime;
          
          // Intentar determinar el tipo de consulta
          let queryType = 'unknown';
          let collection = 'unknown';
          
          try {
            // Extraer información de la consulta si es posible
            if (query && query._query) {
              const path = query._query.path;
              if (path && path.segments) {
                collection = path.segments[path.segments.length - 1];
                queryType = collection;
              }
            }
          } catch (e) {
            // Ignorar errores al extraer información de la consulta
          }
          
          const newQuery: ReadQuery = {
            queryNumber,
            docsRead,
            queryTime,
            timestamp: new Date().toLocaleTimeString(),
            queryType,
            collection
          };
          
          // Actualizar estadísticas
          setStats(prevStats => ({
            totalReads: prevStats.totalReads + 1,
            totalDocs: prevStats.totalDocs + docsRead,
            queries: [...prevStats.queries, newQuery],
            startTime: prevStats.startTime
          }));
          
          console.log(`✅ Firestore Read #${queryNumber} completada:`, {
            docs: docsRead,
            time: `${queryTime}ms`,
            collection,
            type: queryType
          });
          
          return result;
        } catch (error) {
          console.error(`❌ Error en Firestore Read #${queryNumber}:`, error);
          throw error;
        }
      };

      // Intentar reemplazar getDocs en el módulo
      try {
        // Método 1: Reemplazar en el objeto global si existe
        if (typeof window !== 'undefined') {
          (window as any).__firestoreInterceptor = interceptedGetDocs;
          (window as any).__originalGetDocs = originalGetDocsRef.current;
        }
        
        // Método 2: Monkey patch del módulo (más agresivo)
        Object.defineProperty(firestoreModule, 'getDocs', {
          value: interceptedGetDocs,
          writable: true,
          configurable: true
        });
        
        isInterceptorSetupRef.current = true;
        console.log('✅ Interceptor de Firestore configurado correctamente');
        
      } catch (patchError) {
        console.warn('⚠️ No se pudo aplicar monkey patch:', patchError);
      }
      
    } catch (error) {
      console.warn('⚠️ Error configurando interceptor de Firestore:', error);
    }
  }, [enabled]);

  // Resetear estadísticas
  const resetStats = useCallback(() => {
    setStats({
      totalReads: 0,
      totalDocs: 0,
      queries: [],
      startTime: Date.now()
    });
    readCounterRef.current = 0;
    console.log('🔄 Estadísticas de Firestore reseteadas');
  }, []);

  // Obtener estadísticas calculadas
  const getCalculatedStats = useCallback(() => {
    const totalTime = (Date.now() - stats.startTime) / 1000;
    const avgDocsPerQuery = stats.totalReads > 0 ? stats.totalDocs / stats.totalReads : 0;
    const avgQueryTime = stats.queries.length > 0 
      ? stats.queries.reduce((sum, q) => sum + q.queryTime, 0) / stats.queries.length 
      : 0;
    
    // Determinar estado de optimización
    let optimizationLevel: 'excellent' | 'good' | 'moderate' | 'high' = 'excellent';
    if (stats.totalReads > 10) optimizationLevel = 'high';
    else if (stats.totalReads > 5) optimizationLevel = 'moderate';
    else if (stats.totalReads > 2) optimizationLevel = 'good';
    
    return {
      ...stats,
      totalTime,
      avgDocsPerQuery,
      avgQueryTime,
      optimizationLevel
    };
  }, [stats]);

  // Configurar interceptor al montar
  useEffect(() => {
    if (enabled) {
      setupInterceptor();
    }
  }, [enabled, setupInterceptor]);

  return {
    stats: getCalculatedStats(),
    resetStats,
    isEnabled: enabled && isInterceptorSetupRef.current
  };
}

export default useFirestoreReadMonitor;