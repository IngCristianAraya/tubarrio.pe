'use client';

import { useServices } from '@/context/ServicesContext';
import FirebaseStatus from './FirebaseStatus';

interface FirebaseStatusWrapperProps {
  children: React.ReactNode;
}

export default function FirebaseStatusWrapper({ children }: FirebaseStatusWrapperProps) {
  const { 
    loading, 
    services, 
    error, 
    isRetrying, 
    retryCount, 
    nextRetryTime, 
    retryConnection 
  } = useServices();
  
  // Determinar si estamos usando datos locales
  const isUsingLocalData = !loading && services.length > 0 && (
    error?.includes('Quota exceeded') || 
    error?.includes('resource-exhausted') ||
    error?.includes('429')
  );
  
  return (
    <>
      <FirebaseStatus 
        isUsingLocalData={isUsingLocalData}
        isRetrying={isRetrying}
        retryCount={retryCount}
        nextRetryTime={nextRetryTime}
        onRetry={retryConnection}
      />
      {children}
    </>
  );
}