import { DebounceOptions, debounce } from './debounce';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fn = (...args: any[]) => void;

export type ThrottleOptions = DebounceOptions;

export function throttle<T extends Fn>(func: T, wait: number, options?: ThrottleOptions) {
  const leading = !!options?.leading;
  const trailing = !!options?.trailing;

  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  });
}
