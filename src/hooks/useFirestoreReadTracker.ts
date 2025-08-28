'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface ReadEvent {
  id: number;
  timestamp: string;
  collection: string;
  docsRead: number;
  queryTime: number;
  stackTrace: string;
  component: string;
}

interface ReadStats {
  totalReads: number;
  totalDocs: number;
  events: ReadEvent[];
  startTime: number;
  isTracking: boolean;
}

export function useFirestoreReadTracker(enabled: boolean = true) {
  const [stats, setStats] = useState<ReadStats>({
    totalReads: 0,
    totalDocs: 0,
    events: [],
    startTime: Date.now(),
    isTracking: false
  });
  
  const originalGetDocsRef = useRef<any>(null);
  const isSetupRef = useRef(false);
  const readCounterRef = useRef(0);
  const moduleRef = useRef<any>(null);

  // Función para detectar el componente que hace la llamada
  const detectComponent = useCallback(() => {
    const stack = new Error().stack || '';
    const lines = stack.split('\n');
    
    // Buscar líneas que contengan nombres de componentes conocidos
    for (const line of lines) {
      if (line.includes('FeaturedServices')) return 'FeaturedServices';
      if (line.includes('ServicesContext')) return 'ServicesContext';
      if (line.includes('TodosLosServicios')) return 'TodosLosServicios';
      if (line.includes('AnalyticsContext')) return 'AnalyticsContext';
      if (line.includes('FirestorePermissions')) return 'FirestorePermissionsDiagnostic';
    }
    
    return 'Unknown';
  }, []);

  // Función para interceptar getDocs ANTES de que se ejecute
  const setupEarlyInterceptor = useCallback(async () => {
    if (!enabled || isSetupRef.current) return;
    
    try {
      console.log('🔍 Configurando interceptor temprano de Firestore...');
      
      // Importar el módulo de Firestore
      const firestoreModule = await import('firebase/firestore');
      moduleRef.current = firestoreModule;
      
      // Guardar la función original
      if (!originalGetDocsRef.current) {
        originalGetDocsRef.current = firestoreModule.getDocs;
      }
      
      // Crear función interceptora
      const interceptedGetDocs = async function(query: any) {
        const startTime = Date.now();
        readCounterRef.current += 1;
        const readId = readCounterRef.current;
        const component = detectComponent();
        
        console.log(`🚨 FIRESTORE READ #${readId} DETECTADA:`);
        console.log(`   📍 Componente: ${component}`);
        console.log(`   ⏰ Tiempo: ${new Date().toLocaleTimeString()}`);
        
        try {
          // Ejecutar la consulta original
          const result = await originalGetDocsRef.current(query);
          const docsRead = result.size;
          const queryTime = Date.now() - startTime;
          
          // Extraer información de la colección
          let collection = 'unknown';
          try {
            if (query && query._query && query._query.path && query._query.path.segments) {
              collection = query._query.path.segments[query._query.path.segments.length - 1];
            }
          } catch (e) {
            // Ignorar errores al extraer información
          }
          
          const readEvent: ReadEvent = {
            id: readId,
            timestamp: new Date().toLocaleTimeString(),
            collection,
            docsRead,
            queryTime,
            stackTrace: new Error().stack || '',
            component
          };
          
          // Actualizar estadísticas
          setStats(prevStats => ({
            ...prevStats,
            totalReads: prevStats.totalReads + 1,
            totalDocs: prevStats.totalDocs + docsRead,
            events: [...prevStats.events, readEvent],
            isTracking: true
          }));
          
          console.log(`✅ FIRESTORE READ #${readId} COMPLETADA:`);
          console.log(`   📊 Documentos: ${docsRead}`);
          console.log(`   ⏱️ Tiempo: ${queryTime}ms`);
          console.log(`   🗂️ Colección: ${collection}`);
          console.log(`   📍 Componente: ${component}`);
          
          return result;
        } catch (error) {
          console.error(`❌ Error en Firestore Read #${readId}:`, error);
          throw error;
        }
      };
      
      // Reemplazar la función en el módulo
      Object.defineProperty(firestoreModule, 'getDocs', {
        value: interceptedGetDocs,
        writable: true,
        configurable: true
      });
      
      isSetupRef.current = true;
      console.log('✅ Interceptor de Firestore configurado correctamente');
      
    } catch (error) {
      console.error('❌ Error configurando interceptor:', error);
    }
  }, [enabled, detectComponent]);

  // Configurar interceptor al montar
  useEffect(() => {
    if (enabled) {
      setupEarlyInterceptor();
    }
    
    return () => {
      // Restaurar función original al desmontar
      if (originalGetDocsRef.current && moduleRef.current) {
        try {
          Object.defineProperty(moduleRef.current, 'getDocs', {
            value: originalGetDocsRef.current,
            writable: true,
            configurable: true
          });
        } catch (error) {
          console.warn('No se pudo restaurar getDocs original:', error);
        }
      }
    };
  }, [enabled, setupEarlyInterceptor]);

  // Función para resetear estadísticas
  const resetStats = useCallback(() => {
    setStats({
      totalReads: 0,
      totalDocs: 0,
      events: [],
      startTime: Date.now(),
      isTracking: isSetupRef.current
    });
    readCounterRef.current = 0;
  }, []);

  // Función para obtener estadísticas por componente
  const getStatsByComponent = useCallback(() => {
    const componentStats: Record<string, { reads: number; docs: number; events: ReadEvent[] }> = {};
    
    stats.events.forEach(event => {
      if (!componentStats[event.component]) {
        componentStats[event.component] = { reads: 0, docs: 0, events: [] };
      }
      componentStats[event.component].reads += 1;
      componentStats[event.component].docs += event.docsRead;
      componentStats[event.component].events.push(event);
    });
    
    return componentStats;
  }, [stats.events]);

  return {
    stats,
    resetStats,
    getStatsByComponent,
    isTracking: stats.isTracking
  };
}