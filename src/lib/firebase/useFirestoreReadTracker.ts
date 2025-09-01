'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import * as ffs from 'firebase/firestore';

// Tipos de datos
interface ReadEvent {
  id: number;
  timestamp: string;
  collection: string;
  docsRead: number;
  queryTime: number;
  component: string;
}

interface Stats {
  totalReads: number;
  totalDocs: number;
  events: ReadEvent[];
}

interface ComponentStats {
  [key: string]: {
    reads: number;
    docs: number;
  };
}

// Estado global para el tracker
let eventId = 0;
const readEvents: ReadEvent[] = [];
let isTrackingEnabled = false;

// Función para obtener el stack y el componente
const getCallerComponent = () => {
  try {
    throw new Error();
  } catch (e: any) {
    const stack = e.stack.split('\n');
    for (const line of stack) {
      if (line.includes('at ') && (line.includes('tsx') || line.includes('jsx'))) {
        const componentMatch = line.match(/at (\w+)/);
        if (componentMatch && componentMatch[1]) {
          return componentMatch[1];
        }
      }
    }
  }
  return 'Unknown';
};

// Wrapper para getDocs
export const trackedGetDocs = async (query: ffs.Query) => {
  if (!isTrackingEnabled) {
    return ffs.getDocs(query);
  }

  const startTime = performance.now();
  const querySnapshot = await ffs.getDocs(query);
  const endTime = performance.now();

  const event: ReadEvent = {
    id: eventId++,
    timestamp: new Date().toLocaleTimeString(),
    collection: (query as any)._query.path.segments.join('/'),
    docsRead: querySnapshot.size,
    queryTime: Math.round(endTime - startTime),
    component: getCallerComponent(),
  };

  readEvents.push(event);
  
  // Notificar a los listeners
  window.dispatchEvent(new CustomEvent('firestore-read'));

  return querySnapshot;
};

// Hook para el monitor
export const useFirestoreReadTracker = (enabled: boolean) => {
  const [stats, setStats] = useState<Stats>({
    totalReads: 0,
    totalDocs: 0,
    events: [],
  });
  
  isTrackingEnabled = enabled;

  const updateStats = useCallback(() => {
    const totalReads = readEvents.length;
    const totalDocs = readEvents.reduce((sum, event) => sum + event.docsRead, 0);
    setStats({
      totalReads,
      totalDocs,
      events: [...readEvents],
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleRead = () => updateStats();
    window.addEventListener('firestore-read', handleRead);
    updateStats(); // Carga inicial

    return () => {
      window.removeEventListener('firestore-read', handleRead);
    };
  }, [enabled, updateStats]);

  const resetStats = () => {
    readEvents.length = 0;
    eventId = 0;
    updateStats();
  };

  const getStatsByComponent = (): ComponentStats => {
    return readEvents.reduce((acc, event) => {
      if (!acc[event.component]) {
        acc[event.component] = { reads: 0, docs: 0 };
      }
      acc[event.component].reads += 1;
      acc[event.component].docs += event.docsRead;
      return acc;
    }, {} as ComponentStats);
  };

  return { stats, resetStats, getStatsByComponent, isTracking: isTrackingEnabled };
};