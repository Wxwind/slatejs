export class SimpleObjectPool<T extends new () => any> {
  private _pool: InstanceType<T>[] = [];

  private _classType: T;

  constructor(classType: T) {
    this._classType = classType;
  }

  require(): InstanceType<T> {
    if (this._pool.length) {
      return this._pool.pop()!;
    }
    return new this._classType();
  }

  recycle(obj: InstanceType<T>) {
    this._pool.push(obj);
  }
}
