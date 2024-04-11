import { Point } from '@/util';
import { CanvasContext, IRenderingPlugin } from '../interface';
import { Gesture, FullGestureState, EventTypes } from '@use-gesture/vanilla';

export class ControlPlugin implements IRenderingPlugin {
  private gesture: Gesture | undefined;

  private context: CanvasContext = {} as CanvasContext;

  apply(context: CanvasContext): void {
    this.context = context;

    context.renderingSystem.hooks.init.tap(() => {
      const el = context.contextSystem.getCanvasElement();

      const { renderingContext } = context;
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

      const gesture = new Gesture(el, {
        onPinch: (e) => {
          if (isHitRoot(e.event)) this.onPinch(e);
        },
        onScroll: this.onScroll,
        onDrag: (e) => {
          if (isHitRoot(e.event)) this.onDrag(e);
        },
      });

      this.gesture = gesture;
    });

    context.renderingSystem.hooks.destory.tap(() => {
      this.gesture?.destroy();
    });
  }

  private onPinch = (e: FullGestureState<'pinch'>) => {
    const { origin, da, initial, touches, timeStamp } = e;
  };

  private onScroll = (e: FullGestureState<'scroll'>) => {
    const { delta } = e;
    console.log('scroll');
    const { renderingContext } = this.context;
    const { root } = renderingContext;
    // camera.setZoom(-delta[0], -delta[1]);
  };

  private onDrag = (e: FullGestureState<'drag'>) => {
    const { timeStamp, delta } = e;
    console.log('dragging', delta);

    const { camera } = this.context;
    camera.pan(delta[0], -delta[1]);
  };
}
