import { CanvasContext, IRenderingPlugin } from '@/interface';

export class CoordinatePlugin implements IRenderingPlugin {
  apply = (context: CanvasContext) => {
    const { renderingSystem, renderingContext } = context;

    renderingSystem.hooks.init.tap(() => {
      renderingContext.root.transform.setLocalScale(16, 16);
    });
  };
}
