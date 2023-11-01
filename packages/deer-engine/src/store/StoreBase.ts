import { Signal } from '@/packages/signal';

export abstract class StoreBase<T = unknown> {
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

  /**
   * Though it's better to refeshData in store's methods, but we put it in
   * the commands itself dut to store's methods don't know which stores need
   * to update when undo cmds.
   */
  abstract refreshData: () => void;
}
