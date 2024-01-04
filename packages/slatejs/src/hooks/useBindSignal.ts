import { Signal } from '@/signal';
import { useEffect } from 'react';

export const useBindSignal = (signal: Signal, callback: () => void) => {
  useEffect(() => {
    signal.on(callback);

    return () => {
      signal.off(callback);
    };
  }, [callback, signal]);
};
