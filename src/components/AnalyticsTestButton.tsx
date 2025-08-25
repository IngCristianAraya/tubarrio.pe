'use client';

import { useState } from 'react';
import { useAnalytics } from '@/context/AnalyticsContext';

export function AnalyticsTestButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<string>('');
  const { trackPageView, trackEvent, state } = useAnalytics();

  const testPageView = async () => {
    setIsLoading(true);
    try {
      await trackPageView('/test-page-view');
      setLastResult('✅ Page view tracked successfully');
      console.log('Page view tracked:', '/test-page-view');
    } catch (error) {
      setLastResult('❌ Error tracking page view: ' + error);
      console.error('Error tracking page view:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testCustomEvent = async () => {
    setIsLoading(true);
    try {
      await trackEvent({
        type: 'service_click',
        serviceId: 'test-service-123',
        serviceName: 'Test Service',
        page: '/test'
      });
      setLastResult('✅ Custom event tracked successfully');
      console.log('Custom event tracked');
    } catch (error) {
      setLastResult('❌ Error tracking custom event: ' + error);
      console.error('Error tracking custom event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAnalyticsState = () => {
    console.log('=== ANALYTICS STATE ===');
    console.log('Events count:', state.events.length);
    console.log('Metrics:', state.metrics);
    console.log('Is loading:', state.isLoading);
    console.log('Recent events:', state.events.slice(-5));
    setLastResult(`📊 State logged to console. Events: ${state.events.length}`);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border z-50">
      <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">
        🧪 Analytics Test Panel
      </h3>
      
      <div className="space-y-2">
        <button
          onClick={testPageView}
          disabled={isLoading}
          className="w-full px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Page View'}
        </button>
        
        <button
          onClick={testCustomEvent}
          disabled={isLoading}
          className="w-full px-3 py-2 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Custom Event'}
        </button>
        
        <button
          onClick={checkAnalyticsState}
          className="w-full px-3 py-2 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Check State
        </button>
      </div>
      
      {lastResult && (
        <div className="mt-3 p-2 text-xs bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">
          {lastResult}
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
        Events: {state.events.length} | Loading: {state.isLoading ? 'Yes' : 'No'}
      </div>
    </div>
  );
}