export const isNearlyZero = (v: number) => {
  return Math.abs(v) <= 10e-6;
};

export const lerp = (x: number, y: number, t: number) => {
  return x * (1 - t) + y * t;
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
