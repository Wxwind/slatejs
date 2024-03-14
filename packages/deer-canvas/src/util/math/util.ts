import { vec2, vec3, vec4, mat4 } from 'gl-matrix';
import { isNumber } from '../typeGuard';

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

export function getAngle(angle?: number) {
  if (angle === undefined) {
    return 0;
  } else if (angle > 360 || angle < -360) {
    return angle % 360;
  }
  return angle;
}

export function createVec3(x: number | vec2 | vec3 | vec4, y = 0, z = 0) {
  if (Array.isArray(x) && x.length === 3) {
    return vec3.fromValues(x[0], x[1], x[2]);
  }

  if (isNumber(x)) {
    return vec3.fromValues(x, y, z);
  }

  return vec3.fromValues(x[0] || 0, x[1] || y, x[2] || z);
}

export function makePerspective(
  out: mat4,
  left: number,
  right: number,
  top: number,
  bottom: number,
  near: number,
  far: number,
  zero?: boolean
): mat4 {
  const x = (2 * near) / (right - left);
  const y = (2 * near) / (top - bottom);

  const a = (right + left) / (right - left);
  const b = (top + bottom) / (top - bottom);

  let c: number;
  let d: number;

  if (zero) {
    c = -far / (far - near);
    d = (-far * near) / (far - near);
  } else {
    c = -(far + near) / (far - near);
    d = (-2 * far * near) / (far - near);
  }

  out[0] = x;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = y;
  out[6] = 0;
  out[7] = 0;
  out[8] = a;
  out[9] = b;
  out[10] = c;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = d;
  out[15] = 0;
  return out;
}

export function makeOrthoGraphic(
  out: mat4,
  left: number,
  right: number,
  top: number,
  bottom: number,
  near: number,
  far: number,
  zero?: boolean
): mat4 {
  if (zero) {
    mat4.orthoZO(out, left, right, bottom, top, near, far);
  } else {
    mat4.ortho(out, left, right, bottom, top, near, far);
  }
  return out;
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
