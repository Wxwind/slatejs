export const clamp = (v: number, min: number, max: number) => {
  if (min > max) {
    const a = min;
    min = max;
    max = a;
  }
  return Math.min(max, Math.max(min, v));
};

export const isNearly = (value: number, other: number, tolerance: number = 10e-4) => {
  return Math.abs(value - other) <= tolerance;
};
