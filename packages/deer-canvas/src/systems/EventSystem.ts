/* eslint-disable @typescript-eslint/no-explicit-any */
import { FederatedEvent } from '../events/FederatedEvent';
import { Cursor, TrackingData } from '../events/types';
import { DisplayObject } from '../core/DisplayObject';
import { IFederatedEventTarget } from '../events/FederatedEventTarget';
import { FederatedPointerEvent } from '../events/FederatedPointerEvent';
import { FederatedMouseEvent } from '../events/FederatedMouseEvent';
import { Point } from '../util/math';
import { FederatedWheelEvent } from '../events/FederatedWheelEvent';
import { CanvasContext } from '../interface';

const PROPAGATION_LIMIT = 2048;

export class EventSystem {
  cursor: Cursor | null = 'default';

  private rootTarget!: DisplayObject;

  private mappingTable: Record<
    string,
    {
      fn: (e: FederatedEvent) => void;
      priority: number; // not used for now.
    }[]
  > = {};

  private mappingState: Record<string, any> = {
    trackingData: {},
  };

  private eventPool: Map<typeof FederatedEvent, FederatedEvent[]> = new Map();

  constructor(private context: CanvasContext) {}

  init() {
    this.rootTarget = this.context.renderingContext.root;
    this.addEventMapping('pointerdown', this.onPointerDown);
    this.addEventMapping('pointerup', this.onPointerUp);
    this.addEventMapping('pointermove', this.onPointerMove);
    this.addEventMapping('pointerout', this.onPointerOut);
    this.addEventMapping('pointerleave', this.onPointerOut);
    this.addEventMapping('pointercancel', this.onPointerCancel);
    this.addEventMapping('pointerover', this.onPointerOver);
    this.addEventMapping('pointerupoutside', this.onPointerUpOutside);
    this.addEventMapping('wheel', this.onWheel);
  }

  destroy(): void {
    this.mappingTable = {};
    this.mappingState = {};
    this.eventPool.clear();
  }

  private addEventMapping(type: string, fn: (e: FederatedEvent) => void) {
    if (!this.mappingTable[type]) {
      this.mappingTable[type] = [];
    }

    this.mappingTable[type].push({
      fn,
      priority: 0,
    });
    this.mappingTable[type].sort((a, b) => a.priority - b.priority);
  }

  public mapEvent(e: FederatedEvent): void {
    if (!this.rootTarget) {
      return;
    }

    const mappers = this.mappingTable[e.type];

    if (mappers) {
      for (let i = 0, j = mappers.length; i < j; i++) {
        mappers[i].fn(e);
      }
    } else {
      console.warn(`[EventBoundary]: Event mapping not defined for ${e.type}`);
    }
  }

  dispatchEvent(e: FederatedEvent, type?: string) {
    e.propagationStopped = false;
    e.propagationImmediatelyStopped = false;
    this.propagate(e, type);
  }

  private propagate(e: FederatedEvent, type?: string) {
    // This usually occurs when the scene graph is not interactive.
    if (!e.target) {
      return;
    }

    // see https://www.w3.org/TR/DOM-Level-3-Events/#event-flow
    const composedPath = e.composedPath();

    // event flow: Capture -> Target -> Bubbling

    // Capture Phase
    e.eventPhase = e.CAPTURING_PHASE;
    for (let i = composedPath.length - 1; i >= 1; i--) {
      e.currentTarget = composedPath[i];
      this.notifyTarget(e, type);
      if (e.propagationStopped || e.propagationImmediatelyStopped) return;
    }

    // Target Phase
    e.eventPhase = e.AT_TARGET;
    e.currentTarget = e.target;
    this.notifyTarget(e, type);
    if (e.propagationStopped || e.propagationImmediatelyStopped) return;

    // Bubbling Phasse
    e.eventPhase = e.BUBBLING_PHASE;
    for (let i = 1; i < composedPath.length; i++) {
      e.currentTarget = composedPath[i];
      this.notifyTarget(e, type);
      if (e.propagationStopped || e.propagationImmediatelyStopped) return;
    }
  }

  private notifyTarget(e: FederatedEvent, type?: string) {
    type = type ?? e.type;
    const key = e.eventPhase === e.CAPTURING_PHASE || e.eventPhase === e.AT_TARGET ? `${type}capture` : type;

    this.notifyListeners(e, key);

    if (e.eventPhase === e.AT_TARGET) {
      this.notifyListeners(e, type);
    }
  }

  private notifyListeners(e: FederatedEvent, type: string) {
    const emitter = e.currentTarget?.emitter;
    const listeners = emitter?.listeners[type];

    if (!listeners) return;

    for (let i = 0; i < listeners.length && !e.propagationImmediatelyStopped; i++) {
      // 'this' is always e.currentTarget, so we can just call listeners[i](e)
      listeners[i].call(e.currentTarget, e);
    }
  }

  /** return [target, parent, root] */
  propagationPath(target: IFederatedEventTarget): IFederatedEventTarget[] {
    const propagationPath = [target];

    for (let i = 0; i < PROPAGATION_LIMIT && target !== this.rootTarget; i++) {
      if (!target.parent) {
        throw new Error('Cannot find propagation path to disconnected target');
      }

      propagationPath.push(target.parent);

      target = target.parent;
    }

    return propagationPath;
  }

  private onPointerDown = (from: FederatedEvent) => {
    if (!(from instanceof FederatedPointerEvent)) {
      console.warn('EventBoundary cannot map a non-pointer event as a pointer event');

      return;
    }

    const e = this.createPointerEvent(from);

    this.dispatchEvent(e, 'pointerdown');

    if (e.pointerType === 'touch') {
      this.dispatchEvent(e, 'touchstart');
    } else if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
      const isRightButton = e.button === 2;

      this.dispatchEvent(e, isRightButton ? 'rightdown' : 'mousedown');
    }

    const trackingData = this.trackingData(from.pointerId);

    trackingData.pressTargetsByButton[from.button] = e.composedPath();

    this.freeEvent(e);
  };

  private onPointerUp = (from: FederatedEvent) => {
    if (!(from instanceof FederatedPointerEvent)) {
      console.warn('EventBoundary cannot map a non-pointer event as a pointer event');

      return;
    }

    const now = performance.now();
    const e = this.createPointerEvent(from);

    this.dispatchEvent(e, 'pointerup');

    if (e.pointerType === 'touch') {
      this.dispatchEvent(e, 'touchend');
    } else if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
      const isRightButton = e.button === 2;
      this.dispatchEvent(e, isRightButton ? 'rightup' : 'mouseup');
    }

    const trackingData = this.trackingData(from.pointerId);
    const pressTarget = this.findMountedTarget(trackingData.pressTargetsByButton[from.button]);

    let clickTarget = pressTarget;

    // pointerupoutside only bubbles. It only bubbles upto the parent that doesn't contain
    // the pointerup location.
    if (pressTarget && !e.composedPath().includes(pressTarget)) {
      let currentTarget: IFederatedEventTarget | undefined = pressTarget;

      while (currentTarget && !e.composedPath().includes(currentTarget)) {
        e.currentTarget = currentTarget;

        this.notifyTarget(e, 'pointerupoutside');

        if (e.pointerType === 'touch') {
          this.notifyTarget(e, 'touchendoutside');
        } else if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
          const isRightButton = e.button === 2;

          this.notifyTarget(e, isRightButton ? 'rightupoutside' : 'mouseupoutside');
        }

        currentTarget = currentTarget.parent;
      }

      delete trackingData.pressTargetsByButton[from.button];

      // currentTarget is the most specific ancestor holding both the pointerdown and pointerup
      // targets. That is - it's our click target!
      clickTarget = currentTarget;
    }

    if (clickTarget) {
      const clickEvent = this.clonePointerEvent(e, 'click');

      clickEvent.target = clickTarget;
      clickEvent.path = [];

      if (!trackingData.clicksByButton[from.button]) {
        trackingData.clicksByButton[from.button] = {
          clickCount: 0,
          target: clickEvent.target,
          timeStamp: now,
        };
      }

      const clickHistory = trackingData.clicksByButton[from.button];

      if (clickHistory.target === clickEvent.target && now - clickHistory.timeStamp < 200) {
        ++clickHistory.clickCount;
      } else {
        clickHistory.clickCount = 1;
      }

      clickHistory.target = clickEvent.target;
      clickHistory.timeStamp = now;

      clickEvent.detail = clickHistory.clickCount;

      if (clickEvent.pointerType === 'mouse') {
        const isRightButton = clickEvent.button === 2;

        this.dispatchEvent(clickEvent, isRightButton ? 'rightclick' : 'click');
      } else if (clickEvent.pointerType === 'touch') {
        this.dispatchEvent(clickEvent, 'tap');
      }

      this.dispatchEvent(clickEvent, 'pointertap');

      this.freeEvent(clickEvent);
    }

    this.freeEvent(e);
  };

  private onPointerMove = (from: FederatedEvent) => {
    if (!(from instanceof FederatedPointerEvent)) {
      console.warn('EventBoundary cannot map a non-pointer event as a pointer event');

      return;
    }

    const e = this.createPointerEvent(from);

    const isMouse = e.pointerType === 'mouse' || e.pointerType === 'pen';
    const trackingData = this.trackingData(from.pointerId);
    const outTarget = this.findMountedTarget(trackingData.overTargets);

    // First pointerout/pointerleave
    if (trackingData.overTargets?.length > 0 && outTarget !== e.target) {
      // pointerout always occurs on the overTarget when the pointer hovers over another element.
      const outType = from.type === 'mousemove' ? 'mouseout' : 'pointerout';
      const outEvent = this.createPointerEvent(from, outType, outTarget);

      this.dispatchEvent(outEvent, 'pointerout');
      if (isMouse) this.dispatchEvent(outEvent, 'mouseout');

      // If the pointer exits overTarget and its descendants, then a pointerleave event is also fired. This event
      // is dispatched to all ancestors that no longer capture the pointer.
      if (!(outTarget && e.composedPath().includes(outTarget))) {
        const leaveEvent = this.createPointerEvent(from, 'pointerleave', outTarget);

        leaveEvent.eventPhase = leaveEvent.AT_TARGET;

        while (leaveEvent.target && !e.composedPath().includes(leaveEvent.target)) {
          leaveEvent.currentTarget = leaveEvent.target;

          this.notifyTarget(leaveEvent);
          if (isMouse) this.notifyTarget(leaveEvent, 'mouseleave');

          leaveEvent.target = leaveEvent.target.parent ?? null;
        }

        this.freeEvent(leaveEvent);
      }

      this.freeEvent(outEvent);
    }

    // Then pointerover
    if (outTarget !== e.target) {
      // pointerover always occurs on the new overTarget
      const overType = from.type === 'mousemove' ? 'mouseover' : 'pointerover';
      const overEvent = this.clonePointerEvent(e, overType); // clone faster

      this.dispatchEvent(overEvent, 'pointerover');
      if (isMouse) this.dispatchEvent(overEvent, 'mouseover');

      // Probe whether the newly hovered DisplayObject is an ancestor of the original overTarget.
      let overTargetAncestor = outTarget?.parent;

      while (overTargetAncestor && overTargetAncestor !== this.rootTarget.parent) {
        if (overTargetAncestor === e.target) break;

        overTargetAncestor = overTargetAncestor.parent;
      }

      // The pointer has entered a non-ancestor of the original overTarget. This means we need a pointerentered event
      const didPointerEnter = !overTargetAncestor || overTargetAncestor === this.rootTarget.parent;

      if (didPointerEnter) {
        const enterEvent = this.clonePointerEvent(e, 'pointerenter');

        enterEvent.eventPhase = enterEvent.AT_TARGET;

        while (enterEvent.target && enterEvent.target !== outTarget && enterEvent.target !== this.rootTarget.parent) {
          enterEvent.currentTarget = enterEvent.target;

          this.notifyTarget(enterEvent);
          if (isMouse) this.notifyTarget(enterEvent, 'mouseenter');

          enterEvent.target = enterEvent.target.parent ?? null;
        }

        this.freeEvent(enterEvent);
      }

      this.freeEvent(overEvent);
    }

    this.dispatchEvent(e, 'pointermove');

    if (e.pointerType === 'touch') this.dispatchEvent(e, 'touchmove');

    if (isMouse) {
      this.dispatchEvent(e, 'mousemove');
      this.cursor = e.target?.cursor || null;
    }

    trackingData.overTargets = e.composedPath();

    this.freeEvent(e);
  };

  private onPointerOut = (from: FederatedEvent) => {
    if (!(from instanceof FederatedPointerEvent)) {
      console.warn('EventBoundary cannot map a non-pointer event as a pointer event');

      return;
    }

    const trackingData = this.trackingData(from.pointerId);

    if (trackingData.overTargets) {
      const isMouse = from.pointerType === 'mouse' || from.pointerType === 'pen';
      const outTarget = this.findMountedTarget(trackingData.overTargets);

      // pointerout first
      const outEvent = this.createPointerEvent(from, 'pointerout', outTarget || undefined);

      this.dispatchEvent(outEvent);
      if (isMouse) this.dispatchEvent(outEvent, 'mouseout');

      // pointerleave(s) are also dispatched b/c the pointer must've left rootTarget and its descendants to
      // get an upstream pointerout event (upstream events do not know rootTarget has descendants).
      const leaveEvent = this.createPointerEvent(from, 'pointerleave', outTarget);

      leaveEvent.eventPhase = leaveEvent.AT_TARGET;

      while (leaveEvent.target && leaveEvent.target !== this.rootTarget.parent) {
        leaveEvent.currentTarget = leaveEvent.target;

        this.notifyTarget(leaveEvent);
        if (isMouse) {
          this.notifyTarget(leaveEvent, 'mouseleave');
        }

        leaveEvent.target = leaveEvent.target.parent || null;
      }

      trackingData.overTargets = [];

      this.freeEvent(outEvent);
      this.freeEvent(leaveEvent);
    }

    this.cursor = null;
  };

  private onPointerOver = (from: FederatedEvent) => {
    if (!(from instanceof FederatedPointerEvent)) {
      console.warn('EventBoundary cannot map a non-pointer event as a pointer event');

      return;
    }

    const trackingData = this.trackingData(from.pointerId);
    const e = this.createPointerEvent(from);

    const isMouse = e.pointerType === 'mouse' || e.pointerType === 'pen';

    this.dispatchEvent(e, 'pointerover');
    if (isMouse) this.dispatchEvent(e, 'mouseover');
    if (e.pointerType === 'mouse') this.cursor = e.target?.cursor || null;

    // pointerenter events must be fired since the pointer entered from upstream.
    const enterEvent = this.clonePointerEvent(e, 'pointerenter');

    enterEvent.eventPhase = enterEvent.AT_TARGET;

    while (enterEvent.target && enterEvent.target !== this.rootTarget.parent) {
      enterEvent.currentTarget = enterEvent.target;

      this.notifyTarget(enterEvent);
      if (isMouse) {
        // mouseenter should not bubble
        this.notifyTarget(enterEvent, 'mouseenter');
      }

      enterEvent.target = enterEvent.target.parent || null;
    }

    trackingData.overTargets = e.composedPath();

    this.freeEvent(e);
    this.freeEvent(enterEvent);
  };

  private onPointerUpOutside = (from: FederatedEvent) => {
    if (!(from instanceof FederatedPointerEvent)) {
      console.warn('EventBoundary cannot map a non-pointer event as a pointer event');

      return;
    }

    const trackingData = this.trackingData(from.pointerId);
    const pressTarget = this.findMountedTarget(trackingData.pressTargetsByButton[from.button]);
    const e = this.createPointerEvent(from);

    if (pressTarget) {
      let currentTarget: IFederatedEventTarget | null = pressTarget;

      while (currentTarget) {
        e.currentTarget = currentTarget;

        this.notifyTarget(e, 'pointerupoutside');

        if (e.pointerType === 'touch') {
          // this.notifyTarget(e, 'touchendoutside');
        } else if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
          this.notifyTarget(e, e.button === 2 ? 'rightupoutside' : 'mouseupoutside');
        }

        currentTarget = currentTarget.parent || null;
      }

      delete trackingData.pressTargetsByButton[from.button];
    }

    this.freeEvent(e);
  };

  private onWheel = (from: FederatedEvent) => {
    if (!(from instanceof FederatedWheelEvent)) {
      console.warn('EventBoundary cannot map a non-wheel event as a wheel event');

      return;
    }

    const wheelEvent = this.createWheelEvent(from);

    this.dispatchEvent(wheelEvent);
    this.freeEvent(wheelEvent);
  };

  private onPointerCancel = (from: FederatedEvent) => {
    if (!(from instanceof FederatedPointerEvent)) {
      console.warn('EventBoundary cannot map a non-pointer event as a pointer event');
      return;
    }

    const e = this.createPointerEvent(from);

    this.dispatchEvent(e);
    this.freeEvent(e);
  };

  /**
   * Finds the most specific event-target in the given propagation path that is still mounted in the scene graph.
   *
   * This is used to find the correct `pointerup` and `pointerout` target in the case that the original `pointerdown`
   * or `pointerover` target was unmounted from the scene graph.
   */
  private findMountedTarget(propagationPath: IFederatedEventTarget[] | null): IFederatedEventTarget | undefined {
    if (!propagationPath) {
      return;
    }

    let currentTarget = propagationPath[propagationPath.length - 1];
    for (let i = propagationPath.length - 2; i >= 0; i--) {
      const target = propagationPath[i];
      if (target.parent === currentTarget) {
        currentTarget = target;
      } else {
        break;
      }
    }

    return currentTarget;
  }

  private createPointerEvent(
    from: FederatedPointerEvent,
    type?: string,
    target?: IFederatedEventTarget
  ): FederatedPointerEvent {
    const event = this.allocateEvent(FederatedPointerEvent);

    this.copyPointerData(from, event);
    this.copyMouseData(from, event);
    this.copyData(from, event);

    event.nativeEvent = from.nativeEvent;
    event.originalEvent = from;

    event.target = target ?? this.hitTest(event.global.x, event.global.y);

    if (typeof type === 'string') {
      event.type = type;
    }

    return event;
  }

  private createWheelEvent(from: FederatedWheelEvent): FederatedWheelEvent {
    const event = this.allocateEvent(FederatedWheelEvent);

    this.copyWheelData(from, event);
    this.copyMouseData(from, event);
    this.copyData(from, event);

    event.nativeEvent = from.nativeEvent;
    event.originalEvent = from;
    event.target = this.hitTest(event.global.x, event.global.y);

    return event;
  }

  private clonePointerEvent(from: FederatedPointerEvent, type?: string): FederatedPointerEvent {
    const event = this.allocateEvent(FederatedPointerEvent);

    event.nativeEvent = from.nativeEvent;
    event.originalEvent = from.originalEvent;

    this.copyPointerData(from, event);
    this.copyMouseData(from, event);
    this.copyData(from, event);

    event.target = from.target;
    event.path = from.composedPath().slice();
    event.type = type ?? event.type;

    return event;
  }

  private copyPointerData(from: FederatedEvent, to: FederatedEvent): void {
    if (!(from instanceof FederatedPointerEvent && to instanceof FederatedPointerEvent)) return;

    to.pointerId = from.pointerId;
    to.width = from.width;
    to.height = from.height;
    to.isPrimary = from.isPrimary;
    to.pointerType = from.pointerType;
    to.pressure = from.pressure;
    to.tangentialPressure = from.tangentialPressure;
    to.tiltX = from.tiltX;
    to.tiltY = from.tiltY;
    to.twist = from.twist;
  }

  private copyMouseData(from: FederatedEvent, to: FederatedEvent): void {
    if (!(from instanceof FederatedMouseEvent && to instanceof FederatedMouseEvent)) return;

    to.altKey = from.altKey;
    to.button = from.button;
    to.buttons = from.buttons;
    to.shiftKey = from.shiftKey;
    to.ctrlKey = from.ctrlKey;
    to.metaKey = from.metaKey;
    to.client.copyFrom(from.client);
    to.movement.copyFrom(from.movement);
    to.screen.copyFrom(from.screen);
    to.global.copyFrom(from.global);
    to.canvas.copyFrom(from.canvas);
  }

  private copyWheelData(from: FederatedWheelEvent, to: FederatedWheelEvent): void {
    to.deltaMode = from.deltaMode;
    to.deltaX = from.deltaX;
    to.deltaY = from.deltaY;
    to.deltaZ = from.deltaZ;
  }

  private copyData(from: FederatedEvent, to: FederatedEvent) {
    to.timeStamp = performance.now();
    to.type = from.type;
    to.detail = from.detail;
    to.page.copyFrom(from.page);
  }

  private trackingData(id: number): TrackingData {
    if (!this.mappingState.trackingData[id]) {
      this.mappingState.trackingData[id] = {
        pressTargetsByButton: {},
        clicksByButton: {},
        overTargets: null,
      };
    }

    return this.mappingState.trackingData[id];
  }

  public hitTest(x: number, y: number): DisplayObject | null {
    const invertedPath = this.hitTestRecursive(this.rootTarget, new Point(x, y));
    return invertedPath && invertedPath[0];
  }

  protected hitTestRecursive(currentTarget: DisplayObject, location: Point): DisplayObject[] | null {
    if (!currentTarget.visible) return null;

    if (currentTarget.children.length > 0) {
      const children = currentTarget.children;
      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];

        const nestedHit = this.hitTestRecursive(child, location);

        if (nestedHit) {
          // check if not hit or child has been removed from its parent
          if (nestedHit.length > 0 && !nestedHit[nestedHit.length - 1].parent) {
            continue;
          }

          if (nestedHit.length > 0) {
            nestedHit.push(currentTarget);
          }

          return nestedHit;
        }
      }
    }

    if (currentTarget.isPointHit(location)) {
      return [currentTarget];
    }

    return null;
  }

  private allocateEvent<T extends FederatedEvent>(constructor: { new (boundary: EventSystem): T }): T {
    if (!this.eventPool.has(constructor as any)) {
      this.eventPool.set(constructor as any, []);
    }

    const event = (this.eventPool.get(constructor as any)!.pop() as T | undefined) || new constructor(this);

    event.eventPhase = event.NONE;
    event.currentTarget = null;
    event.path = [];
    event.target = null;

    return event;
  }

  private freeEvent<T extends FederatedEvent>(event: T) {
    if (event.manager !== this) throw new Error('It is illegal to free an event not managed by this EventBoundary!');

    const { constructor } = event;

    if (!this.eventPool.has(constructor as any)) {
      this.eventPool.set(constructor as any, []);
    }

    this.eventPool.get(constructor as any)!.push(event);
  }
}
