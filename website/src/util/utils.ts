/* eslint-disable @typescript-eslint/no-explicit-any */
export const deepClone = <T>(v: T) => {
  return JSON.parse(JSON.stringify(v)) as T;
};

/** isObject([]) = true */
function isObject(a: unknown) {
  return a !== null && typeof a === 'object';
}

/**
 * 深拷贝，支持基础类型判断，函数和循环引用，Set，Map，不支持原型链拷贝
 * support function, Set, Map, circular reference
 */
export function deepCloneRecursive<T>(target: T): T {
  const map = new Map();
  const helper = (target: any, map: Map<any, unknown>) => {
    // 基础类型和函数直接浅拷贝
    if (!isObject(target)) return target;

    // 深拷贝Map,Set

    // 判断循环引用
    if (map.has(target)) {
      return map.get(target);
    }

    const type = Object.prototype.toString.call(target);

    switch (type) {
      case '[object Map]': {
        const res = new Map();
        map.set(target, res);
        (target as unknown as Map<unknown, unknown>).forEach((value, key) => {
          res.set(key, helper(value, map));
        });
        return res;
      }
      case '[object Set]': {
        const res2 = new Set();
        map.set(target, res2);
        (target as unknown as Set<unknown>).forEach((value) => {
          res2.add(helper(value, map));
        });
        return res2;
      }
      default:
        break;
    }

    // 深拷贝对象和数组
    const res: any = Array.isArray(target) ? [] : {};
    map.set(target, res);
    for (const key in target) {
      if (Object.hasOwnProperty.call(target, key)) {
        res[key] = helper((target as any)[key], map);
      }
    }
    return res as T;
  };

  return helper(target, map);
}
