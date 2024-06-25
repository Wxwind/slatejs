export class AsyncSeriesWaterfallHook<TAndR> {
  private callbacks: ((args: TAndR) => Promise<TAndR>)[] = [];

  tapPromise(fn: (args: TAndR) => Promise<TAndR>) {
    this.callbacks.push(fn);
  }

  async promise(args: TAndR): Promise<TAndR | null> {
    if (this.callbacks.length > 0) {
      let res = await this.callbacks[0](args);
      for (let i = 1; i < this.callbacks.length; i++) {
        const callback = this.callbacks[i];
        res = await callback(res);
      }

      return res;
    }

    return null;
  }
}
