import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Database } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';

export const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        // Only check health if Supabase is configured
        if (!import.meta.env.VITE_SUPABASE_URL || 
            !import.meta.env.VITE_SUPABASE_ANON_KEY || 
            import.meta.env.VITE_SUPABASE_URL.includes('your-project')) {
          setDbConnected(null); // Not configured yet
          return;
        }

        // Simple check without throwing errors
        const { error } = await supabaseService.supabase
          .from('categories')
          .select('id')
          .limit(1);

        if (error && error.code === 'PGRST116') {
          setDbConnected(null); // Tables not created yet
        } else if (error) {
          setDbConnected(false); // Connection failed
        } else {
          setDbConnected(true); // Connected and working
        }
      } catch (error) {
        setDbConnected(false);
      }
    };

    if (isOnline) {
      checkDbConnection();
    } else {
      setDbConnected(false);
    }
  }, [isOnline]);

  // Only show status if there's an actual problem, not just "not set up yet"
  if (isOnline && (dbConnected === true || dbConnected === null)) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          {!isOnline ? (
            <>
              <WifiOff className="w-5 h-5" />
              <span className="font-medium">You're offline</span>
            </>
          ) : dbConnected === false ? (
            <>
              <Database className="w-5 h-5" />
              <span className="font-medium">Database connection failed</span>
            </>
          ) : (
            <>
              <Wifi className="w-5 h-5" />
              <span className="font-medium">Checking connection...</span>
            </>
          )}
        </div>
        <p className="text-sm mt-1">
          {!isOnline 
            ? "You can still browse the menu and add items to cart"
            : "Please check your Supabase connection"
          }
        </p>
      </div>
    </div>
  );
};