import { useRef } from 'react';
import { useLatest } from './useLatest';

type AnyFunc = (...args: any[]) => any;

export function useThrottleFn<T extends AnyFunc>(fn: T, delay: number = 200) {
  const fnRef = useLatest(fn);
  const timerRef = useRef<number | null>(null);

  const newFn = (...args: Parameters<T>[]) => {
    if (timerRef.current) {
      return;
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      fnRef.current(...args);
    }, delay);
  };

  return newFn;
}
