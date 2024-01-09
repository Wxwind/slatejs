import { Signal } from 'deer-engine';

export abstract class StoreBase<T> {
  private listeners = new Signal<[]>();

  protected data: T | undefined;

  init = () => {
    this.refreshData();
  };

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

  abstract refreshData: () => void;
}
