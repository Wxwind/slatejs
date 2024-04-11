import { Shape } from '@/types';
import { CanvasContext, IRenderingPlugin } from '../../interface';
import { ContextSystem } from '../../systems/ContextSystem';
import { CanvasKitContext } from './interface';
import { CirleRenderer, StyleRenderer } from './shape';
import { CurveRenderer } from './shape/Curve';

export class CanvasKitRendererPlguin implements IRenderingPlugin {
  name = 'CanvasKitRenderer';
  private styleRendererFactory!: Record<Shape, StyleRenderer | undefined>;

  apply(context: CanvasContext): void {
    const { renderingSystem, contextSystem, config } = context;

    const styleRendererFactory: Record<Shape, StyleRenderer | undefined> = {
      [Shape.Circle]: new CirleRenderer(),
      [Shape.Curve]: new CurveRenderer(),
      [Shape.Group]: undefined,
      [Shape.Line]: undefined,
    };

    this.styleRendererFactory = styleRendererFactory;

    renderingSystem.hooks.render.tap((displayObject) => {
      const CanvasKitContext = (contextSystem as ContextSystem<CanvasKitContext>).getContext();
      const { CanvasKit, surface } = CanvasKitContext;
      const canvas = surface.getCanvas();

      canvas.save();
      canvas.scale(config.devicePixelRatio, config.devicePixelRatio); // physical pixels to CSS pixels
      // rendering

      // reset matrix
      canvas.restore();
    });
  }
}
