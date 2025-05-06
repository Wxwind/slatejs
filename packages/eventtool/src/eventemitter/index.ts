import { EventArgs, EventListener, EventNames, ValidEventTypes } from './type';

/**
 * @example
 * const a1 = new EventEmitter<'a' | 'b', [number]>();
 * a1.on('a', (num) => {});
 * const a2 = new EventEmitter<{ a: (age: string) => void; b: (name: number) => number }>();
 * a2.on('a', (age) => {});
 */
export class EventEmitter<E extends ValidEventTypes = string | symbol, ARGS extends unknown[] = unknown[]> {
  listeners: {
    [P in EventNames<E>]?: EventListener<E, P, ARGS>[];
  } = {};

  once: <T extends EventNames<E>>(event: T, fn: EventListener<E, T, ARGS>) => this = (event, fn) => {
    const wrapFn: (...args: ARGS) => void = (...args) => {
      fn(...args);
      this.off(event, wrapFn as typeof fn);
    };

    this.on(event, wrapFn as typeof fn);
    return this;
  };

  on: <T extends EventNames<E>>(event: T, fn: EventListener<E, T, ARGS>) => this = (event, fn) => {
    (this.listeners[event] || (this.listeners[event] = [])).push(fn);
    return this;
  };

  addListener = this.on;

  off = <T extends EventNames<E>>(event: T, fn: EventListener<E, T, ARGS>) => {
    const arr = this.listeners[event];
    if (!arr) return;
    for (let i = 0; i < arr.length; i++) {
      if (fn === arr[i]) {
        arr.splice(i, 1);
      }
    }
    return this;
  };

  removeListener = this.off;

  emit: <T extends EventNames<E>>(event: T, ...args: EventArgs<E, T, ARGS>) => void = (event, ...args) => {
    const listeners = this.listeners[event]?.slice();
    if (!listeners) return;

    for (let index = 0; index < listeners.length; index++) {
      const fn = listeners[index];
      fn(...(args as ARGS));
    }
  };
}
