import { CanvasContext, IRenderingPlugin } from '@/interface';

export class CoordinatePlugin implements IRenderingPlugin {
  apply = (context: CanvasContext) => {
    const { renderingSystem, renderingContext, camera } = context;

    renderingSystem.hooks.init.tap(() => {
      camera.setFlipY(true);
      renderingContext.root.transform.setLocalScale(16, 16);
    });
  };
}
