export const isNearlyZero = (v: number) => {
  return Math.abs(v) <= 10e-6;
};

export const lerp = (x: number, y: number, t: number) => {
  return x * (1 - t) + y * t;
};
