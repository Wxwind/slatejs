import { CanvasContext, IRenderingPlugin } from '../../interface';
import { ContextSystem } from '../../systems/ContextSystem';
import { CanvasKitContext } from './interface';

export class CanvasKitRendererPlguin implements IRenderingPlugin {
  apply(context: CanvasContext): void {
    const { renderingSystem, contextSystem, config } = context;

    renderingSystem.hooks.render.tap((displayObject) => {
      const CanvasKitContext = (contextSystem as ContextSystem<CanvasKitContext>).getContext();
      const { CanvasKit, surface } = CanvasKitContext;
      const canvas = surface.getCanvas();

      canvas.save();
      canvas.scale(config.devicePixelRatio, config.devicePixelRatio); // physical pixels to CSS pixels
      // rendering
      displayObject.render(canvas);
      // reset matrix
      canvas.restore();
    });
  }
}
