import { isNil } from '.';

export function clamp(num: number, min: number, max?: number) {
  if (isNil(max)) {
    return Math.max(num, min);
  }
  return Math.min(Math.max(num, min), max);
}
