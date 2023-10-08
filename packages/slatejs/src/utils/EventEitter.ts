export class EventEmitter<T extends unknown[]> {
  listeners: {
    [P in string]: ((...args: T) => void)[];
  } = {};

  constructor() {
    this.listeners = {};
  }

  on = (event: string, fn: (...args: T) => void) => {
    (this.listeners[event] || (this.listeners[event] = [])).push(fn);
  };

  addListener = this.on;

  emit = (event: string, ...args: T) => {
    const e = this.listeners[event];
    if (!e) return undefined;
    for (const fn of e) {
      fn.apply(this, args);
    }
  };

  off = (event: string, fn: (...args: T) => void) => {
    const e = this.listeners[event];
    if (!e) return undefined;
    for (let i = 0; i < e.length; i++) {
      if (fn === e[i]) {
        e.splice(i, 1);
      }
    }
  };

  removeListener = this.off;

  removeAllListeners = (event: string) => {
    let e = this.listeners[event];
    if (!e) return;
    e = [];
  };

  once = (event: string, fn: (...args: T) => void) => {
    const onceWrapper = (...args: T) => {
      this.off(event, onceWrapper);
      fn.apply(this, args);
    };
    this.on(event, onceWrapper);
  };
}
