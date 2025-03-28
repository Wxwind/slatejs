import { Ref } from '@/util';

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

  // Loops the value t, so that it is never larger than length and never smaller than 0.
  static repeat(t: number, length: number): number {
    return MathUtils.clamp(t - Math.floor(t / length) * length, 0, length);
  }

  // PingPongs the value t, so that it is never larger than length and never smaller than 0.
  static pingPong(t: number, length: number): number {
    t = MathUtils.repeat(t, length * 2);
    return length - Math.abs(t - length);
  }

  // Calculates the shortest difference between two given angles.
  static deltaAngle(current: number, target: number) {
    let delta = MathUtils.repeat(target - current, 360.0);
    if (delta > 180.0) delta -= 360.0;
    return delta;
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

  // https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Math/Mathf.cs#L309
  static smoothDamp(
    current: number,
    target: number,
    currentVelocityRef: Ref<number>,
    smoothTime: number,
    maxSpeed: number,
    deltaTime: number
  ): number {
    // Based on Game Programming Gems 4 Chapter 1.10
    smoothTime = Math.max(0.0001, smoothTime);
    const omega = 2 / smoothTime;

    const x = omega * deltaTime;
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    let change = current - target;
    const originalTo = target;

    // Clamp maximum speed
    const maxChange = maxSpeed * smoothTime;
    change = MathUtils.clamp(change, -maxChange, maxChange);
    target = current - change;

    const temp = (currentVelocityRef.value + omega * change) * deltaTime;
    currentVelocityRef.value = (currentVelocityRef.value - omega * temp) * exp;
    let output = target + (change + temp) * exp;

    // Prevent overshooting
    if (originalTo - current > 0.0 === output > originalTo) {
      output = originalTo;
      currentVelocityRef.value = (output - originalTo) / deltaTime;
    }

    return output;
  }

  static smoothDampAngle(
    current: number,
    target: number,
    currentVelocityRef: Ref<number>,
    smoothTime: number,
    maxSpeed: number,
    deltaTime: number
  ) {
    target = current + MathUtils.deltaAngle(current, target);
    return MathUtils.smoothDamp(current, target, currentVelocityRef, smoothTime, maxSpeed, deltaTime);
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
