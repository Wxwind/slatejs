import { vec2, vec3, vec4, mat4 } from 'gl-matrix';
import { isNumber } from '../typeGuard';

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

export function deg2rad(deg: number) {
  return deg * DEG2RAD;
}

export function rad2deg(rad: number) {
  return rad * RAD2DEG;
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

/**
 * Assume view space is left hand (+X to right, +Y to top)
 * So z axis of view space is look at from +z to -z of world space (assume right hands).
 * (Otherwise, m22 and m32 will be '(f + n) / (f - n)' and 1)

 * Besides, OpenGL is only knows NDC(and also clipping space, which +X to right, +Y to top, +z into screen). So you doesn't care about if it is used left-handed in view space and user space are worked in right-handed coordinate system.
 * to learn more, see <href>https://stackoverflow.com/questions/4124041/is-opengl-coordinate-system-left-handed-or-right-handed/12336360#12336360</href>

 * NDC space: OpenGL/WebGL (Y up, X right, z is -1 ~ 1, 0 < near < far)

  [
  (2n) / (r - l),      0,             (r + l) / (r - l),          0,
  0,               (2n) / (t - b),    (t + b) / (t - b),          0,
  0,                   0,            -(f + n) / (f - n),   -(2f * n) / (f - n),
  0,                   0,                   -1,                   0
  ]

* NDC space: WebGPU/Metal/DirectX (Y up, X right, z is 0 ~ 1, 0 < near < far)

  [
  (2n) / (r - l),      0,             (r + l) / (r - l),          0,
  0,               (2n) / (t - b),    (t + b) / (t - b),          0,
  0,                   0,                 -f  / (f - n),   -(f * n) / (f - n),
  0,                   0,                   -1,                   0
  ]
*/
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
  const lf = right - left;
  const tb = top - bottom;
  const nf = far - near;

  let c: number;
  let d: number;

  if (zero) {
    c = -far / nf;
    d = (-far * near) / nf;
  } else {
    c = -(far + near) / nf;
    d = (-2 * far * near) / nf;
  }

  out[0] = (2 * near) / lf;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = (2 * near) / tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) / lf;
  out[9] = (top + bottom) / tb;
  out[10] = c;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = d;
  out[15] = 0;
  return out;
}

/**
 * assume z from -1 to 1 (NDC)
  [
  2 / (r - l),         0,             0           -(l + r) / (r - l),
  0,               2 / (t - b),       0,          -(t + b) / (t - b),
  0,                   0,         -2 / (f - n),   -(n + f) / (f - n),
  0,                   0,             0,                  1
  ]
 */
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
