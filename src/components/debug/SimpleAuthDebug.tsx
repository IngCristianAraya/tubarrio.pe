'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function SimpleAuthDebug() {
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    console.log('🔍 SIMPLE AUTH DEBUG:', {
      user: user ? 'AUTHENTICATED' : 'NULL',
      email: user?.email || 'N/A',
      loading,
      isAdmin,
      timestamp: new Date().toISOString()
    });
  }, [user, loading, isAdmin]);

  // Mostrar información en pantalla
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      backgroundColor: 'black',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div>🔍 AUTH DEBUG</div>
      <div>User: {user ? '✅ AUTH' : '❌ NULL'}</div>
      <div>Loading: {loading ? '⏳ TRUE' : '✅ FALSE'}</div>
      <div>IsAdmin: {isAdmin ? '👑 TRUE' : '❌ FALSE'}</div>
      <div>Email: {user?.email || 'N/A'}</div>
    </div>
  );
}