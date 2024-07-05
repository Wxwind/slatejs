export function deepClone(obj: undefined): undefined;
export function deepClone<T>(obj: T): T;

export function deepClone<T>(obj: T | undefined): T | undefined {
  if (obj === undefined) return undefined;
  return JSON.parse(JSON.stringify(obj)) as T;
}
