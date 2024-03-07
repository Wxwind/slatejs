export class AsyncParallelHook<T extends unknown[] = []> {
  private callbacks: ((...args: T) => Promise<void>)[] = [];

  tapPromise(fn: (...args: T) => Promise<void>) {
    this.callbacks.push(fn);
  }

  promise(...args: T): Promise<void[]> {
    return Promise.all(
      this.callbacks.map(function (callback) {
        return callback(...args);
      })
    );
  }
}
