import { FederatedMouseEvent } from './FederatedMouseEvent';

export class FederatedPointerEvent extends FederatedMouseEvent {
  /**
   * The unique identifier of the pointer.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId
   */
  pointerId = 0;

  /**
   * The width of the pointer's contact along the x-axis, measured in CSS pixels.
   * radiusX of TouchEvents will be represented by this value.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width
   */
  width = 0;

  /**
   * The height of the pointer's contact along the y-axis, measured in CSS pixels.
   * radiusY of TouchEvents will be represented by this value.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height
   */
  height = 0;

  /**
   * Indicates whether or not the pointer device that created the event is the primary pointer.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary
   */
  isPrimary = false;

  /**
   * The type of pointer that triggered the event.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType
   */
  pointerType = '';

  /**
   * Pressure applied by the pointing device during the event.
   *s
   * A Touch's force property will be represented by this value.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure
   */
  pressure = 0;

  /**
   * Barrel pressure on a stylus pointer.
   *
   * @see https://w3c.github.io/pointerevents/#pointerevent-interface
   */
  tangentialPressure = 0;

  /**
   * The angle, in degrees, between the pointer device and the screen.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX
   */
  tiltX = 0;

  /**
   * The angle, in degrees, between the pointer device and the screen.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY
   */
  tiltY = 0;

  /**
   * Twist of a stylus pointer.
   *
   * @see https://w3c.github.io/pointerevents/#pointerevent-interface
   */
  twist = 0;
}
