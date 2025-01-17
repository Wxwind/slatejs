import { vec4 } from 'gl-matrix';

export function clipToNDC(input: vec4) {
  return vec4.fromValues(input[0] / input[3], input[1] / input[3], input[2] / input[3], 1);
}
