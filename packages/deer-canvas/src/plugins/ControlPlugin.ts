import { Point, clamp } from '@/util';
import { CanvasContext, IRenderingPlugin } from '../interface';
import Hammer from 'hammerjs';
import { FederatedWheelEvent } from '@/events/FederatedWheelEvent';

export class ControlPlugin implements IRenderingPlugin {
  name = 'Control';

  hammer!: HammerManager;

  private context: CanvasContext = {} as CanvasContext;

  lastX = 0;
  lastY = 0;
  isMoving = false;

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
      const { x: canvasX, y: canvasY } = root.ownerCanvas.viewport2Canvas(a);
      const hitResult = context.eventSystem.hitTest(canvasX, canvasY);
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
        camera.pan(deltaX, -deltaY);
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
    const newZoom = clamp(camera.Zoom + (e.deltaY * 1) / 100, 1, 50);
    camera.setZoomByScroll(newZoom, [e.viewportX, e.viewportY]);
  };
}
