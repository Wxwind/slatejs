export class Signal<T extends unknown[] = []> {
  listeners: ((...args: T) => void)[] = [];

  on = (fn: (...args: T) => void) => {
    this.listeners.push(fn);
  };

  addListener = this.on;

  emit = (...args: T) => {
    const listeners = this.listeners.slice();
    if (!listeners) return;

    for (let index = 0; index < listeners.length; index++) {
      const fn = listeners[index];
      fn(...args);
    }
  };

  off = (fn: (...args: T) => void) => {
    for (let i = 0; i < this.listeners.length; i++) {
      if (fn === this.listeners[i]) {
        this.listeners.splice(i, 1);
      }
    }
  };

  removeListener = this.off;

  removeAllListeners = () => {
    this.listeners = [];
  };

  once = (fn: (...args: T) => void) => {
    const onceWrapper = (...args: T) => {
      this.off(onceWrapper);
      fn.apply(this, args);
    };
    this.on(onceWrapper);
  };
}
