import { DisplayObject } from '../core/DisplayObject';
import { Point } from '../util/math';

import { FederatedEvent } from './FederatedEvent';

export class FederatedMouseEvent extends FederatedEvent<MouseEvent | PointerEvent | TouchEvent> {
  /** Whether the "alt" key was pressed when this mouse event occurred. */
  altKey = false;

  /** The specific button that was pressed in this mouse event. */
  button = 0;

  /** The button depressed when this event occurred. */
  buttons = 0;

  /** Whether the "control" key was pressed when this mouse event occurred. */
  ctrlKey = false;

  /** Whether the "meta" key was pressed when this mouse event occurred. */
  metaKey = false;

  /** This is currently not implemented in the Federated Events API. */
  relatedTarget: DisplayObject | null = null;

  /** Whether the "shift" key was pressed when this mouse event occurred. */
  shiftKey = false;

  /**
   * The coordinates of the mouse event relative to the canvas.
   */
  client: Point = new Point();
  get clientX(): number {
    return this.client.x;
  }
  get clientY(): number {
    return this.client.y;
  }

  /**
   * The movement in this pointer relative to the last `mousemove` event.
   */
  movement: Point = new Point();
  get movementX(): number {
    return this.movement.x;
  }
  get movementY(): number {
    return this.movement.y;
  }

  /**
   * The pointer coordinates in world space.
   */
  global: Point = new Point();
  get globalX(): number {
    return this.global.x;
  }
  get globalY(): number {
    return this.global.y;
  }

  /**
   * The pointer coordinates in screen space, from native event.
   */
  screen: Point = new Point();
  get screenX(): number {
    return this.screen.x;
  }
  get screenY(): number {
    return this.screen.y;
  }

  getModifierState(key: string): boolean {
    if (!this.nativeEvent) return false;
    return 'getModifierState' in this.nativeEvent && this.nativeEvent.getModifierState(key);
  }
}
