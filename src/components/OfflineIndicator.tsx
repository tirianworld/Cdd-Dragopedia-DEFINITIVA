import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showReconnected) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-900/90 border border-emerald-500/50 px-3.5 py-2 text-xs font-semibold text-emerald-200 shadow-xl backdrop-blur-md animate-in fade-in">
        <Wifi className="h-4 w-4 text-emerald-400" />
        <span>Conexión restablecida</span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-[#1a140b]/95 border border-amber-500/50 px-3.5 py-2 text-xs font-semibold text-amber-200 shadow-xl backdrop-blur-md animate-in fade-in">
      <WifiOff className="h-4 w-4 text-amber-400" />
      <span>Modo sin conexión activo — Mostrando datos en caché de PC</span>
    </div>
  );
};
