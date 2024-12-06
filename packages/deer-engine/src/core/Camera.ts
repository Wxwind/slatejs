import { PerspectiveCamera } from 'three';

export class Camera {
  private _main: PerspectiveCamera;
  public get main(): PerspectiveCamera {
    return this._main;
  }

  private _sceneCamera: PerspectiveCamera;

  constructor(sceneCamera: PerspectiveCamera) {
    this._sceneCamera = sceneCamera;
    this._main = sceneCamera;
  }

  /** switch to custom camera */
  switchTo(camera: PerspectiveCamera) {
    this._main = camera;
  }

  /** switch to scene camera (main camera) */
  switchToScene() {
    this._main = this._sceneCamera;
  }
}
