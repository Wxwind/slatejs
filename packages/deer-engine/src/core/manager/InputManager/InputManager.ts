import { WheelManager } from './WheelManager';
import { PointerManager } from './PointerManager/PointerManager';
import { KeyboardManager } from './KeyboardManager';
import { Pointer } from './PointerManager/Pointer';
import { Keys } from './enums/Keys';
import { _pointerBin2DecMap, PointerButton } from './enums/PointerButton';
import { IVector3 } from '@/type';
import { AbstractSceneManager } from '@/core/interface';
import { DeerScene } from '@/core/DeerScene';

export class InputManager extends AbstractSceneManager {
  private _isInitialized: boolean = false;
  private _enabled: boolean = true;
  private _wheelManager!: WheelManager;
  private _pointerManager!: PointerManager;
  private _keyboardManager!: KeyboardManager;

  get pointers(): Readonly<Pointer[]> {
    return this._enabled ? this._pointerManager._pointers : [];
  }

  /**
   *  Whether to handle multi-pointer.
   */
  get multiPointerEnabled(): boolean {
    return this._enabled ? this._pointerManager._multiPointerEnabled : false;
  }

  set multiPointerEnabled(enabled: boolean) {
    this._enabled && (this._pointerManager._multiPointerEnabled = enabled);
  }

  /**
   * Get the change of the scroll wheel on the x-axis.
   * @returns Change value
   */
  get wheelDelta(): Readonly<IVector3 | null> {
    return this._enabled ? this._wheelManager._delta : null;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
  }

  init(): void {
    const engine = this.scene.engine;
    const canvas = this.scene.canvas._webCanvas;
    this._wheelManager = new WheelManager(engine, canvas);
    this._pointerManager = new PointerManager(this.scene, canvas);
    this._keyboardManager = new KeyboardManager(engine, window);
    this._isInitialized = true;
  }

  /**
   *
   * @param key if null, returns any key is held down in current frame
   * @returns key is held down in current frame
   */
  isKeyHeldDown(key?: Keys): boolean {
    if (!this._enabled || !this._isInitialized) return false;
    if (key === undefined) {
      return this._keyboardManager._curFrameHeldDownList.length > 0;
    }
    return this._keyboardManager._curHeldDownKeyToIndexMap[key] != null;
  }

  /**
   *
   * @param key if null, returns any key is down in current frame
   * @returns key is down in current frame
   */
  isKeyDown(key?: Keys): boolean {
    if (!this._enabled || !this._isInitialized) return false;

    if (key === undefined) {
      return this._keyboardManager._curFrameDownList.length > 0;
    }

    return this._keyboardManager._downKeyToFrameCountMap[key] === this.engine.time.frameCount;
  }

  /**
   *
   * @param key if null, returns any key is up in current frame
   * @returns key is up in current frame
   */
  isKeyUp(key?: Keys): boolean {
    if (!this._enabled || !this._isInitialized) return false;

    if (key === undefined) {
      return this._keyboardManager._curFrameUpList.length > 0;
    }
    return this._keyboardManager._upKeyToFrameCountMap[key] === this.engine.time.frameCount;
  }

  /**
   *
   * @param pointerButton if null, returns any pointer is held down in current frame
   * @returns pointer is held down in current frame
   */
  isPointerHeldDown(pointerButton?: PointerButton): boolean {
    if (!this._enabled || !this._isInitialized) return false;

    if (pointerButton === undefined) {
      return this._pointerManager._buttons != 0;
    }
    return (this._pointerManager._buttons & pointerButton) !== 0;
  }

  /**
   *
   * @param pointerButton if null, returns any pointer is down in current frame
   * @returns pointer is down in current frame
   */
  isPointerDown(pointerButton?: PointerButton): boolean {
    if (!this._enabled || !this._isInitialized) return false;

    if (pointerButton === undefined) {
      return this._pointerManager._downList.length > 0;
    }
    return this._pointerManager._downMap[_pointerBin2DecMap[pointerButton]] === this.engine.time.frameCount;
  }

  /**
   *
   * @param pointerButton if null, returns any pointer is up in current frame
   * @returns pointer is up in current frame
   */
  isPointerUp(pointerButton?: PointerButton): boolean {
    if (!this._enabled || !this._isInitialized) return false;

    if (pointerButton === undefined) {
      return this._pointerManager._upList.length > 0;
    }
    return this._pointerManager._upMap[_pointerBin2DecMap[pointerButton]] === this.engine.time.frameCount;
  }

  update(): void {
    if (this._enabled && this._isInitialized) {
      this._wheelManager._update();
      this._pointerManager._update();
      this._keyboardManager._update();
    }
  }

  _firePointerScript(scene: DeerScene): void {
    if (this._enabled && this._isInitialized) {
      this._pointerManager._firePointerScript(scene);
    }
  }

  destroy(): void {
    if (this._isInitialized) {
      this._wheelManager._destroy();
      this._pointerManager._destroy();
      this._keyboardManager._destroy();
    }
  }
}
