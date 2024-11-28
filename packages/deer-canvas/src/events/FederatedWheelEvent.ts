import { FederatedMouseEvent } from './FederatedMouseEvent';

export class FederatedWheelEvent extends FederatedMouseEvent {
  /**
   * The units of `deltaX`, `deltaY`, and `deltaZ`. This is one of `DOM_DELTA_LINE`,
   * `DOM_DELTA_PAGE`, `DOM_DELTA_PIXEL`.
   */
  deltaMode = 0;

  /** Horizontal scroll amount */
  deltaX = 0;

  /** Vertical scroll amount */
  deltaY = 0;

  /** z-axis scroll amount. */
  deltaZ = 0;

  /** Units specified in pixels. */
  readonly DOM_DELTA_PIXEL = 0;

  /** Units specified in lines. */
  readonly DOM_DELTA_LINE = 1;

  /** Units specified in pages. */
  readonly DOM_DELTA_PAGE = 2;
}
