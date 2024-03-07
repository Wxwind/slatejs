export class SyncHook<T extends unknown[] = [], R = void> {
  private callbacks: ((...args: T) => R)[] = [];

  tap(fn: (...args: T) => R) {
    this.callbacks.push(fn);
  }

  call(...args: T): void {
    this.callbacks.forEach(function (callback) {
      callback(...args);
    });
  }
}
