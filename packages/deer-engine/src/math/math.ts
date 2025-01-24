const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
const EPSILON = 10e-5;

export class MathUtils {
  static clamp(num: number, min: number, max: number) {
    if (min > max) {
      const a = min;
      min = max;
      max = a;
    }
    let res = num;
    res = Math.min(res, max);
    res = Math.max(res, min);

    return res;
  }

  static lower_bound(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
      const middle = (right + left) >> 1;
      if (arr[middle] >= target) {
        right = middle - 1;
      } else {
        left = middle + 1;
      }
    }

    return left;
  }

  static upper_bound(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
      const middle = (right + left) >> 1;
      if (arr[middle] > target) {
        right = middle - 1;
      } else {
        left = middle + 1;
      }
    }

    return left;
  }

  static isNearlyZero(v: number) {
    return Math.abs(v) <= EPSILON;
  }

  static lerp(x: number, y: number, t: number) {
    return x * (1 - t) + y * t;
  }

  /**
   *
   * @param t1 min
   * @param t2 max
   * @param x value between t1 ~ t2
   * @returns smooth 0～1
   */
  static smoothStep(t1: number, t2: number, x: number) {
    if (t1 === t2) return t1;
    x = MathUtils.clamp((x - t1) / (t2 - t1), 0, 1);
    return x * x * (3 - 2 * x);
  }

  static isNearly(value: number, other: number, tolerance: number = EPSILON) {
    return Math.abs(value - other) <= tolerance;
  }

  static deg2rad(deg: number): number {
    return deg * DEG2RAD;
  }

  static rad2deg(rad: number): number {
    return rad * RAD2DEG;
  }
}
