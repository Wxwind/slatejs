export function isNil(v: unknown): v is null | undefined {
  return v === null || v === undefined;
}

export function isNumberChar(v: string | null) {
  if (isNil(v)) {
    return false;
  }
  return /^[0-9]$/.test(v);
}

export function isLetterChar(v: string | null) {
  if (isNil(v)) {
    return false;
  }
  return /^[a-zA-Z]$/.test(v);
}
