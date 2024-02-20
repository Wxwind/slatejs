type Fn = (...args: any[]) => void;

export function throttle<T extends Fn>(fn: T, timeout = 200) {
  let timer: number | null = null;

  return function (...args: Parameters<T>) {
    if (timer) return;

    timer = setTimeout(() => {
      fn(...args);
      timer = -1;
    }, timeout);
  };
}
