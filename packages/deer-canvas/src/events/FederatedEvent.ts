import { Point } from '../util/math';
import { EventSystem } from '../systems/EventSystem';
import { IFederatedEventTarget } from './FederatedEventTarget';

export class FederatedEvent<N extends UIEvent = UIEvent> {
  readonly NONE = 0;
  readonly CAPTURING_PHASE = 1;
  readonly AT_TARGET = 2;
  readonly BUBBLING_PHASE = 3;

  manager: EventSystem | null;

  eventPhase = 0;

  target: IFederatedEventTarget | null = null;
  currentTarget: IFederatedEventTarget | null = null;

  path: IFederatedEventTarget[] = [];

  /** Event-specific detail */
  detail: object | undefined | number;

  /**
   * the original event.
   */
  nativeEvent: N | null = null;

  originalEvent: FederatedEvent<N> | null = null;

  /** Flags whether propagation was stopped. */
  propagationStopped = false;

  /** Flags whether the default response of the user agent was prevent through this event. */
  defaultPrevented = false;

  /** Flags whether propagation was immediately stopped. */
  propagationImmediatelyStopped = false;

  type = '';

  /**
   * timestamp when the event created
   */
  timeStamp = 0;

  /**
   * The coordinates of the event relative to the DOM document.
   * This is a non-standard property.
   * relative to the DOM document.
   * @see https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/pageX
   */
  page = new Point();
  get pageX(): number {
    return this.page.x;
  }
  get pageY(): number {
    return this.page.y;
  }

  /**
   * relative to Viewport, account for Camera
   */
  canvas: Point = new Point();
  get canvasX(): number {
    return this.canvas.x;
  }
  get canvasY(): number {
    return this.canvas.y;
  }

  /**
   * relative to HTMLCanvasElement, origin is left-top
   */
  viewport: Point = new Point();
  get viewportX(): number {
    return this.viewport.x;
  }
  get viewportY(): number {
    return this.viewport.y;
  }

  constructor(manager: EventSystem | null) {
    this.manager = manager;
  }

  preventDefault(): void {
    if (this.nativeEvent instanceof Event && this.nativeEvent.cancelable) {
      this.nativeEvent.preventDefault();
    }

    this.defaultPrevented = true;
  }

  stopImmediatePropagation(): void {
    this.propagationImmediatelyStopped = true;
  }

  stopPropagation(): void {
    this.propagationStopped = true;
  }

  /** return [target, parent, root] */
  composedPath(): IFederatedEventTarget[] {
    if (this.manager && (!this.path || this.path[0] !== this.target)) {
      this.path = this.target ? this.manager.propagationPath(this.target) : [];
    }

    return this.path;
  }
}
