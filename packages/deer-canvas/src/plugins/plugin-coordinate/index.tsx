import { CanvasContext, IRenderingPlugin } from '@/interface';

export class CoordinatePlugin implements IRenderingPlugin {
  apply = (context: CanvasContext) => {
    const { renderingSystem, renderingContext, contextSystem, config, camera } = context;

    renderingSystem.hooks.beginFrame.tap(() => {});
  };
}
