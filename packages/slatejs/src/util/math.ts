export const clamp = (v: number, min: number, max: number) => {
  if (min > max) {
    const a = min;
    min = max;
    max = a;
  }
  return Math.min(max, Math.max(min, v));
};
