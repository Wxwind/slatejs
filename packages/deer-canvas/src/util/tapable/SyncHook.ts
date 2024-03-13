export class SyncHook<T extends unknown[] = [], R = void> {
  private callbacks: ((...args: T) => R)[] = [];

  tap(fn: (...args: T) => R) {
    this.callbacks.push(fn);
  }

  call(...args: T): R | undefined {
    let res: R | undefined = undefined;
    this.callbacks.forEach((callback) => {
      res = callback(...args);
    });

    return res;
  }
}
