export const isNearlyZero = (v: number) => {
  return Math.abs(v) <= 10e-6;
};

export function clamp(num: number, min: number, max: number) {
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

export const lerp = (x: number, y: number, t: number) => {
  return x * (1 - t) + y * t;
};

export const smoothStep = (t1: number, t2: number, x: number) => {
  x = clamp((x - t1) / (t2 - t1), 0, 1);
  return x * x * (3 - 2 * x);
};

export const isNearly = (value: number, other: number, tolerance: number = 10e-4) => {
  return Math.abs(value - other) <= tolerance;
};

export const lower_bound = (arr: number[], target: number) => {
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
};

export const upper_bound = (arr: number[], target: number) => {
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
};
