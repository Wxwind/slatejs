import { THREE, Script, InputManager, Keys, IVector2 } from 'deer-engine';
import { clamp } from 'lodash-es';

export class FirstPersonCameraControllerScript extends Script {
  /** sensitivity */
  _rotation: number = 1;
  /** 0~1 */
  _rotationDamping: number = 0.5;
  private _tempPosition = new THREE.Vector2();

  private _azimuth = 0;
  private _elevation = 0;
  private _tempVec31 = new THREE.Vector3();
  private _tempVec32 = new THREE.Vector3();

  _freezeCamera: boolean = false;
  private _expectedQuat: THREE.Quaternion = new THREE.Quaternion();
  private _camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();

  private getAngle(angle?: number) {
    if (angle === undefined) {
      return 0;
    } else if (angle > 360 || angle < -360) {
      return angle % 360;
    }
    return angle;
  }

  setFreezeCamera(value: boolean) {
    if (this._freezeCamera === value) return;
    this._freezeCamera = value;
    // if (value) {
    //   document.body.requestPointerLock();
    // } else {
    //   document.exitPointerLock();
    // }
  }

  onAwake(): void {
    this.sceneObject.add(this._camera);
  }

  onEnable(): void {
    this.scene.camera.switchTo(this._camera);
  }

  onDisable(): void {
    this.scene.camera.switchToScene();
  }

  onUpdate(dt: number) {
    const inputMgr = this.scene.getManager(InputManager);
    if (!inputMgr) return;
    if (inputMgr.isKeyDown(Keys.KeyG)) {
      this.setFreezeCamera(!this._freezeCamera);
    }
    if (this._freezeCamera) return;

    const camera = this.scene.camera.main;
    if (inputMgr.pointers.length > 0) {
      const pointer = inputMgr.pointers[0];

      const deltaPosition = IVector2.scale(pointer.deltaPosition, this._rotation, this._tempPosition);

      this._azimuth = this.getAngle(this._azimuth + -deltaPosition.x);
      this._elevation = this.getAngle(this._elevation + -deltaPosition.y);
      this._elevation = clamp(this._elevation, -89.9, 89.9);
      const y = 1 * Math.sin(this._elevation * THREE.MathUtils.DEG2RAD);
      const xz = 1 * Math.cos(this._elevation * THREE.MathUtils.DEG2RAD);
      const x = -xz * Math.sin(this._azimuth * THREE.MathUtils.DEG2RAD);
      const z = -xz * Math.cos(this._azimuth * THREE.MathUtils.DEG2RAD);

      // const worldTarget = this._tempVec31
      //   .set(x, y, z)
      //   .add(camera.getWorldPosition(this._tempVec32));
      // camera.lookAt(worldTarget);

      const mat4 = new THREE.Matrix4().lookAt(this._tempVec31, this._tempVec32.set(x, y, z), camera.up);
      this._expectedQuat.setFromRotationMatrix(mat4);
    }

    camera.quaternion.slerp(this._expectedQuat, this._rotationDamping);
    camera.updateProjectionMatrix();
  }

  onDestroy(): void {
    this.sceneObject.remove(this._camera);
  }
}
