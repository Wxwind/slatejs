/* eslint-disable @typescript-eslint/no-explicit-any */
export const CACHE_KEY = '__egclassCache__';

export function getClassStath(ctor: any) {
  return getSubProp(ctor, CACHE_KEY);
}

// avoid read 'undefined' of property
export function getSubProp<T, K extends keyof T>(object: T, propertyPath: K): NonNullable<T[K]> {
  return (object[propertyPath] as NonNullable<T[K]>) || (object[propertyPath] = {} as NonNullable<T[K]>);
}
