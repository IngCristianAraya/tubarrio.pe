'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function TestFirebaseConnection() {
  const [status, setStatus] = useState('Checking Firebase connection...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Connecting to Firestore...');
        
        // Test Firestore connection by trying to read a document
        const servicesRef = collection(db.instance, 'services');
        const snapshot = await getDocs(servicesRef);
        
        if (!snapshot.empty) {
          setStatus(`✅ Successfully connected to Firestore. Found ${snapshot.size} services.`);
        } else {
          setStatus('✅ Connected to Firestore, but no services found.');
        }
      } catch (err) {
        console.error('Firestore connection error:', err);
        setError(`Failed to connect to Firestore: ${err instanceof Error ? err.message : String(err)}`);
        setStatus('❌ Connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="font-medium mb-2">Firebase Connection Test</h3>
      <div className="text-sm">
        <p>Status: {status}</p>
        {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      </div>
    </div>
  );
}
