export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

export function isNil(v: unknown): v is null | undefined {
  return v === null || v === undefined;
}

export function isNumber(value: unknown): value is number {
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  return false;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}
