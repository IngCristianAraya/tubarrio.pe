'use client';

import { useFirebaseReady } from '@/hooks/useFirebaseReady';
import { useEffect, useState } from 'react';

export default function HookDebugger() {
  const { isReady: firebaseReady, isClient } = useFirebaseReady();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('🔧 HookDebugger - Cliente montado');
    console.log('🔧 HookDebugger - Hook values:', { firebaseReady, isClient });
  }, [firebaseReady, isClient]);

  if (!mounted) {
    return <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">Cargando debugger...</div>;
  }

  return (
    <div className="fixed top-4 right-4 p-4 bg-blue-100 border border-blue-400 rounded shadow-lg z-50">
      <h3 className="font-bold text-blue-800 mb-2">🔧 Hook Debug Info</h3>
      <div className="text-sm space-y-1">
        <div>🌐 <strong>isClient:</strong> <span className={isClient ? 'text-green-600' : 'text-red-600'}>{String(isClient)}</span></div>
        <div>🔥 <strong>firebaseReady:</strong> <span className={firebaseReady ? 'text-green-600' : 'text-red-600'}>{String(firebaseReady)}</span></div>
        <div>⏰ <strong>mounted:</strong> <span className="text-blue-600">{String(mounted)}</span></div>
        <div>🌍 <strong>window:</strong> <span className={typeof window !== 'undefined' ? 'text-green-600' : 'text-red-600'}>{typeof window !== 'undefined' ? 'disponible' : 'no disponible'}</span></div>
        <div>🔧 <strong>DISABLE_FIREBASE:</strong> <span className="text-gray-600">{process.env.NEXT_PUBLIC_DISABLE_FIREBASE || 'undefined'}</span></div>
      </div>
    </div>
  );
}