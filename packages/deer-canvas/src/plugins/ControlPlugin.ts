import { CanvasContext, IRenderingPlugin } from '../interface';
import { Gesture, FullGestureState } from '@use-gesture/vanilla';

export class ControlPlugin implements IRenderingPlugin {
  private gesture: Gesture | undefined;

  apply(context: CanvasContext): void {
    context.renderingSystem.hooks.init.tap(() => {
      const el = context.contextSystem.getCanvasElement();
      const gesture = new Gesture(el, {
        onPinch: this.onPinch,
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
}
