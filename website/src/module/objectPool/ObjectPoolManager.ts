import { isNil } from '@/utils';
import { ObjectPool } from './ObjectPool';
import { IObject } from './IObject';

export class ObjectPoolManager {
  private static instance: ObjectPoolManager | null = null;
  public static get Instance(): ObjectPoolManager {
    if (this.instance === null) {
      this.instance = new ObjectPoolManager();
    }
    return this.instance;
  }

  private poolMap = new Map<string, ObjectPool>();

  getPool = <T2 extends IObject>(c: new () => T2) => {
    const key = c.prototype.__class__;
    let pool = this.poolMap.get(key);
    if (isNil(pool)) {
      pool = new ObjectPool<IObject>(c);
      this.poolMap.set(key, pool);
    }
    return pool as unknown as ObjectPool<T2>;
  };

  require = <T2 extends IObject>(c: new () => T2) => {
    const pool = this.getPool(c);
    return pool.require();
  };

  recycle = <T2 extends IObject>(obj: T2) => {
    const pool = this.getPool(obj.classType);
    pool.recycle(obj);
  };
}
