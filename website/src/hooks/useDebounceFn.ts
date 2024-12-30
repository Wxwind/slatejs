import { useMemo, useRef } from 'react';
import { useLatest } from './useLatest';

type AnyFunc = (...args: any[]) => any;

export function useDebounceFn<T extends AnyFunc>(fn: T, delay: number = 200) {
  const fnRef = useLatest(fn);
  const timerRef = useRef<number | null>(null);

  const newFn = useMemo(() => {
    return (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        fnRef.current?.(...args);
      }, delay);
    };
  }, []);

  return newFn;
}
