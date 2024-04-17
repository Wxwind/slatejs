import { EventEmitter } from '@/packages/eventEmitter';
import {
  CameraEvent,
  CameraProjectionMode,
  CameraTrackingMode,
  CameraType,
  ClipSpaceNearZ,
  ICamera,
  View,
} from './interface';
import { ICanvas } from '../interface';
import { mat4, vec4, vec3, vec2, quat, mat3 } from 'gl-matrix';
import { clamp, deg2rad, rad2deg, createVec3, getAngle, makeOrthoGraphic, makePerspective } from '../util';
import { Landmark } from './Landmark';
import { EaseType, EasingFunction } from '../easing';

const MIN_DISTANCE = 0.0002;

export class Camera implements ICamera {
  eventEmitter: EventEmitter = new EventEmitter();
  canvas: ICanvas;

  clipSpaceNearZ = ClipSpaceNearZ.NEGATIVE_ONE;

  /** true - webgl, false - Canvas2D */
  protected flipY = false;
  protected type: CameraType = CameraType.EXPLORING;
  /**
   * works only when camera type is Tracking.
   */
  protected trackingMode: CameraTrackingMode = CameraTrackingMode.DEFAULT;
  protected projectionMode: CameraProjectionMode = CameraProjectionMode.ORTHOGRAPHIC;

  /**
   * matrix of camera.
   */
  protected matrix = mat4.create();
  protected near = 0.1;
  protected far = 10000;
  /**
   * vertical field of view angle
   */
  protected fov = 30;
  /**
   * height : width
   */
  protected aspect = 1;
  /**
   * Orthographic
   */
  protected boxLeft = 0;
  protected boxRight = 0;
  protected boxTop = 0;
  protected boxBottom = 0;

  protected zoom = 1;

  // Axes (left hands)
  /**
   * u axis / +x / right
   */
  protected right = vec3.fromValues(1, 0, 0);
  /**
   * v axis / +y / up
   */
  protected up = vec3.fromValues(0, 1, 0);
  /**
   * n axis / +z / inside
   */
  protected forward = vec3.fromValues(0, 0, 1);

  /**
   * position of camera
   */
  protected position = vec3.fromValues(0, 0, 1);
  /**
   * position of focal point
   */
  protected focalPoint = vec3.fromValues(0, 0, 0);
  /**
   * vector from camera's position to focalPoint
   */
  protected distanceVector: vec3 = vec3.fromValues(0, 0, -1);
  /**
   * length(distanceVector)
   */
  protected distance = 1;

  // Angles
  /**
   * - Camera posZ > focalPoint posZ is 0
   * - CameraType.TRACKING - Increasing anti-clockwise in HCS
   * - CameraType.EXPLORING and ORBITING - Increasing clockwise in HCS (when rotate world = false)
   * - CameraType.EXPLORING's rotate world flag is true by defult, so it will increasing anti-clockwise like CameraType.TRACKING
   */
  protected azimuth = 0;
  protected elevation = 0;
  protected roll = 0;

  protected dollyingStep = 0;
  protected maxDistance = Infinity;
  protected minDistance = -Infinity;

  /**
   * invert the horizontal coordinate system (HCS)
   */
  private rotateWorld = false;

  private landmarks: Landmark[] = [];
  private landmarkAnimationID = undefined;

  protected projectionMatrix = mat4.create();
  protected projectionMatrixInverse = mat4.create();
  protected orthographicMatrix = mat4.create();

  /**
   * @see https://threejs.org/docs/#api/en/cameras/OrthographicCamera
   */
  protected view: View = {
    enabled: true,
    fullWidth: 1,
    fullHeight: 1,
    offsetX: 0,
    offsetY: 0,
    width: 1,
    height: 1,
  };

  constructor(canvas: ICanvas) {
    this.canvas = canvas;
  }

  isOrthographic = () => this.projectionMode === CameraProjectionMode.ORTHOGRAPHIC;

  isPerspective = () => this.projectionMode === CameraProjectionMode.PERSPECTIVE;

  get BoxLeft() {
    return this.boxLeft;
  }
  get BoxRight() {
    return this.boxRight;
  }
  get BoxTop() {
    return this.boxTop;
  }
  get BoxBottom() {
    return this.boxBottom;
  }

  get Type() {
    return this.type;
  }

  get FlipY() {
    return this.flipY;
  }

  get ProjectionMode() {
    return this.projectionMode;
  }

  get ProjectionMatrix() {
    return this.projectionMatrix;
  }

  get ProjectionInverse() {
    return this.projectionMatrixInverse;
  }

  get OrthographicMatrix() {
    return this.orthographicMatrix;
  }

  get ViewTransform() {
    return mat4.invert(mat4.create(), this.matrix);
  }

  get WorldTransform() {
    return this.matrix;
  }

  /**
   * not support for modified, used for unit test.
   */
  get Up() {
    return this.up;
  }

  /**
   * not support for modified, used for unit test.
   */
  get Right() {
    return this.right;
  }

  /**
   * not support for modified, used for unit test.
   */
  get Forward() {
    return this.forward;
  }

  get Position() {
    return this.position;
  }

  get FocalPoint() {
    return this.focalPoint;
  }

  get Distance() {
    return this.distance;
  }

  get DistanceVector() {
    return this.distanceVector;
  }

  get DollyingStep() {
    return this.dollyingStep;
  }

  get Near() {
    return this.near;
  }

  get Far() {
    return this.far;
  }

  get Zoom() {
    return this.zoom;
  }

  get Azimuth() {
    return this.azimuth;
  }

  get Elevation() {
    return this.elevation;
  }

  get Roll() {
    return this.roll;
  }

  get View() {
    return this.view;
  }

  setFlipY = (bool: boolean) => {
    this.flipY = bool;
    this.setOrthographic(this.boxLeft, this.boxRight, this.boxTop, this.boxBottom, this.near, this.far);
  };

  setType = (type: CameraType, trackingMode?: CameraTrackingMode) => {
    this.type = type;
    if (this.type === CameraType.EXPLORING) {
      this.setWorldRotation(true);
    } else {
      this.setWorldRotation(false);
    }
    this._getAngles();

    if (this.type === CameraType.TRACKING && trackingMode !== undefined) {
      this.setTrackingMode(trackingMode);
    }

    return this;
  };

  setTrackingMode = (trackingMode: CameraTrackingMode) => {
    if (this.type !== CameraType.TRACKING) {
      throw new Error('Impossible to set a tracking mode if the camera is not of tracking type');
    }

    this.trackingMode = trackingMode;

    return this;
  };

  setProjectionMode = (projectionMode: CameraProjectionMode) => {
    this.projectionMode = projectionMode;

    return this;
  };

  /**
   * If flag is true, it reverses the azimuth and elevation angles.
   * Subsequent calls to rotate, setAzimuth, setElevation,
   * changeAzimuth or changeElevation will cause the inverted effect.
   * setRoll or changeRoll is not affected by this method.
   *
   * This inversion is useful when one wants to simulate that the world
   * is moving, instead of the camera.
   *
   * By default the camera angles are not reversed.
   * @param{Boolean} flag the boolean flag to reverse the angles.
   */
  setWorldRotation: (flag: boolean) => this = (flag) => {
    this.rotateWorld = flag;
    this._getAngles();

    return this;
  };

  /**
   * Set camera's matrix
   */
  setMatrix = (matrix: mat4) => {
    this.matrix = matrix;
    this._update();
    this._getOrthoMatrix();

    return this;
  };

  setFov = (fov: number) => {
    this.setPerspective(this.near, this.far, fov, this.aspect);
    return this;
  };

  setAspect = (aspect: number) => {
    this.setPerspective(this.near, this.far, this.fov, aspect);
    return this;
  };

  setNear = (near: number) => {
    if (this.projectionMode === CameraProjectionMode.PERSPECTIVE) {
      this.setPerspective(near, this.far, this.fov, this.aspect);
    } else {
      this.setOrthographic(this.boxLeft, this.boxRight, this.boxTop, this.boxBottom, near, this.far);
    }
    return this;
  };

  setFar = (far: number) => {
    if (this.projectionMode === CameraProjectionMode.PERSPECTIVE) {
      this.setPerspective(this.near, far, this.fov, this.aspect);
    } else {
      this.setOrthographic(this.boxLeft, this.boxRight, this.boxTop, this.boxBottom, this.near, far);
    }
    return this;
  };

  /**
   * Sets an offset in a larger frustum. This is useful for multi-window or
   * multi-monitor/multi-machine setups.
   *
   * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
   * the monitors are in grid like this
   *
   *   +---+---+---+
   *   | A | B | C |
   *   +---+---+---+
   *   | D | E | F |
   *   +---+---+---+
   *
   * then for each monitor you would call it like this
   *
   *   const w = 1920;
   *   const h = 1080;
   *   const fullWidth = w * 3;
   *   const fullHeight = h * 2;
   *
   *   --A--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
   *   --B--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
   *   --C--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
   *   --D--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
   *   --E--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
   *   --F--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
   *
   *   Note there is no reason monitors have to be the same size or in a grid.
   */
  setViewOffset(fullWidth: number, fullHeight: number, x: number, y: number, width: number, height: number) {
    this.aspect = fullWidth / fullHeight;

    this.view.enabled = true;
    this.view.fullWidth = fullWidth;
    this.view.fullHeight = fullHeight;
    this.view.offsetX = x;
    this.view.offsetY = y;
    this.view.width = width;
    this.view.height = height;

    if (this.projectionMode === CameraProjectionMode.PERSPECTIVE) {
      this.setPerspective(this.near, this.far, this.fov, this.aspect);
    } else {
      this.setOrthographic(this.boxLeft, this.boxRight, this.boxTop, this.boxBottom, this.near, this.far);
    }
    return this;
  }

  clearViewOffset = () => {
    if (this.view) {
      this.view.enabled = false;
    }

    if (this.projectionMode === CameraProjectionMode.PERSPECTIVE) {
      this.setPerspective(this.near, this.far, this.fov, this.aspect);
    } else {
      this.setOrthographic(this.boxLeft, this.boxRight, this.boxTop, this.boxBottom, this.near, this.far);
    }
    return this;
  };

  setZoom = (zoom: number) => {
    this.zoom = zoom;
    if (this.projectionMode === CameraProjectionMode.PERSPECTIVE) {
      this.setPerspective(this.near, this.far, this.fov, this.aspect);
    } else {
      this.setOrthographic(this.boxLeft, this.boxRight, this.boxTop, this.boxBottom, this.near, this.far);
    }
    return this;
  };

  /** not make change of camera's viewbox */
  setZoomByViewportPoint = (zoom: number, viewportPoint: vec2) => {
    const { x, y } = this.canvas.viewport2Canvas({ x: viewportPoint[0], y: viewportPoint[1] });
    const roll = this.roll;
    this.rotate(0, 0, -roll);
    this._setPosition(x, y, this.position[2]);
    this.setFocalPoint(x, y, this.focalPoint[2]);
    this.setZoom(zoom);
    this.rotate(0, 0, roll);

    return this;
  };

  /** change the viewbox to be focus to viewportPoint */
  setZoomByScroll = (zoom: number, viewportPoint: vec2) => {
    const { x, y } = this.canvas.viewport2Canvas({ x: viewportPoint[0], y: viewportPoint[1] });

    const absl = this.position[0] + this.boxLeft;
    const absr = this.position[0] + this.boxRight;
    const abst = this.position[1] + this.boxTop;
    const absb = this.position[1] + this.boxBottom;

    const roll = this.roll;
    this.rotate(0, 0, -roll);
    this._setPosition(x, y, this.position[2]);
    this.setFocalPoint(x, y, this.focalPoint[2]);
    this.setZoom(zoom);
    this.rotate(0, 0, roll);

    const l = absl - this.position[0];
    const r = absr - this.position[0];
    const t = abst - this.position[1];
    const b = absb - this.position[1];

    this.setOrthographic(l, r, t, b, this.near, this.far);

    return this;
  };

  setPerspective = (near: number, far: number, fov: number, aspect: number) => {
    this.projectionMode = CameraProjectionMode.PERSPECTIVE;
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.aspect = aspect;

    let top = (this.near * Math.tan(deg2rad(0.5 * this.fov))) / this.zoom;
    let height = 2 * top;
    let width = this.aspect * height;
    let left = -0.5 * width;

    if (this.view?.enabled) {
      const fullWidth = this.view.fullWidth;
      const fullHeight = this.view.fullHeight;

      left += (this.view.offsetX * width) / fullWidth;
      top -= (this.view.offsetY * height) / fullHeight;
      width *= this.view.width / fullWidth;
      height *= this.view.height / fullHeight;
    }

    makePerspective(
      this.projectionMatrix,
      left,
      left + width,
      top,
      top - height,
      near,
      far,
      this.clipSpaceNearZ === ClipSpaceNearZ.ZERO
    );
    mat4.invert(this.projectionMatrixInverse, this.projectionMatrix);

    this.triggerUpdate();
    return this;
  };

  setOrthographic = (l: number, r: number, t: number, b: number, near: number, far: number) => {
    this.projectionMode = CameraProjectionMode.ORTHOGRAPHIC;
    this.boxRight = r;
    this.boxLeft = l;
    this.boxTop = t;
    this.boxBottom = b;
    this.near = near;
    this.far = far;

    let left = (this.boxLeft - this.position[0]) / this.zoom + this.position[0];
    let right = (this.boxRight - this.position[0]) / this.zoom + this.position[0];
    let top = (this.boxTop - this.position[1]) / this.zoom + this.position[1];
    let bottom = (this.boxRight - this.position[1]) / this.zoom + this.position[1];

    console.log('setOrthographic, left=%s, right=%s, top=%s bottom=%s', left, right, top, bottom);

    // TODO: support view
    if (this.view?.enabled) {
      const scaleW = (this.boxRight - this.boxLeft) / this.view.fullWidth / this.zoom;
      const scaleH = (this.boxTop - this.boxBottom) / this.view.fullHeight / this.zoom;

      left += scaleW * this.view.offsetX;
      right = left + scaleW * this.view.width;
      top -= scaleH * this.view.offsetY;
      bottom = top - scaleH * this.view.height;
    }

    makeOrthoGraphic(
      this.projectionMatrix,
      left,
      right,
      top,
      bottom,
      near,
      far,
      this.clipSpaceNearZ === ClipSpaceNearZ.ZERO
    );
    mat4.invert(this.projectionMatrixInverse, this.projectionMatrix);

    this._getOrthoMatrix();
    this.triggerUpdate();
    return this;
  };

  setPosition = (x: number | vec2 | vec3, y?: number, z?: number) => {
    this._setPosition(x, y, z);
    this.setFocalPoint(this.focalPoint);

    return this;
  };

  /**
   * Looks at a given point in space (sets the focal point of this camera).
   *
   * Note: If the camera is doing cinematic tracking, the up vector will be affected.
   */
  setFocalPoint = (x: number | vec2 | vec3, y?: number, z?: number) => {
    let up = vec3.fromValues(0, 1, 0);
    this.focalPoint = createVec3(x, y, z);

    if (this.trackingMode === CameraTrackingMode.CINEMATIC) {
      const d = vec3.subtract(vec3.create(), this.focalPoint, this.position);
      x = d[0];
      y = d[1];
      z = d[2];
      const r = vec3.length(d);
      const el = rad2deg(Math.asin(y / r));
      const az = 90 + rad2deg(Math.atan2(z, x));
      const m = mat4.create();
      mat4.rotateY(m, m, deg2rad(az));
      mat4.rotateX(m, m, deg2rad(el));
      up = vec3.transformMat4(vec3.create(), [0, 1, 0], m);
    }

    mat4.invert(this.matrix, mat4.lookAt(mat4.create(), this.position, this.focalPoint, up));

    this._getAxes();
    this._getDistance();
    this._getAngles();
    this.triggerUpdate();
    return this;
  };

  setDistance = (d: number) => {
    if (this.distance === d || d < 0) return this;

    this.distance = d;
    if (this.distance < MIN_DISTANCE) this.distance = MIN_DISTANCE;

    this.dollyingStep = this.distance / 100;

    const pos = vec3.create();
    d = this.distance;
    const n = this.forward;
    const f = this.focalPoint;

    pos[0] = d * n[0] + f[0];
    pos[1] = d * n[1] + f[1];
    pos[2] = d * n[2] + f[2];

    this._setPosition(pos);

    this.triggerUpdate();
    return this;
  };

  setMaxDistance = (d: number) => {
    this.maxDistance = d;
    return this;
  };

  setMinDistance = (d: number) => {
    this.minDistance = d;
    return this;
  };

  setAzimuth = (az: number) => {
    this.azimuth = getAngle(az);
    this._computeMatrix();

    this._getAxes();
    if (this.type === CameraType.ORBITING || this.type === CameraType.EXPLORING) {
      this._getPosition();
    } else if (this.type === CameraType.TRACKING) {
      this._getFocalPoint();
    }

    this.triggerUpdate();
    return this;
  };

  setElevation = (el: number) => {
    this.elevation = getAngle(el);
    this._computeMatrix();

    this._getAxes();
    if (this.type === CameraType.ORBITING || this.type === CameraType.EXPLORING) {
      this._getPosition();
    } else if (this.type === CameraType.TRACKING) {
      this._getFocalPoint();
    }

    this.triggerUpdate();
    return this;
  };

  setRoll = (angle: number) => {
    this.roll = getAngle(angle);
    this._computeMatrix();

    this._getAxes();
    if (this.type === CameraType.ORBITING || this.type === CameraType.EXPLORING) {
      this._getPosition();
    } else if (this.type === CameraType.TRACKING) {
      this._getFocalPoint();
    }

    this.triggerUpdate();
    return this;
  };

  /**
   * Changes the azimuth and elevation relatively with respect to the current camera axes
   */
  rotate = (azimuth: number, elevation: number, roll: number) => {
    if (this.type === CameraType.EXPLORING) {
      // FIXME refactor. From nucleo.js, but it's definitely wrong when you rotate roll and azimuth.
      const relAzimuth = getAngle(azimuth);
      const relElevation = getAngle(elevation);
      const relRoll = getAngle(roll);

      this.roll += relRoll;

      const rotX = quat.setAxisAngle(quat.create(), [1, 0, 0], deg2rad(this.rotateWorld ? 1 : -1) * relElevation);
      const rotY = quat.setAxisAngle(quat.create(), [0, 1, 0], deg2rad(this.rotateWorld ? 1 : -1) * relAzimuth);
      const rotZ = quat.setAxisAngle(quat.create(), [0, 0, 1], deg2rad(relRoll));

      let rotQ = quat.multiply(quat.create(), rotY, rotX);
      rotQ = quat.multiply(quat.create(), rotQ, rotZ);
      const rotMatrix = mat4.fromQuat(mat4.create(), rotQ);
      mat4.translate(this.matrix, this.matrix, [0, 0, -this.distance]);
      mat4.multiply(this.matrix, this.matrix, rotMatrix);
      mat4.translate(this.matrix, this.matrix, [0, 0, this.distance]);
    } else if (this.type === CameraType.ORBITING || this.type === CameraType.TRACKING) {
      if (Math.abs(this.elevation + elevation) > 90) return this;
      const relAzimuth = getAngle(azimuth);
      const relElevation = getAngle(elevation);
      const relRoll = getAngle(roll);
      this.elevation += relElevation;
      this.azimuth += relAzimuth;
      this.roll += relRoll;

      this._computeMatrix();
    }

    this._getAxes();
    if (this.type === CameraType.ORBITING || this.type === CameraType.EXPLORING) {
      this._getPosition();
    } else if (this.type === CameraType.TRACKING) {
      this._getFocalPoint();
    }

    this._update();
    return this;
  };

  /**
   * Translate camera
   */
  translate = (x: number | vec2 | vec3 | vec4, y = 0, z = 0) => {
    const coords = createVec3(x, y, z);
    const pos = vec3.clone(this.position);

    vec3.add(pos, pos, coords);
    this._setPosition(pos);

    this.triggerUpdate();
    return this;
  };

  /**
   * Translate camera left to right and up to down.
   */
  pan = (tx: number, ty: number) => {
    const coords = createVec3(tx, ty);
    const pos = vec3.clone(this.position);

    vec3.add(pos, pos, vec3.scale(vec3.create(), this.right, coords[0]));
    vec3.add(pos, pos, vec3.scale(vec3.create(), this.up, coords[1]));
    this._setPosition(pos);

    this.triggerUpdate();
    return this;
  };

  /**
   * Move along the camera n axis.
   */
  dolly = (value: number) => {
    const n = this.forward;
    const pos = vec3.clone(this.position);
    const step = value * this.dollyingStep;
    const clampedStep = clamp(this.distance + step, this.minDistance, this.maxDistance) - this.distance;
    pos[0] += clampedStep * n[0];
    pos[1] += clampedStep * n[1];
    pos[2] += clampedStep * n[2];

    this._setPosition(pos);
    if (this.type === CameraType.ORBITING || this.type === CameraType.EXPLORING) {
      this._getDistance();
    } else if (this.type === CameraType.TRACKING) {
      vec3.add(this.focalPoint, pos, this.distanceVector);
    }

    this.triggerUpdate();
    return this;
  };

  // updateWithActor = (actor: DisplayObject) => {
  //   if (this.following != actor) return; //fail safe

  //   switch (this.trackingMode) {
  //     case CameraTrackingMode.DEFAULT:
  //       break;
  //     case CameraTrackingMode.ROTATIONAL:
  //     case CameraTrackingMode.CINEMATIC:
  //       this.setFocalPoint(actor.position);
  //       break;
  //     case CameraTrackingMode.TRANSLATIONAL:
  //       this.translate(actor.rotation);
  //       this.setFocalPoint(actor.position);
  //       break;
  //   }
  // };

  createLandmark = (
    name: string,
    params: Partial<{
      position: vec3 | vec2;
      focalPoint: vec3 | vec2;
      zoom: number;
      roll: number;
    }> = {}
  ) => {
    const { position = this.position, focalPoint = this.focalPoint, zoom = this.zoom, roll = this.roll } = params;

    const camera = new Camera(this.canvas);
    camera.setType(this.type);
    camera.setPosition(position[0], position[1], position[2] || this.position[2]);
    camera.setFocalPoint(focalPoint[0], focalPoint[1], focalPoint[2] || this.focalPoint[2]);
    camera.setRoll(roll);
    camera.setZoom(zoom);

    const landmark: Landmark = {
      name,
      matrix: mat4.clone(camera.WorldTransform),
      right: vec3.clone(camera.right),
      up: vec3.clone(camera.up),
      forward: vec3.clone(camera.forward),
      position: vec3.clone(camera.position),
      focalPoint: vec3.clone(camera.focalPoint),
      distanceVector: vec3.clone(camera.distanceVector),
      distance: camera.distance,
      dollyingStep: camera.dollyingStep,
      azimuth: camera.azimuth,
      elevation: camera.elevation,
      roll: camera.roll,
      zoom: camera.zoom,
    };

    this.landmarks.push(landmark);
    return landmark;
  };

  gotoLandmark = (
    name: string | Landmark,
    options:
      | number
      | Partial<{
          easing: EaseType;
          easingFunction: EasingFunction;
          duration: number;
          onfinish: () => void;
        }> = {}
  ) => {
    // TODO
  };

  /**
   * Stop camera animation immediately.
   */
  cancelLandmarkAnimation = () => {
    if (this.landmarkAnimationID !== undefined) {
      cancelAnimationFrame(this.landmarkAnimationID);
    }
  };

  /**
   * Recalculate properties from current maxtrix.
   */
  private _update = () => {
    this._getAxes();
    this._getPosition();
    this._getDistance();
    this._getAngles();

    this.triggerUpdate();
  };

  /**
   * Recalculates euler angles based on the current distanceVector
   */
  private _getAngles = () => {
    // recalculates angles
    const x = this.distanceVector[0];
    const y = this.distanceVector[1];
    const z = this.distanceVector[2];
    const r = vec3.length(this.distanceVector);

    //FAST FAIL: If there is no distance we cannot compute angles
    if (r === 0) {
      this.elevation = 0;
      this.azimuth = 0;
    }

    if (this.type === CameraType.TRACKING) {
      this.elevation = rad2deg(Math.asin(y / r));
      this.azimuth = rad2deg(Math.atan2(-x, -z));
    } else {
      if (this.rotateWorld) {
        this.elevation = rad2deg(Math.asin(y / r));
        this.azimuth = rad2deg(Math.atan2(-x, -z));
      } else {
        this.elevation = -rad2deg(Math.asin(y / r));
        this.azimuth = -rad2deg(Math.atan2(-x, -z));
      }
    }
  };

  /**
   * Recalculates axes based on the current matrix
   */
  private _getAxes = () => {
    const m = this.matrix;
    vec3.copy(this.right, createVec3(vec4.transformMat4(vec4.create(), [1, 0, 0, 0], m)));
    vec3.copy(this.up, createVec3(vec4.transformMat4(vec4.create(), [0, 1, 0, 0], m)));
    vec3.copy(this.forward, createVec3(vec4.transformMat4(vec4.create(), [0, 0, 1, 0], m)));
    vec3.normalize(this.right, this.right);
    vec3.normalize(this.up, this.up);
    vec3.normalize(this.forward, this.forward);
  };

  /**
   * Recalculates the position based on the current matrix
   */
  private _getPosition = () => {
    vec3.copy(this.position, createVec3(vec4.transformMat4(vec4.create(), [0, 0, 0, 1], this.matrix)));

    this._getDistance();
  };

  /**
   * Recalculate distanceVector, distance and dollyingStep from focalPoint and position.
   */
  private _getDistance = () => {
    this.distanceVector = vec3.subtract(vec3.create(), this.focalPoint, this.position);
    this.distance = vec3.length(this.distanceVector);
    this.dollyingStep = this.distance / 100;
  };

  /**
   * Recalculate distanceVector, focalPoint from matrix, distance and position.
   * Called only when rotate in TRACKING mode.
   */
  private _getFocalPoint = () => {
    vec3.transformMat3(this.distanceVector, [0, 0, -this.distance], mat3.fromMat4(mat3.create(), this.matrix));
    vec3.add(this.focalPoint, this.position, this.distanceVector);
    this._getDistance();
  };

  /**
   * Recalculate matrix with input position.
   */
  private _setPosition = (x: vec2 | vec3 | vec4 | number, y?: number, z?: number) => {
    this.position = createVec3(x, y, z);
    const m = this.matrix;
    m[12] = this.position[0];
    m[13] = this.position[1];
    m[14] = this.position[2];
    m[15] = 1;

    this._getOrthoMatrix();
  };

  /**
   * Rebuild matrix from roll, elevation, azimuth and position / focalPoint
   */
  private _computeMatrix = () => {
    let rotX = quat.create();
    let rotY = quat.create();
    const rotZ = quat.setAxisAngle(quat.create(), [0, 0, 1], deg2rad(this.roll));

    mat4.identity(this.matrix);
    if (this.type === CameraType.TRACKING) {
      rotX = quat.setAxisAngle(rotX, [1, 0, 0], deg2rad(this.elevation));
      rotY = quat.setAxisAngle(rotY, [0, 1, 0], deg2rad(this.azimuth));
    } else if (this.type === CameraType.EXPLORING || this.type === CameraType.ORBITING) {
      // only consider HCS for EXPLORING and ORBITING cameras
      rotX = quat.setAxisAngle(rotX, [1, 0, 0], (this.rotateWorld ? 1 : -1) * deg2rad(this.elevation));
      rotY = quat.setAxisAngle(rotY, [0, 1, 0], (this.rotateWorld ? 1 : -1) * deg2rad(this.azimuth));
    }

    let rotQ = quat.multiply(quat.create(), rotY, rotX);
    rotQ = quat.multiply(quat.create(), rotQ, rotZ);
    const rotMatrix = mat4.fromQuat(mat4.create(), rotQ);

    if (this.type === CameraType.TRACKING) {
      mat4.translate(this.matrix, this.matrix, this.position);
      mat4.multiply(this.matrix, this.matrix, rotMatrix);
    } else if (this.type === CameraType.EXPLORING || this.type === CameraType.ORBITING) {
      mat4.translate(this.matrix, this.matrix, this.focalPoint);
      mat4.multiply(this.matrix, this.matrix, rotMatrix);
      mat4.translate(this.matrix, this.matrix, [0, 0, this.distance]);
    }
  };

  /** world pos to screen pos */
  private _getOrthoMatrix() {
    if (this.projectionMode !== CameraProjectionMode.ORTHOGRAPHIC) {
      return;
    }

    const { width, height } = this.canvas.getConfig();

    mat4.identity(this.orthographicMatrix);
    if (!this.flipY) mat4.scale(this.orthographicMatrix, this.orthographicMatrix, [width / 2, height / 2, 1 / 2]);
    else {
      mat4.scale(this.orthographicMatrix, this.orthographicMatrix, [width, height, 1]);
      mat4.translate(this.orthographicMatrix, this.orthographicMatrix, [0, 1, 0]);
      mat4.scale(this.orthographicMatrix, this.orthographicMatrix, [1, -1, 1]);
      mat4.scale(this.orthographicMatrix, this.orthographicMatrix, [1 / 2, 1 / 2, 1 / 2]);
    }
    mat4.translate(this.orthographicMatrix, this.orthographicMatrix, [1, 1, 1]);
    mat4.multiply(this.orthographicMatrix, this.orthographicMatrix, this.projectionMatrix);
    const matrixInverse = mat4.invert(mat4.create(), this.matrix);
    mat4.multiply(this.orthographicMatrix, this.orthographicMatrix, matrixInverse);

    //  mat4.invert(this.orthographicMatrix, this.orthographicMatrix);
  }

  private triggerUpdate() {
    this.eventEmitter.emit(CameraEvent.UPDATED);
  }
}
