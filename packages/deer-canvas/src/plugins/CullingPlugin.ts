import { CanvasContext, IRenderingPlugin } from '../interface';

export class CullingPlugin implements IRenderingPlugin {
  name = 'Culling';

  apply(context: CanvasContext): void {
    context.renderingSystem.hooks.cull.tap((object, camera) => {
      return object;
    });
  }
}
