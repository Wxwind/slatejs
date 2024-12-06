import { DisorderedArray } from '@/core/DisorderedMap';
import { WebCanvas } from '@/core/WebCanvas';
import { ComponentBase, DeerScene, Entity, THREE } from '@/index';
import { IInput } from '../interface/IInput';
import { _pointerDec2BinMap, PointerButton } from '../enums/PointerButton';
import { PointerPhase } from '../enums/PointerPhase';
import { Pointer } from './Pointer';

export class PointerManager implements IInput {
  private static _tempRay = new THREE.Raycaster();
  private static _tempPoint: THREE.Vector2 = new THREE.Vector2();
  _pointers: Pointer[] = [];

  _multiPointerEnabled: boolean = true;

  _buttons: PointerButton = PointerButton.None;

  /** The frame time when key up */
  _upMap: number[] = [];

  /** The frame time when key down */
  _downMap: number[] = [];

  /** Up key in current frame */
  _upList: DisorderedArray<PointerButton> = new DisorderedArray();

  /** Down key in current frame */
  _downList: DisorderedArray<PointerButton> = new DisorderedArray();

  private _canvas: WebCanvas;
  private _nativeEvents: PointerEvent[] = [];
  private _pointerPool: Pointer[];
  private _htmlCanvas: HTMLCanvasElement;

  constructor(
    private _scene: DeerScene,
    private _target: HTMLElement
  ) {
    this._canvas = _scene.canvas;
    this._htmlCanvas = _scene.canvas._webCanvas;
    this._pointerPool = new Array<Pointer>(11);

    this._onPointerEvent = this._onPointerEvent.bind(this);
    this._addEventListener();
  }

  _update(): void {
    const { _pointers: pointers, _nativeEvents: nativeEvents, _htmlCanvas: htmlCanvas } = this;
    const { width, height } = this._canvas;
    const { clientWidth, clientHeight } = htmlCanvas;
    const { left, top } = htmlCanvas.getBoundingClientRect();
    const widthDPR = width / clientWidth;
    const heightDPR = height / clientHeight;

    // clear the pointer released in the previous frame
    for (let i = pointers.length - 1; i >= 0; i--) {
      if (pointers[i].phase === PointerPhase.Leave) {
        pointers.splice(i, 1);
      }
    }

    // receive pointer events in current frame
    for (let i = 0, n = nativeEvents.length; i < n; i++) {
      const evt = nativeEvents[i];
      const { pointerId } = evt;
      let pointer = this._getPointerByID(pointerId);
      if (pointer) {
        pointer._events.push(evt);
      } else {
        const lastCount = pointers.length;
        if (lastCount === 0 || this._multiPointerEnabled) {
          const { _pointerPool: pointerPool } = this;
          // Get Pointer smallest index
          let i = 0;
          for (; i < lastCount; i++) {
            if (pointers[i].id > i) {
              break;
            }
          }
          pointer = pointerPool[i] ||= new Pointer(i);
          pointer._uniqueID = pointerId;
          pointer._events.push(evt);
          pointer.position = {
            x: (evt.clientX - left) * widthDPR,
            y: (evt.clientY - top) * heightDPR,
          };
          pointers.splice(i, 0, pointer);
        }
      }
    }
    nativeEvents.length = 0;

    // deal with pointer events
    this._upList.length = this._downList.length = 0;
    this._buttons = PointerButton.None;
    const frameCount = this._scene.engine.time.frameCount;
    for (let i = 0, n = pointers.length; i < n; i++) {
      const pointer = pointers[i];
      pointer._upList.length = pointer._downList.length = 0;
      this._updatePointerInfo(frameCount, pointer, left, top, widthDPR, heightDPR);
      this._buttons |= pointer.pressedButtons;
    }
  }

  _firePointerScript(scene: DeerScene) {
    const { _pointers: pointers, _canvas: canvas } = this;
    for (let i = 0, n = pointers.length; i < n; i++) {
      const pointer = pointers[i];
      const { _events: events, position } = pointer;
      pointer._firePointerDrag();
      const rayCastEntity = this._pointerRayCast(scene, position.x / canvas.width, position.y / canvas.height);
      pointer._firePointerExitAndEnter(rayCastEntity);
      const length = events.length;
      if (length > 0) {
        for (let i = 0; i < length; i++) {
          const event = events[i];
          switch (event.type) {
            case 'pointerdown':
              pointer.phase = PointerPhase.Down;
              pointer._firePointerDown(rayCastEntity);
              break;
            case 'pointerup':
              pointer.phase = PointerPhase.Up;
              pointer._firePointerUpAndClick(rayCastEntity);
              break;
            case 'pointerleave':
            case 'pointercancel':
              pointer.phase = PointerPhase.Leave;
              pointer._firePointerExitAndEnter(null);
              break;
          }
        }
        events.length = 0;
      }
    }
  }

  _destroy(): void {
    this._removeEventListener();
    this._pointerPool.length = 0;
    this._nativeEvents.length = 0;
    this._downMap.length = 0;
    this._upMap.length = 0;
  }

  private _onPointerEvent(evt: PointerEvent) {
    this._nativeEvents.push(evt);
  }

  private _getPointerByID(pointerId: number): Pointer | null {
    const { _pointers: pointers } = this;
    for (let i = pointers.length - 1; i >= 0; i--) {
      if (pointers[i]._uniqueID === pointerId) {
        return pointers[i];
      }
    }
    return null;
  }

  private _updatePointerInfo(
    frameCount: number,
    pointer: Pointer,
    left: number,
    top: number,
    widthPixelRatio: number,
    heightPixelRatio: number
  ) {
    const { _events: events, position } = pointer;
    const length = events.length;
    if (length > 0) {
      const { _upList, _upMap, _downList, _downMap } = this;
      const latestEvent = events[length - 1];
      const currX = (latestEvent.clientX - left) * widthPixelRatio;
      const currY = (latestEvent.clientY - top) * heightPixelRatio;
      pointer.deltaPosition = { x: currX - position.x, y: currY - position.y };
      position.x = currX;
      position.y = currY;
      for (let i = 0; i < length; i++) {
        const event = events[i];
        const { button } = event;
        pointer.button = _pointerDec2BinMap[button] || PointerButton.None;
        pointer.pressedButtons = event.buttons;
        switch (event.type) {
          case 'pointerdown':
            _downList.add(button);
            _downMap[button] = frameCount;
            pointer._downList.add(button);
            pointer._downMap[button] = frameCount;
            pointer.phase = PointerPhase.Down;
            break;
          case 'pointerup':
            _upList.add(button);
            _upMap[button] = frameCount;
            pointer._upList.add(button);
            pointer._upMap[button] = frameCount;
            pointer.phase = PointerPhase.Up;
            break;
          case 'pointermove':
            pointer.phase = PointerPhase.Move;
            break;
          case 'pointerleave':
          case 'pointercancel':
            pointer.phase = PointerPhase.Leave;
            break;
          default:
            break;
        }
      }
      events.length = 0;
    } else {
      pointer.deltaPosition = { x: 0, y: 0 };
      pointer.phase = PointerPhase.Stationary;
    }
  }

  private _pointerRayCast(scene: DeerScene, normalizedX: number, normalizedY: number): Entity | null {
    const { _tempPoint: point } = PointerManager;

    if (!scene.active || scene._isDestroyed) {
      return null;
    }

    point.set(normalizedX * 2 - 1, -normalizedY * 2 + 1);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(point, this._scene.camera.main);

    const intersects = ray.intersectObjects(this._scene.sceneObject.children);

    const intersectedEntities: Entity[] = [];

    for (const obj of intersects) {
      const entity = obj.object.userData._target;
      entity && intersectedEntities.push(entity);
    }

    if (intersectedEntities.length > 0) return intersectedEntities[0];
    return null;
  }

  private _addEventListener(): void {
    const { _target: target, _onPointerEvent: onPointerEvent } = this;
    target.addEventListener('pointerdown', onPointerEvent);
    target.addEventListener('pointerup', onPointerEvent);
    target.addEventListener('pointerleave', onPointerEvent);
    target.addEventListener('pointermove', onPointerEvent);
    target.addEventListener('pointercancel', onPointerEvent);
  }

  private _removeEventListener(): void {
    const { _target: target, _onPointerEvent: onPointerEvent } = this;
    target.removeEventListener('pointerdown', onPointerEvent);
    target.removeEventListener('pointerup', onPointerEvent);
    target.removeEventListener('pointerleave', onPointerEvent);
    target.removeEventListener('pointermove', onPointerEvent);
    target.removeEventListener('pointercancel', onPointerEvent);
    this._nativeEvents.length = 0;
    this._pointers.length = 0;
    this._downList.length = 0;
    this._upList.length = 0;
  }
}
