/* eslint-disable @typescript-eslint/no-explicit-any */
type Fn = (...args: any[]) => void;

export const debounce = <T extends Fn>(fn: T, delay = 500) => {
  let timer: number | null = null;

  return (...args: Parameters<T>) => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(fn, delay, ...args);
  };
};
