import { Entity } from '@/core';
import { DisorderedArray } from '@/core/DisorderedMap';
import { PointerButton } from '../enums/PointerButton';
import { PointerPhase } from '../enums/PointerPhase';
import { IVector2 } from '@/type';

/**
 * Pointer.
 */
export class Pointer {
  /**
   * Unique id.
   * @remarks Start from 0.
   */
  readonly id: number;
  /** The phase of pointer. */
  phase: PointerPhase = PointerPhase.Leave;
  /** The button that triggers the pointer event. */
  button: PointerButton | null = null;
  /** The currently pressed buttons for this pointer. */
  pressedButtons: PointerButton = PointerButton.None;
  /** The position of the pointer in screen space pixel coordinates. */
  position: IVector2 = { x: 0, y: 0 };
  /** The change of the pointer. */
  deltaPosition: IVector2 = { x: 0, y: 0 };
  /** @internal */
  _events: PointerEvent[] = [];
  /** @internal */
  _uniqueID: number = -1;
  /** @internal */
  _upMap: number[] = [];
  /** @internal */
  _downMap: number[] = [];
  /** @internal */
  _upList: DisorderedArray<PointerButton> = new DisorderedArray();
  /** @internal */
  _downList: DisorderedArray<PointerButton> = new DisorderedArray();

  private _currentPressedEntity: Entity | null = null;
  private _currentEnteredEntity: Entity | null = null;

  constructor(id: number) {
    this.id = id;
  }

  _firePointerExitAndEnter(rayCastEntity: Entity | null): void {
    if (this._currentEnteredEntity !== rayCastEntity) {
      if (this._currentEnteredEntity) {
        this._currentEnteredEntity._scripts.forEach(
          (comp) => {
            comp.onPointerDown(this);
          },
          (elem, index) => {
            elem._entityScriptsIndex = index;
          }
        );
      }
      if (rayCastEntity) {
        rayCastEntity._scripts.forEach(
          (element) => {
            element.onPointerEnter(this);
          },
          (element, index) => {
            element._entityScriptsIndex = index;
          }
        );
      }
      this._currentEnteredEntity = rayCastEntity;
    }
  }

  _firePointerDown(rayCastEntity: Entity | null): void {
    if (rayCastEntity) {
      rayCastEntity._scripts.forEach(
        (comp) => {
          comp.onPointerDown(this);
        },
        (elem, index) => {
          elem._entityScriptsIndex = index;
        }
      );
    }
    this._currentPressedEntity = rayCastEntity;
  }

  _firePointerDrag(): void {
    if (this._currentPressedEntity) {
      this._currentPressedEntity._scripts.forEach(
        (comp) => {
          comp.onPointerDrag(this);
        },
        (elem, index) => {
          elem._entityScriptsIndex = index;
        }
      );
    }
  }

  _firePointerUpAndClick(rayCastEntity: Entity | null): void {
    const { _currentPressedEntity: pressedEntity } = this;
    if (pressedEntity) {
      const sameTarget = pressedEntity === rayCastEntity;
      pressedEntity._scripts.forEach(
        (element) => {
          sameTarget && element.onPointerClick(this);
          element.onPointerUp(this);
        },
        (element, index) => {
          element._entityScriptsIndex = index;
        }
      );
      this._currentPressedEntity = null;
    }
  }
}
