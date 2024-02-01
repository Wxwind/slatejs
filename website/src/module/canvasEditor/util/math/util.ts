const PI_OVER_DEG180 = Math.PI / 180;
const DEG180_OVER_PI = 180 / Math.PI;

export function degToRad(deg: number) {
  return deg * PI_OVER_DEG180;
}

export function radToDeg(rad: number) {
  return rad * DEG180_OVER_PI;
}

export function getRotation(radians: number) {
  return radToDeg(radians);
}
