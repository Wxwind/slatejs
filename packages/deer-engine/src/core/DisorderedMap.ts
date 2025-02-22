import { quickSort } from '@/util';

/**
 * High-performance unordered array, delete uses exchange method to improve performance, internal capacity only increases.
 * 以10000长度的数组的删除为例,DisorderedArray删除为0.001ms, splice删除为0.002, filter 为0.2
 */
export class DisorderedArray<T> {
  length = 0;

  _elements: T[];

  private _isLooping = false;
  private _blankCount = 0;

  constructor(count: number = 0) {
    this._elements = new Array<T>(count);
  }

  add(element: T): void {
    if (this.length === this._elements.length) {
      this._elements.push(element);
    } else {
      this._elements[this.length] = element;
    }
    this.length++;
  }

  delete(element: T): void {
    // @todo: It can be optimized for custom binary search and other algorithms, currently this._elements>=this.length wastes performance.
    const index = this._elements.indexOf(element);
    this.deleteByIndex(index);
  }

  set(index: number, element: T): void {
    if (index >= this.length) {
      throw 'Index is out of range.';
    }
    this._elements[index] = element;
  }

  get(index: number): T {
    if (index >= this.length) {
      throw 'Index is out of range.';
    }
    return this._elements[index];
  }

  /**
   * Delete the element at the specified index.
   * @param index - The index of the element to be deleted
   * @returns The replaced item is used to reset its index
   */
  deleteByIndex(index: number): T | undefined {
    const elements = this._elements;
    let end: T | undefined;

    if (this._isLooping) {
      this._elements[index] = null as T;
      this._blankCount++;
    } else {
      const endIndex = this.length - 1;
      if (index !== endIndex) {
        end = elements[endIndex];
        elements[index] = end;
      }
      elements[endIndex] = null as T;
      this.length--;
    }

    return end;
  }

  forEach(callbackFn: (element: T, index: number) => void, swapFn?: (element: T, index: number) => void): void {
    this._startLoop();
    const elements = this._elements;
    for (let i = 0, n = this.length; i < n; i++) {
      const element = elements[i];
      element && callbackFn(element, i);
    }
    this._endLoop(swapFn);
  }

  forEachAndClean(callbackFn: (e: T) => void, swapFn: (element: T, index: number) => void): void {
    this._startLoop();
    const preEnd = this.length;
    const elements = this._elements;
    for (let i = 0, n = preEnd; i < n; i++) {
      const element = elements[i];
      element && callbackFn(element);
    }
    this._endLoopAndClean(preEnd, elements, swapFn);
  }

  sort(compareFn: (a: T, b: T) => number): void {
    quickSort(this._elements, 0, this.length, compareFn);
  }

  garbageCollection(): void {
    this._elements.length = this.length;
  }

  private _startLoop(): void {
    this._isLooping = true;
  }

  private _endLoop(swapFn?: (e: T, idx: number) => void): void {
    this._isLooping = false;
    if (this._blankCount) {
      let from = 0;
      let to = this.length - 1;
      const elements = this._elements;
      partition: do {
        while (elements[from])
          if (++from >= to) {
            break partition;
          }

        while (!elements[to])
          if (from >= --to) {
            break partition;
          }

        const swapElement = elements[to];
        swapFn?.(swapElement, from);
        elements[from++] = swapElement;
        elements[to--] = null as T;
      } while (from < to);

      this.length -= this._blankCount;
      this._blankCount = 0;
    }
  }

  private _endLoopAndClean(preEnd: number, elements: T[], swapFn: (element: T, index: number) => void): void {
    let index = 0;
    for (let i = preEnd, n = this.length; i < n; i++) {
      const element = elements[i];
      if (!element) continue;
      elements[index] = element;
      swapFn(element, index);
      index++;
    }
    this._isLooping = false;
    this.length = index;
    this._blankCount = 0;
  }
}
