/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray, isNil, isObject } from './typeGuard';

export function merge<TObject, TSource>(object: TObject, source: TSource): TObject & TSource;
export function merge<TObject, TSource1, TSource2>(
  object: TObject,
  source1: TSource1,
  source2: TSource2
): TObject & TSource1 & TSource2;
export function merge<TObject, TSource1, TSource2, TSource3>(
  object: TObject,
  source1: TSource1,
  source2: TSource2,
  source3: TSource3
): TObject & TSource1 & TSource2 & TSource3;
export function merge<TObject, TSource1, TSource2, TSource3, TSource4>(
  object: TObject,
  source1: TSource1,
  source2: TSource2,
  source3: TSource3,
  source4: TSource4
): TObject & TSource1 & TSource2 & TSource3 & TSource4;
export function merge(target: any, ...args: any[]): any {
  return args.reduce((acc, cur) => {
    if (isNil(cur)) return acc;
    return Object.keys(cur).reduce((subAcc, key) => {
      const srcVal = cur[key];
      if (isObject(srcVal)) {
        const tarAccVal = subAcc[key];
        const isObj = tarAccVal && isObject(tarAccVal);
        // merge only if both target and src is object
        subAcc[key] = merge(isObj ? tarAccVal : {}, srcVal);
      } else if (isArray(srcVal)) {
        subAcc[key] = srcVal.map((item, idx) => {
          // merge object into ?
          if (isObject(item)) {
            const tarAccVal = subAcc[key];
            // into array
            const isArr = isArray(tarAccVal) && tarAccVal[idx] !== undefined;
            // into {} if tarAccVal[idx] is not object
            return merge(isArr && isObject(tarAccVal[idx]) ? tarAccVal[idx] : {}, item);
          } else {
            return item;
          }
        });
      } else {
        srcVal !== undefined && (subAcc[key] = srcVal);
      }
      return subAcc;
    }, acc);
  }, target);
}
