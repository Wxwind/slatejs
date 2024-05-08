import { mat4, vec2, vec3 } from 'gl-matrix';

export interface Landmark {
  name: string;
  matrix: mat4;
  right: vec3;
  up: vec3;
  forward: vec3;
  position: vec3;
  focalPoint: vec3;
  distanceVector: vec3;

  distance: number;
  azimuth: number;
  elevation: number;
  roll: number;
  dollyingStep: number;
  zoom: vec2;
}
