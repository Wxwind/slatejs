import { IObject } from './IObject';

export class ObjectPool<T extends IObject = IObject> {
  pool: T[] = [];
  objType: new () => T;
  capacity: number = 100;

  public get size() {
    return this.pool.length;
  }

  constructor(c: new () => T) {
    this.objType = c;
  }

  require = () => {
    let obj;
    if (this.size === 0) {
      obj = new this.objType();
    } else {
      obj = this.pool.pop() as T;
    }
    obj.spawn();
    return obj;
  };

  recycle = (obj: T) => {
    obj.unSpawn();
    this.pool.push(obj);
  };
}
