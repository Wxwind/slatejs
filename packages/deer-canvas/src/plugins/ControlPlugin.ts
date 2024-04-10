import { CanvasContext, IRenderingPlugin } from '../interface';
import { Gesture, FullGestureState } from '@use-gesture/vanilla';

export class ControlPlugin implements IRenderingPlugin {
  private gesture: Gesture | undefined;

  private context: CanvasContext = {} as CanvasContext;

  apply(context: CanvasContext): void {
    this.context = context;

    context.renderingSystem.hooks.init.tap(() => {
      const el = context.contextSystem.getCanvasElement();

      const gesture = new Gesture(el, {
        onPinch: this.onPinch,
        onScroll: this.onScroll,
        onDrag: this.onDrag,
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
