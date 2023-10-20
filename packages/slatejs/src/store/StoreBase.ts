import { Signal } from '../utils';

export abstract class StoreBase<T> {
  private listeners = new Signal<[]>();

  protected data: T | undefined;

  subscribe = (fn: () => void) => {
    this.listeners.addListener(fn);
    return () => {
      this.listeners.removeListener(fn);
    };
  };

  getData: () => T | undefined = () => {
    return this.data;
  };

  protected emit = () => {
    this.listeners.emit();
  };
}
