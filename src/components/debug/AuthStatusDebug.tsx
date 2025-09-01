'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export default function AuthStatusDebug() {
  const { user, loading, isAdmin } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = `[${timestamp}] user: ${user ? 'AUTHENTICATED' : 'NULL'}, loading: ${loading}, isAdmin: ${isAdmin}`;
      setLogs(prev => [...prev.slice(-4), logEntry]);
      console.log('🔍 AUTH DEBUG:', logEntry);
    }
  }, [user, loading, isAdmin, mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-xs font-mono z-50 max-w-md">
      <h3 className="font-bold mb-2">🔍 Auth Status Debug</h3>
      <div className="space-y-1">
        <div>User: <span className={user ? 'text-green-400' : 'text-red-400'}>{user ? 'AUTHENTICATED' : 'NULL'}</span></div>
        <div>Loading: <span className={loading ? 'text-yellow-400' : 'text-green-400'}>{loading.toString()}</span></div>
        <div>IsAdmin: <span className={isAdmin ? 'text-green-400' : 'text-red-400'}>{isAdmin.toString()}</span></div>
        <div>Email: <span className="text-blue-400">{user?.email || 'N/A'}</span></div>
      </div>
      <div className="mt-3 border-t border-gray-600 pt-2">
        <h4 className="font-bold mb-1">Recent Logs:</h4>
        {logs.map((log, i) => (
          <div key={i} className="text-xs text-gray-300">{log}</div>
        ))}
      </div>
    </div>
  );
}