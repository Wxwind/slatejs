import { Point, Vector2, clamp, isCtrlKey, isNil } from '@/util';
import { CanvasContext, IRenderingPlugin } from '../interface';
import Hammer, { merge } from 'hammerjs';
import { FederatedWheelEvent } from '@/events/FederatedWheelEvent';

export interface ControlPluginConfig {
  minZoom?: number;
  maxZoom?: number;
}

export class ControlPlugin implements IRenderingPlugin {
  name = 'Control';

  hammer!: HammerManager;

  private context: CanvasContext = {} as CanvasContext;

  lastX = 0;
  lastY = 0;
  isMoving = false;

  private config: ControlPluginConfig = {} as ControlPluginConfig;

  constructor(config: ControlPluginConfig) {
    this.config = config;
  }

  apply(context: CanvasContext): void {
    this.context = context;

    const { renderingContext, config } = context;
    const { canvasEl } = config;
    const { root } = renderingContext;

    const isHitRoot = (e: PointerEvent | TouchEvent | MouseEvent | KeyboardEvent) => {
      if (e instanceof TouchEvent || e instanceof KeyboardEvent) {
        console.warn('Control Plugin is not support for TouchEvent or KeyboardEvent');
        return false;
      }
      const a = root.ownerCanvas.client2Viewport(new Point(e.clientX, e.clientY));
      const hitResult = context.eventSystem.hitTest(a.x, a.y);
      if (hitResult === root) {
        return true;
      }
      return false;
    };

    const onPanStart = (e: HammerInput) => {
      if (!isHitRoot(e.srcEvent)) return;
      this.lastX = e.center.x;
      this.lastY = e.center.y;
      this.isMoving = true;
    };

    const onPanMove = (e: HammerInput) => {
      e.srcEvent.stopPropagation();
      if (this.isMoving) {
        const deltaX = e.center.x - this.lastX;
        const deltaY = e.center.y - this.lastY;
        this.lastX = e.center.x;
        this.lastY = e.center.y;
        const { camera } = this.context;
        camera.pan(-deltaX, deltaY);
      }
    };

    const onPanEnd = (e: HammerInput) => {
      this.isMoving = false;
    };

    const preventScroll = (e: WheelEvent) => {
      e.preventDefault();
    };

    context.renderingSystem.hooks.init.tap(() => {
      const hammer = new Hammer(root as unknown as HTMLElement, {
        inputClass: Hammer.PointerEventInput,
      });
      this.hammer = hammer;
      this.hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
      this.hammer.get('pinch').set({ enable: true });
      this.hammer.on('panstart', onPanStart);
      this.hammer.on('panmove', onPanMove);
      this.hammer.on('panend', onPanEnd);
      this.hammer.on('pinch', this.onPinch);
      canvasEl.addEventListener('wheel', preventScroll, { passive: false });
      root.addEventListener('wheel', this.onScroll);
    });

    context.renderingSystem.hooks.destory.tap(() => {
      this.hammer.off('panstart', onPanStart);
      this.hammer.off('panmove', onPanMove);
      this.hammer.off('panend', onPanEnd);
      this.hammer.off('pinch', this.onPinch);
      canvasEl.removeEventListener('wheel', preventScroll);
      root.removeEventListener('wheel', this.onScroll);
    });
  }

  private onPinch = (e: HammerInput) => {
    console.log('pinch', e);
    const { camera } = this.context;
    camera.dolly(e.deltaY);
  };

  private onScroll = (e: FederatedWheelEvent) => {
    const { camera, config } = this.context;
    if (isCtrlKey(e)) {
      const newZoom = this.clampZoom(camera.Zoom[0] + e.deltaY / 3);
      camera.setZoomByScroll([newZoom, camera.Zoom[1]], [e.viewportX, e.viewportY]);
    } else {
      const newZoom = this.clampZoom(camera.Zoom[1] + e.deltaY / 3);
      camera.setZoomByScroll([camera.Zoom[0], newZoom], [e.viewportX, e.viewportY]);
    }
  };

  private clampZoom = (zoom: number) => {
    const min = this.config.minZoom;
    const max = this.config.maxZoom;
    let a = !isNil(min) ? Math.max(min, zoom) : zoom;
    a = !isNil(max) ? Math.min(max, a) : a;
    return a;
  };
}
