import { Script, InputManager, Keys, IVector3 } from 'deer-engine';
import { THREE } from 'deer-engine';

export class RoamingManager extends Script {
  /**
   * key released during _deadZoneTime will be treated as click event
   */
  private _deadZoneTime: number = 0.2;
  private _inputManger!: InputManager;
  private _accumulator = 0;
  // m/s
  private _speed = 5;
  /** move distance on deadZoneTime click. Unit: m */
  private _deadZoneMoveForce: number = 5;

  private _dir = new THREE.Vector3();
  private _distance = new THREE.Vector3();

  set deadZoneTime(value: number) {
    this._deadZoneTime = value;
  }

  set speed(speed: number) {
    this._speed = speed;
    this._deadZoneMoveForce = speed;
  }

  init(): void {
    const inputMgr = this.scene.getManager(InputManager);
    if (!inputMgr) {
      throw new Error('RoamingManager depends on InputManager');
    }
    this._inputManger = inputMgr;
  }
  destroy(): void {}

  update(dt: number): void {
    const { _inputManger: inputManager, _dir: dir, scene } = this;

    const _latestDir = { ...dir };

    dir.set(0, 0, 0);
    const anyDirKeyInputted = this.readDir(inputManager, dir);
    const isShiftHeld = inputManager.isKeyHeldDown(Keys.ShiftLeft) || inputManager.isKeyHeldDown(Keys.ShiftRight);
    const isShiftUp = inputManager.isKeyUp(Keys.ShiftLeft) || inputManager.isKeyUp(Keys.ShiftRight);
    // reset timer if hasn't any invalid key inputted
    if (!isShiftHeld && !anyDirKeyInputted) {
      this._accumulator = 0;
      console.log('重制计时器');
      return;
    }

    this._accumulator += dt;
    if (this._accumulator < this._deadZoneTime) {
      // deadZone only consider about
      //     key held last frame  key held this frame
      //        shift + a            shift / a
      //        shift + d            shift / d
      //        shift + w            shift / w
      //        shift + s            shift / s
      //        shift + q            shift / q
      //        shift + e            shift / e

      // have finish click by release shift or any dir key in _deadZoneTime
      if (isShiftUp || !anyDirKeyInputted) {
        this._accumulator = 0;
        if (_latestDir.x === 0 && _latestDir.y === 0 && _latestDir.z === 0) return;

        const distance = IVector3.scale(_latestDir, this._deadZoneMoveForce, this._distance);
        const camera = this.scene.camera;
        camera.moveRoaming(distance.x, distance.y, distance.z);
      }
      return;
    }

    // treated as pressed event after _deadZoneTime

    // fix: reset timer if shift+wsadqe has been pressed more then _deadZoneTime and then released any of those key.
    if (!isShiftHeld || !anyDirKeyInputted) {
      this._accumulator = 0;
      return;
    }

    const distance = IVector3.scale(dir, dt * this._speed, this._distance);

    const camera = this.scene.camera;
    camera.moveRoaming(distance.x, distance.y, distance.z);
  }

  /**
   * @param inputManager The input manager.
   * @param outDir The output direction.
   * @returns Whether any key is inputted.
   */
  private readDir(inputManager: InputManager, outDir: IVector3): boolean {
    let anyKeyInputted = false;
    if (inputManager.isKeyHeldDown(Keys.KeyA)) {
      outDir.x--;
      anyKeyInputted = true;
    }
    if (inputManager.isKeyHeldDown(Keys.KeyD)) {
      outDir.x++;
      anyKeyInputted = true;
    }
    if (inputManager.isKeyHeldDown(Keys.KeyW)) {
      outDir.z++;
      anyKeyInputted = true;
    }
    if (inputManager.isKeyHeldDown(Keys.KeyS)) {
      outDir.z--;
      anyKeyInputted = true;
    }
    if (inputManager.isKeyHeldDown(Keys.KeyQ)) {
      outDir.y++;
      anyKeyInputted = true;
    }
    if (inputManager.isKeyHeldDown(Keys.KeyE)) {
      outDir.y--;
      anyKeyInputted = true;
    }
    return anyKeyInputted;
  }
}
