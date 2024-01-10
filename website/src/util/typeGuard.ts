export function isNil(v: unknown): v is null | undefined {
  return v === null || v === undefined;
}

export function isNumber(value: any): value is number {
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  return false;
}
