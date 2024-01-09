import { Signal } from 'deer-engine';
import { useEffect } from 'react';

export const useBindSignal = (signal: Signal | undefined, callback: () => void) => {
  useEffect(() => {
    signal?.on(callback);

    return () => {
      signal?.off(callback);
    };
  }, [callback, signal]);
};
