'use client';

import { useState } from 'react';

export default function ClearStorageButton() {
  const [clearing, setClearing] = useState(false);

  const clearAllStorage = () => {
    setClearing(true);
    
    console.log('🧹 Limpiando almacenamiento del navegador...');

    // Limpiar localStorage
    try {
      const localStorageKeys = Object.keys(localStorage);
      console.log('📦 localStorage keys encontradas:', localStorageKeys);
      localStorage.clear();
      console.log('✅ localStorage limpiado');
    } catch (error) {
      console.error('❌ Error limpiando localStorage:', error);
    }

    // Limpiar sessionStorage
    try {
      const sessionStorageKeys = Object.keys(sessionStorage);
      console.log('📦 sessionStorage keys encontradas:', sessionStorageKeys);
      sessionStorage.clear();
      console.log('✅ sessionStorage limpiado');
    } catch (error) {
      console.error('❌ Error limpiando sessionStorage:', error);
    }

    // Limpiar cookies relacionadas con Firebase
    try {
      const cookies = document.cookie.split(';');
      console.log('🍪 Cookies encontradas:', cookies.length);
      
      cookies.forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        // Eliminar cookies relacionadas con Firebase
        if (name.includes('firebase') || name.includes('auth') || name.includes('session')) {
          console.log('🗑️ Eliminando cookie:', name);
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        }
      });
      
      console.log('✅ Cookies de Firebase limpiadas');
    } catch (error) {
      console.error('❌ Error limpiando cookies:', error);
    }

    console.log('🎉 Limpieza completa. Recargando página...');
    
    // Recargar la página después de un breve delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <button
      onClick={clearAllStorage}
      disabled={clearing}
      style={{
        position: 'fixed',
        top: '60px',
        left: '10px',
        backgroundColor: clearing ? '#666' : '#dc2626',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '5px',
        border: 'none',
        fontSize: '12px',
        cursor: clearing ? 'not-allowed' : 'pointer',
        zIndex: 9999,
        fontFamily: 'monospace'
      }}
    >
      {clearing ? '🧹 Limpiando...' : '🧹 Limpiar Storage'}
    </button>
  );
}