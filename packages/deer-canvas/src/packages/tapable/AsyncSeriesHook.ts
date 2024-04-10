export class AsyncSeriesHook<T extends unknown[] = []> {
  private callbacks: ((...args: T) => Promise<void>)[] = [];

  tapPromise(fn: (...args: T) => Promise<void>) {
    this.callbacks.push(fn);
  }

  async promise(...args: T): Promise<void> {
    for (let i = 0; i < this.callbacks.length; i++) {
      const callback = this.callbacks[i];
      await callback(...args);
    }

    return;
  }
}
