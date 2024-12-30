import { useRef } from 'react';

export function useLatest<T>(fn: T) {
  const fnRef = useRef<T>(undefined as T);
  fnRef.current = fn;

  return fnRef;
}
