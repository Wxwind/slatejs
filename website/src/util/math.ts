import { isNil } from '.';

export function clamp(num: number, min: number | undefined, max: number | undefined) {
  let res = num;
  if (!isNil(max)) {
    res = Math.min(res, max);
  }
  if (!isNil(min)) {
    res = Math.max(res, min);
  }
  return res;
}
