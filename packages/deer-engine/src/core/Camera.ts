import { PerspectiveCamera, Vector3 } from 'three';

let _xColumn = new Vector3();
let _yColumn = new Vector3();
let _zColumn = new Vector3();
let _vec31 = new Vector3();

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

  moveRoaming(dx: number, dy: number, dz: number) {
    const camera = this._main;
    camera.updateMatrix();

    // 相机的x轴在世界坐标下的表示
    _xColumn.setFromMatrixColumn(camera.matrix, 0);
    _yColumn.copy(camera.up);

    _zColumn.crossVectors(camera.up, _xColumn);
    _xColumn.multiplyScalar(dx);
    _yColumn.multiplyScalar(dy);
    _zColumn.multiplyScalar(dz);

    const newPosition = _vec31.copy(camera.position).add(_xColumn).add(_yColumn).add(_zColumn);

    camera.position.copy(newPosition);
    camera.updateMatrixWorld();
  }
}
