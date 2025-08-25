'use client';

import React, { useState, useEffect } from 'react';

interface FirebaseStatusProps {
  isUsingLocalData: boolean;
  isRetrying?: boolean;
  retryCount?: number;
  nextRetryTime?: Date | null;
  onRetry: () => void;
}

export default function FirebaseStatus({ 
  isUsingLocalData, 
  isRetrying = false,
  retryCount = 0,
  nextRetryTime = null,
  onRetry 
}: FirebaseStatusProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeUntilRetry, setTimeUntilRetry] = useState<string>('');

  useEffect(() => {
    setIsVisible(isUsingLocalData);
  }, [isUsingLocalData]);

  useEffect(() => {
    if (!nextRetryTime) {
      setTimeUntilRetry('');
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = nextRetryTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeUntilRetry('Reintentando...');
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeUntilRetry(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextRetryTime]);

  const handleManualRetry = () => {
    onRetry();
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {isRetrying ? (
                <svg className="animate-spin h-5 w-5 text-blue-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-blue-800">
                {isRetrying ? 'Reintentando conexión...' : 'Usando datos locales'}
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                {isRetrying ? (
                  <p>Intentando reconectar con la base de datos...</p>
                ) : (
                  <p>Conectando con datos locales debido a límites temporales del servidor.</p>
                )}
                {nextRetryTime && timeUntilRetry && !isRetrying && (
                  <p className="mt-1">
                    Próximo reintento automático: {timeUntilRetry}
                  </p>
                )}
                {retryCount > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    Intentos: {retryCount}
                  </p>
                )}
              </div>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={handleManualRetry}
                  disabled={isRetrying}
                  className="text-sm bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed text-blue-800 px-3 py-1 rounded transition-colors"
                >
                  {isRetrying ? 'Reintentando...' : 'Reintentar ahora'}
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1 transition-colors"
                >
                  Ocultar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}