import { Signal } from 'deer-engine';
import { useEffect } from 'react';

export function useBindSignal<T extends unknown[] = []>(signal: Signal<T> | undefined, callback: (...args: T) => void) {
  useEffect(() => {
    signal?.on(callback);

    return () => {
      signal?.off(callback);
    };
  }, [callback, signal]);
}
