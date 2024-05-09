import { DisplayObject } from '@/core';
import { CanvasContext, IRenderingPlugin } from '@/interface';
import { ContextSystem } from '@/systems';
import { Shape } from '@/types';
import { mat4 } from 'gl-matrix';
import { CirleRenderer, LineRenderer, StyleRenderer } from './shapes';
import { CurveRenderer } from './shapes/Curve';
import { isNil } from '@/util';
import { ControlCircleRender } from './shapes/ControlCircle';

export type Canvas2DRendererPluginOpts = {
  /** temporary way to make compatibility with Coordinate plugin */
  forceSkipClear: boolean;
};

export class Canvas2DRendererPlugin implements IRenderingPlugin {
  name = 'Canvas2DRenderer';
  private fullRendering = false;

  private styleRendererFactory!: Record<Shape, StyleRenderer | undefined>;

  private tmpMat4 = mat4.create();

  private forceSkipClear = false;

  constructor(opts?: Partial<Canvas2DRendererPluginOpts>) {
    if (opts) {
      opts.forceSkipClear && (this.forceSkipClear = opts.forceSkipClear);
    }
  }

  apply = (context: CanvasContext) => {
    const { renderingSystem, renderingContext, contextSystem, config, camera } = context;

    const styleRendererFactory: Record<Shape, StyleRenderer | undefined> = {
      [Shape.Group]: undefined,
      [Shape.Circle]: new CirleRenderer(),
      [Shape.Curve]: new CurveRenderer(),
      [Shape.Line]: new LineRenderer(),
      [Shape.ControlCircle]: new ControlCircleRender(),
      [Shape.Polygon]: undefined,
    };

    this.styleRendererFactory = styleRendererFactory;

    renderingSystem.hooks.render.tap((renderQueue: DisplayObject[]) => {
      const ctx = (contextSystem as ContextSystem<CanvasRenderingContext2D>).getContext();

      if (this.fullRendering) {
        this.renderByZIndex(renderingContext.root, ctx, context);
      } else {
        const dpr = config.devicePixelRatio;

        ctx.save();
        !this.forceSkipClear && ctx.clearRect(0, 0, config.width * dpr, config.height * dpr);
        ctx.scale(dpr, dpr);
        // rendering
        renderQueue
          .sort((a, b) => a.sortable.renderOrder - b.sortable.renderOrder)
          .forEach((object) => {
            if (object.visible) {
              this.renderDisplayObject(object, ctx, context);
            }
          });
        // reset matrix
        ctx.restore();
      }
    });

    renderingSystem.hooks.endFrame.tap(() => {});
  };

  private renderByZIndex = (object: DisplayObject, ctx: CanvasRenderingContext2D, canvasContext: CanvasContext) => {
    if (object.visible) {
      this.renderDisplayObject(object, ctx, canvasContext);
    }

    const sorted = object.sortable.sorted || object.children;
    sorted.forEach((child) => {
      this.renderByZIndex(child, ctx, canvasContext);
    });
  };

  private renderDisplayObject = (
    object: DisplayObject,
    ctx: CanvasRenderingContext2D,
    canvasContext: CanvasContext
  ) => {
    const objType = object.type;
    const renderer = this.styleRendererFactory[objType];

    if (renderer) {
      ctx.save();

      // apply style
      this.applyStyle(ctx, object);
      // render shape
      renderer.render(ctx, object, canvasContext);
      ctx.restore();
    }
  };

  private applyStyle = (ctx: CanvasRenderingContext2D, object: DisplayObject) => {
    const { opacity, fillStyle, strokeStyle, lineWidth } = object.style;

    if (!isNil(opacity)) ctx.globalAlpha = opacity;
    if (!isNil(fillStyle)) ctx.fillStyle = fillStyle;
    if (!isNil(strokeStyle)) ctx.strokeStyle = strokeStyle;
    if (!isNil(lineWidth)) ctx.lineWidth = lineWidth;
  };
}
