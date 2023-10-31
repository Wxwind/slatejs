export class Signal<T extends unknown[] = []> {
  listeners: ((...args: T) => void)[] = [];

  public active: boolean = true;

  on = (fn: (...args: T) => void) => {
    this.listeners.push(fn);
  };

  addListener = this.on;

  emit = (...args: T) => {
    if (!this.active) {
      return;
    }
    for (const fn of this.listeners) {
      fn.apply(this, args);
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
