export function isNil(v: unknown): v is null | undefined {
  return v === null || v === undefined;
}

export function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
  return key in object;
}
