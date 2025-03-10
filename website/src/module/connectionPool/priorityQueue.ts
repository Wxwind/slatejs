/* eslint-disable no-bitwise */
export class PriorityQueue<T> {
  private queue: T[] = [];

  public get size() {
    return this.queue.length;
  }

  /**
   *
   * @param compFn build max-heap if return is a < b
   */
  constructor(private compFn: (a: T, b: T) => boolean) {}

  // sink node[i] in nodes[0...end]
  private sink = (nodes: T[], i: number, end: number) => {
    const lSon = (i << 1) + 1;
    const rSon = (i << 1) + 2;
    let larger = i;
    if (lSon <= end && this.compFn(nodes[larger], nodes[lSon])) {
      larger = lSon;
    }
    if (rSon <= end && this.compFn(nodes[larger], nodes[rSon])) {
      larger = rSon;
    }
    if (larger !== i) {
      this.swap(nodes, i, larger);
      this.sink(nodes, larger, end);
    }
  };

  // swim node[i] in nodes[0...end]
  private swim = (nodes: T[], i: number, end: number) => {
    const p = (i - 1) >> 1;
    if (i > 1 && this.compFn(nodes[p], nodes[i])) {
      this.swap(nodes, i, p);
      this.swim(nodes, p, end);
    }
  };

  private swap = (queue: T[], i: number, j: number) => {
    const temp = queue[i];
    queue[i] = queue[j];
    queue[j] = temp;
  };

  build = (data: T[]) => {
    const end = data.length - 1;
    for (let i = end << 1; i >= 0; --i) {
      this.sink(data, i, end);
    }
    this.queue = data;
  };

  push = (el: T) => {
    this.queue.push(el);
    this.swim(this.queue, this.size - 1, this.size - 1);
  };

  pop = () => {
    if (this.size === 0) return null;
    this.swap(this.queue, 0, this.size - 1);
    this.sink(this.queue, 0, this.size - 2);
    const el = this.queue.splice(this.size - 1, 1);
    return el[0];
  };

  top = () => {
    if (this.size === 0) return null;
    return this.queue[0];
  };

  empty = () => {
    return this.size === 0;
  };
}
