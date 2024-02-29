import {
  Cursor,
  FederatedMouseEvent,
  FederatedPointerEvent,
  FormattedPointerEvent,
  FormattedTouch,
  InteractivePointerEvent,
} from '.';
import { CanvasConfig, IPlugin, RenderingPluginContext } from '../interface';
import { ICanvas } from '../interface';
import { isUndefined } from '../util';
import { EventBoundary } from './EventBoundary';
import { FederatedWheelEvent } from './FederatedWheelEvent';

const MOUSE_POINTER_ID = 1;
const TOUCH_TO_POINTER: Record<string, string> = {
  touchstart: 'pointerdown',
  touchend: 'pointerup',
  touchendoutside: 'pointerupoutside',
  touchmove: 'pointermove',
  touchcancel: 'pointercancel',
};

export class EventPlugin implements IPlugin {
  name = 'event system';

  private rootBoundary!: EventBoundary;

  private canvas!: ICanvas;

  private rootPointerEvent = new FederatedPointerEvent(null);
  private rootWheelEvent = new FederatedWheelEvent(null);

  private config!: Required<CanvasConfig>;

  init(context: RenderingPluginContext): void {
    const { canvas, config } = context;
    this.canvas = canvas;
    this.config = config;

    this.rootBoundary = new EventBoundary(canvas.root);
    this.addEvents(canvas.canvasEl);
  }

  destroy(): void {
    this.removeEvents(this.canvas);
  }

  addEvents(el: HTMLCanvasElement) {
    if (this.config.supportsPointerEvents) {
      this.addPointerEventListener(el);
    } else {
      this.addTouchEventListener(el);
    }

    if (this.config.supportsTouchEvents) {
      this.addTouchEventListener(el);
    }

    el.addEventListener('wheel', this.onPointerWheel, { passive: true, capture: true });
  }

  removeEvents(canvas: ICanvas | undefined) {
    if (!canvas) return;
    const el = canvas.canvasEl;
    if (this.config.supportsPointerEvents) {
      this.removePointerEventListener(el);
    } else {
      this.removeTouchEventListener(el);
    }

    if (this.config.supportsTouchEvents) {
      this.removeTouchEventListener(el);
    }

    el.removeEventListener('wheel', this.onPointerWheel, true);
  }

  addPointerEventListener(el: HTMLElement) {
    window.addEventListener('pointermove', this.onPointerMove, true);
    el.addEventListener('pointerdown', this.onPointerDown, true);
    el.addEventListener('pointerleave', this.onPointerOverOut, true);
    el.addEventListener('pointerover', this.onPointerOverOut, true);
    window.addEventListener('pointerup', this.onPointerUp, true);
    window.addEventListener('pointercancel', this.onPointerCancel, true);
  }

  removePointerEventListener(el: HTMLElement) {
    window.removeEventListener('pointermove', this.onPointerMove, true);
    el.removeEventListener('pointerdown', this.onPointerDown, true);
    el.removeEventListener('pointerleave', this.onPointerOverOut, true);
    el.removeEventListener('pointerover', this.onPointerOverOut, true);
    window.removeEventListener('pointerup', this.onPointerUp, true);
    window.removeEventListener('pointercancel', this.onPointerCancel, true);
  }

  addTouchEventListener(el: HTMLElement) {
    el.addEventListener('touchstart', this.onPointerDown, true);
    el.addEventListener('touchend', this.onPointerUp, true);
    el.addEventListener('touchmove', this.onPointerMove, true);
    el.addEventListener('touchcancel', this.onPointerCancel, true);
  }

  removeTouchEventListener(el: HTMLElement) {
    el.removeEventListener('touchstart', this.onPointerDown, true);
    el.removeEventListener('touchend', this.onPointerUp, true);
    el.removeEventListener('touchmove', this.onPointerMove, true);
    el.removeEventListener('touchcancel', this.onPointerCancel, true);
  }

  addMouseEventListener = (el: HTMLElement) => {
    window.addEventListener('mousemove', this.onPointerMove, true);
    el.addEventListener('mousedown', this.onPointerDown, true);
    el.addEventListener('mouseout', this.onPointerOverOut, true);
    el.addEventListener('mouseover', this.onPointerOverOut, true);
    window.addEventListener('mouseup', this.onPointerUp, true);
  };

  removeMouseEventListener = (el: HTMLElement) => {
    window.removeEventListener('mousemove', this.onPointerMove, true);
    el.removeEventListener('mousedown', this.onPointerDown, true);
    el.removeEventListener('mouseout', this.onPointerOverOut, true);
    el.removeEventListener('mouseover', this.onPointerOverOut, true);
    window.removeEventListener('mouseup', this.onPointerUp, true);
  };

  private onPointerMove = (nativeEvent: InteractivePointerEvent) => {
    const canvas = this.canvas;
    if (!canvas) return;
    if (this.config.supportsTouchEvents && nativeEvent.type === 'touch') {
      return;
    }

    const normalizedEvents = this.normalizeToPointerEvent(nativeEvent, canvas);

    for (const normalizedEvent of normalizedEvents) {
      const event = this.bootstrapEvent(this.rootPointerEvent, normalizedEvent, canvas, nativeEvent);

      this.rootBoundary.mapEvent(event);
    }

    this.setCursor(this.rootBoundary.cursor);
  };

  private onPointerDown = (nativeEvent: InteractivePointerEvent) => {
    const canvas = this.canvas;
    if (!canvas) return;
    if (this.config.supportsTouchEvents && (nativeEvent as PointerEvent).pointerType === 'touch') return;

    const events = this.normalizeToPointerEvent(nativeEvent, canvas);

    if ((events[0] as any).isNormalized) {
      const cancelable = nativeEvent.cancelable || !('cancelable' in nativeEvent);

      if (cancelable) {
        nativeEvent.preventDefault();
      }
    }

    for (const event of events) {
      const federatedEvent = this.bootstrapEvent(this.rootPointerEvent, event, canvas, nativeEvent);
      this.rootBoundary.mapEvent(federatedEvent);
    }

    this.setCursor(this.rootBoundary.cursor);
  };

  // same as onPointerMove
  private onPointerOverOut = (nativeEvent: InteractivePointerEvent) => {
    const canvas = this.canvas;
    if (!canvas) return;
    if (this.config.supportsTouchEvents && nativeEvent.type === 'touch') {
      return;
    }

    const normalizedEvents = this.normalizeToPointerEvent(nativeEvent, canvas);

    for (const normalizedEvent of normalizedEvents) {
      const event = this.bootstrapEvent(this.rootPointerEvent, normalizedEvent, canvas, nativeEvent);

      this.rootBoundary.mapEvent(event);
    }

    this.setCursor(this.rootBoundary.cursor);
  };

  private onPointerUp = (nativeEvent: InteractivePointerEvent) => {
    const canvas = this.canvas;
    if (!canvas) return;
    if (this.config.supportsTouchEvents && (nativeEvent as PointerEvent).pointerType === 'touch') return;

    const canvasEl = this.canvas?.canvasEl;

    let outside = 'outside';
    try {
      outside =
        canvasEl &&
        nativeEvent.target &&
        nativeEvent.target !== canvasEl &&
        canvasEl.contains &&
        !canvasEl.contains(nativeEvent.target as Node)
          ? 'outside'
          : '';
    } catch (e) {
      // nativeEvent.target maybe not Node, such as Window
    }
    const normalizedEvents = this.normalizeToPointerEvent(nativeEvent, canvas);

    for (const normalizedEvent of normalizedEvents) {
      const event = this.bootstrapEvent(this.rootPointerEvent, normalizedEvent, canvas, nativeEvent);
      event.type += outside;
      this.rootBoundary.mapEvent(event);
    }

    this.setCursor(this.rootBoundary.cursor);
  };

  private onPointerWheel = (nativeEvent: InteractivePointerEvent) => {
    const wheelEvent = this.normalizeWheelEvent(nativeEvent as WheelEvent);
    this.rootBoundary.mapEvent(wheelEvent);
  };

  private onPointerCancel = (nativeEvent: InteractivePointerEvent) => {
    const canvas = this.canvas;
    if (!canvas) return;
    const normalizedEvents = this.normalizeToPointerEvent(nativeEvent, canvas);

    for (const normalizedEvent of normalizedEvents) {
      const event = this.bootstrapEvent(this.rootPointerEvent, normalizedEvent, canvas, nativeEvent);
      this.rootBoundary.mapEvent(event);
    }
    this.setCursor(this.rootBoundary.cursor);
  };

  /**
   * Transfers base & mouse event data from the nativeEvent to the federated event.
   */
  private transferMouseData(event: FederatedMouseEvent, nativeEvent: MouseEvent): void {
    event.timeStamp = performance.now();
    event.type = nativeEvent.type;

    event.altKey = nativeEvent.altKey;
    event.metaKey = nativeEvent.metaKey;
    event.shiftKey = nativeEvent.shiftKey;
    event.ctrlKey = nativeEvent.ctrlKey;
    event.button = nativeEvent.button;
    event.buttons = nativeEvent.buttons;
    event.client.x = nativeEvent.clientX;
    event.client.y = nativeEvent.clientY;
    event.movement.x = nativeEvent.movementX;
    event.movement.y = nativeEvent.movementY;
    event.page.x = nativeEvent.pageX;
    event.page.y = nativeEvent.pageY;
    event.screen.x = nativeEvent.screenX;
    event.screen.y = nativeEvent.screenY;
    event.relatedTarget = null;
  }

  private setCursor(cursor: Cursor | null | undefined) {
    this.canvas && (this.canvas.canvasEl.style.cursor = cursor || 'default');
  }

  private bootstrapEvent(
    event: FederatedPointerEvent,
    normalizedEvent: PointerEvent,
    view: ICanvas,
    nativeEvent: PointerEvent | MouseEvent | TouchEvent
  ): FederatedPointerEvent {
    event.originalEvent = null;
    event.nativeEvent = nativeEvent;

    event.pointerId = normalizedEvent.pointerId;
    event.width = normalizedEvent.width;
    event.height = normalizedEvent.height;
    event.isPrimary = normalizedEvent.isPrimary;
    event.pointerType = normalizedEvent.pointerType;
    event.pressure = normalizedEvent.pressure;
    event.tangentialPressure = normalizedEvent.tangentialPressure;
    event.tiltX = normalizedEvent.tiltX;
    event.tiltY = normalizedEvent.tiltY;
    event.twist = normalizedEvent.twist;
    this.transferMouseData(event, normalizedEvent);

    // map position to point in canvas
    const { x, y } = this.getViewportXY(normalizedEvent);
    event.viewport.x = x;
    event.viewport.y = y;
    const { x: canvasX, y: canvasY } = this.canvas.viewport2Canvas(event.viewport);
    event.canvas.x = canvasX;
    event.canvas.y = canvasY;
    event.global.copyFrom(event.canvas);

    if (event.type === 'pointerleave') {
      event.type = 'pointerout';
    }
    if (event.type.startsWith('mouse')) {
      event.type = event.type.replace('mouse', 'pointer');
    }
    if (event.type.startsWith('touch')) {
      event.type = TOUCH_TO_POINTER[event.type] || event.type;
    }
    return event;
  }

  private normalizeToPointerEvent(event: InteractivePointerEvent, canvas: ICanvas): PointerEvent[] {
    const normalizedEvents = [];
    if (this.config.supportsTouchEvents && event instanceof TouchEvent) {
      for (let i = 0; i < event.changedTouches.length; i++) {
        const touch = event.changedTouches[i] as FormattedTouch;

        // use changedTouches instead of touches since touchend has no touches
        // @see https://stackoverflow.com/a/10079076
        if (isUndefined(touch.button)) touch.button = 0;
        if (isUndefined(touch.buttons)) touch.buttons = 1;
        if (isUndefined(touch.isPrimary)) {
          touch.isPrimary = event.touches.length === 1 && event.type === 'touchstart';
        }
        if (isUndefined(touch.width)) touch.width = touch.radiusX || 1;
        if (isUndefined(touch.height)) touch.height = touch.radiusY || 1;
        if (isUndefined(touch.tiltX)) touch.tiltX = 0;
        if (isUndefined(touch.tiltY)) touch.tiltY = 0;
        if (isUndefined(touch.pointerType)) touch.pointerType = 'touch';
        if (isUndefined(touch.pointerId)) touch.pointerId = touch.identifier || 0;
        if (isUndefined(touch.pressure)) touch.pressure = touch.force || 0.5;
        if (isUndefined(touch.twist)) touch.twist = 0;
        if (isUndefined(touch.tangentialPressure)) touch.tangentialPressure = 0;
        touch.isNormalized = true;
        touch.type = event.type;

        normalizedEvents.push(touch);
      }
    } else if (
      !globalThis.MouseEvent ||
      (event instanceof globalThis.MouseEvent &&
        (!this.config.supportsPointerEvents || !(event instanceof globalThis.PointerEvent)))
    ) {
      const tempEvent = event as FormattedPointerEvent;
      if (isUndefined(tempEvent.isPrimary)) tempEvent.isPrimary = true;
      if (isUndefined(tempEvent.width)) tempEvent.width = 1;
      if (isUndefined(tempEvent.height)) tempEvent.height = 1;
      if (isUndefined(tempEvent.tiltX)) tempEvent.tiltX = 0;
      if (isUndefined(tempEvent.tiltY)) tempEvent.tiltY = 0;
      if (isUndefined(tempEvent.pointerType)) tempEvent.pointerType = 'mouse';
      if (isUndefined(tempEvent.pointerId)) tempEvent.pointerId = MOUSE_POINTER_ID;
      if (isUndefined(tempEvent.pressure)) tempEvent.pressure = 0.5;
      if (isUndefined(tempEvent.twist)) tempEvent.twist = 0;
      if (isUndefined(tempEvent.tangentialPressure)) tempEvent.tangentialPressure = 0;
      tempEvent.isNormalized = true;

      normalizedEvents.push(tempEvent);
    } else {
      normalizedEvents.push(event);
    }

    return normalizedEvents as PointerEvent[];
  }

  private normalizeWheelEvent(nativeEvent: WheelEvent): FederatedWheelEvent {
    const event = this.rootWheelEvent;

    this.transferMouseData(event, nativeEvent);

    event.deltaMode = nativeEvent.deltaMode;
    event.deltaX = nativeEvent.deltaX;
    event.deltaY = nativeEvent.deltaY;
    event.deltaZ = nativeEvent.deltaZ;

    const { x, y } = this.getViewportXY(nativeEvent);
    event.viewport.x = x;
    event.viewport.y = y;
    const { x: canvasX, y: canvasY } = this.canvas.viewport2Canvas(event.viewport);
    event.canvas.x = canvasX;
    event.canvas.y = canvasY;
    event.global.copyFrom(event.canvas);

    event.nativeEvent = nativeEvent;
    event.type = nativeEvent.type;

    return event;
  }

  private getViewportXY(nativeEvent: PointerEvent | WheelEvent) {
    let x = 0;
    let y = 0;

    const { offsetX, offsetY, clientX, clientY } = nativeEvent;

    if (this.config.supportsCSSTransform) {
      x = offsetX;
      y = offsetY;
    } else {
      const bbox = this.canvas?.canvasEl.getBoundingClientRect();
      if (bbox) {
        x = clientX - bbox.left;
        y = clientY - bbox.top;
      }
    }

    return { x, y };
  }
}
