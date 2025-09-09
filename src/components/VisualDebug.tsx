'use client';

import React, { useState, useEffect } from 'react';

export default function VisualDebug() {
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date().toLocaleTimeString());
    
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <h2 className="font-bold text-lg mb-2">🚨 DEBUG VISIBLE</h2>
      <div className="space-y-1 text-sm">
        <p>✅ Componente renderizado</p>
        <p>🔥 Firebase: {process.env.NEXT_PUBLIC_DISABLE_FIREBASE === 'true' ? 'DESHABILITADO' : 'HABILITADO'}</p>
        <p>📊 Entorno: {isClient ? 'CLIENTE' : 'SERVIDOR'}</p>
        <p>⏰ {currentTime}</p>
      </div>
    </div>
  );
}