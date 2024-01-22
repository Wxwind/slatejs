type Fn = (...args: any[]) => void;

export function debounce<T extends Fn>(fn: T, delay = 200) {
  let timer: number | null = null;

  return (...args: Parameters<T>) => {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(fn, delay, ...args);
  };
}
