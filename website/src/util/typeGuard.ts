export function isNil(v: unknown): v is null | undefined {
  return v === null || v === undefined;
}
