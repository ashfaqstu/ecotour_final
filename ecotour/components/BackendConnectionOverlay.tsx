import React, { useState, useEffect } from 'react';
import { checkBackendHealth } from '../services/apiService';

interface BackendConnectionOverlayProps {
  onConnected: () => void;
  onFallback: () => void;
}

export const BackendConnectionOverlay: React.FC<BackendConnectionOverlayProps> = ({
  onConnected,
  onFallback,
}) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'failed'>('connecting');
  const [attempts, setAttempts] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(dotInterval);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();
    const maxDuration = 30000;

    const tryConnect = async () => {
      if (!isMounted) return;

      const elapsed = Date.now() - startTime;
      if (elapsed >= maxDuration) {
        setStatus('failed');
        setTimeout(() => {
          if (isMounted) onFallback();
        }, 2000);
        return;
      }

      try {
        const isHealthy = await checkBackendHealth();
        if (!isMounted) return;

        if (isHealthy) {
          setStatus('connected');
          setTimeout(() => {
            if (isMounted) onConnected();
          }, 800);
        } else {
          setAttempts(prev => prev + 1);
          setTimeout(tryConnect, 3000);
        }
      } catch {
        if (!isMounted) return;
        setAttempts(prev => prev + 1);
        setTimeout(tryConnect, 3000);
      }
    };

    tryConnect();

    return () => {
      isMounted = false;
    };
  }, [onConnected, onFallback]);

  if (status === 'connected') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Connected!</h2>
          <p className="text-gray-600 dark:text-gray-300">Backend is ready</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Backend Unavailable</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-1">Entering demo mode</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Some features may be limited</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-200 dark:border-emerald-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Connecting{dots}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We use a free Render service. Please wait while the backend wakes up from sleep.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          This usually takes 2-3 minutes
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
          <span>Attempt {attempts + 1}</span>
          <span>•</span>
          <span>{Math.min(30, Math.floor((attempts + 1) * 3))}s elapsed</span>
        </div>
      </div>
    </div>
  );
};
