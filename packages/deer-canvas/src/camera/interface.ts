import { EventEmitter } from '@/packages/eventEmitter';
import { mat4, vec2, vec3 } from 'gl-matrix';
import { EaseType, EasingFunction } from '../easing';
import { ICanvas } from '../interface';
import { Landmark } from './Landmark';

export enum CameraProjectionMode {
  ORTHOGRAPHIC = 'ORTHOGRAPHIC',
  PERSPECTIVE = 'PERSPECTIVE',
}

export enum CameraType {
  /**
   * - Is described by world coordinates
   * - Camera at center in HCS.
   * - Change focal point with every rotation
   * - Not effected by rotate world
   * - Elevation > 90 is not allowed
   * - Elevation = 90 towards above
   */
  TRACKING,
  /**
   * - Is described by focus point, distance, own azimuth and elevation
   * - FocalPoint at center in HCS.
   * - Change position with every rotation
   * - Elevation > 90 is not allowed
   * - Elevation = 90 is over the focalPoint
   */
  ORBITING,
  /**
   * - Is described by focus point, distance, own azimuth and elevation
   * - FocalPoint at center in HCS.
   * - Change position with every rotation
   * - Rotate world by default
   * - Elevation > 90 is allowed, allows the camera to rotate upside-down
   * - Elevation = 90 is under the focalPoint
   */
  EXPLORING,
}

export enum CameraTrackingMode {
  /**
   * Not be changed.
   */
  DEFAULT,
  /**
   * Change the focusPoint.
   */
  ROTATIONAL,
  /**
   * Change the focusPoint and rotation
   */
  TRANSLATIONAL,
  /**
   * Change the focusPoint. And change up axes when setFocalPoint()
   */
  CINEMATIC,
}

export enum CameraEvent {
  UPDATED = 'updated',
}

export type View = {
  enabled: boolean;
  fullWidth: number;
  fullHeight: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

export enum ClipSpaceNearZ {
  ZERO,
  NEGATIVE_ONE,
}

export interface ICamera {
  canvas: ICanvas;
  eventEmitter: EventEmitter;

  get Type(): CameraType;

  get ProjectionMode(): CameraProjectionMode;
  get ProjectionMatrix(): mat4;
  get ProjectionInverse(): mat4;
  /**
   * The matrix applied from camera pos to camera frustum center (Ignore Z axis).
   * 'camera frustum center' is [(l + r) /2, (t - b) / 2],means frustum always
   * be [0,1] in both x nad y axis.
   * This matrix tells how to set transform of dom canvas to apply camera.
   */
  get OrthographicMatrix(): mat4;
  /**
   * Inverse(Camera's matrix). From world to view
   */
  get ViewTransform(): mat4;
  /**
   * Camera's matrix. From view to world
   */
  get WorldTransform(): mat4;
  get Up(): vec3;
  get Right(): vec3;
  get Forward(): vec3;
  get Position(): vec3;
  get FocalPoint(): vec3;
  get Distance(): number;
  get DistanceVector(): vec3;
  get DollyingStep(): number;
  get Near(): number;
  get Far(): number;
  get Zoom(): number;
  get Azimuth(): number;
  get Elevation(): number;
  get Roll(): number;

  get View(): View;

  setFlipY: (bool: boolean) => void;
  get FlipY(): boolean;

  isOrthographic: () => boolean;
  isPerspective: () => boolean;

  setType: (type: CameraType) => this;
  setTrackingMode: (trackingMmode: CameraTrackingMode) => this;
  setProjectionMode: (projectionMode: CameraProjectionMode) => this;

  setWorldRotation: (flag: boolean) => this;
  /**
   * Set camera's matrix
   */
  setMatrix: (matrix: mat4) => this;
  setFov: (fov: number) => this;
  setAspect: (aspect: number) => this;
  setNear: (near: number) => this;
  setFar: (far: number) => this;
  setViewOffset: (fullWidth: number, fullHeight: number, x: number, y: number, width: number, height: number) => this;
  clearViewOffset: () => this;
  setZoom: (zoom: number) => this;
  setZoomByViewportPoint: (zoom: number, viewportPoint: vec2) => this;
  setZoomByScroll: (zoom: number, viewportPoint: vec2) => this;
  setPerspective: (near: number, far: number, fov: number, aspect: number) => this;
  setOrthographic: (l: number, r: number, t: number, b: number, near: number, far: number) => this;
  setPosition: (x: number | vec2 | vec3, y?: number, z?: number) => this;
  setFocalPoint: (x: number | vec2 | vec3, y?: number, z?: number) => this;
  setDistance: (d: number) => this;
  setMaxDistance: (d: number) => this;
  setMinDistance: (d: number) => this;
  setAzimuth: (az: number) => this;
  setElevation: (el: number) => this;
  setRoll: (angle: number) => this;

  rotate: (azimuth: number, elevation: number, roll: number) => this;
  pan: (tx: number, ty: number) => this;
  dolly: (value: number) => this;

  createLandmark: (
    name: string,
    params?: Partial<{
      position: vec3 | vec2;
      focalPoint: vec3 | vec2;
      zoom: number;
      roll: number;
    }>
  ) => Landmark;
  gotoLandmark: (
    name: string | Landmark,
    options?:
      | number
      | Partial<{
          easing: EaseType;
          easingFunction: EasingFunction;
          duration: number;
          onfinish: () => void;
        }>
  ) => void;
  /**
   * Stop camera animation immediately.
   */
  cancelLandmarkAnimation: () => void;
}
