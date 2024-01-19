export class EventEmitter<
  E extends string = string,
  T extends unknown[] = unknown[],
  F extends (...args: T) => void = () => void
> {
  listeners: {
    [P in E]?: F[];
  } = {};

  on = (event: E, fn: F) => {
    (this.listeners[event] || (this.listeners[event] = [])).push(fn);
  };

  addListener = this.on;

  off = (event: E, fn: F) => {
    const arr = this.listeners[event];
    if (!arr) return;
    for (let i = 0; i < arr.length; i++) {
      if (fn === arr[i]) {
        arr.splice(i, 1);
      }
    }
  };

  removeListener = this.off;

  emit: (event: E, ...args: T) => void = (event, ...args) => {
    this.listeners[event]?.forEach((fn) => {
      fn(...args);
    });
  };
}
