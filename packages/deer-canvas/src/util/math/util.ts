const PI_OVER_DEG180 = Math.PI / 180;
const DEG180_OVER_PI = 180 / Math.PI;

export function deg2rad(deg: number) {
  return deg * PI_OVER_DEG180;
}

export function rad2deg(rad: number) {
  return rad * DEG180_OVER_PI;
}

export function getRotation(radians: number) {
  return rad2deg(radians);
}

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
