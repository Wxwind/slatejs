import { DisplayObject } from '@/core';
import { CanvasContext, IRenderingPlugin } from '@/interface';
import { ContextSystem } from '@/systems';
import { Shape } from '@/types';
import { mat4 } from 'gl-matrix';
import { CirleRenderer, LineRenderer, StyleRenderer } from './shapes';
import { CurveRenderer } from './shapes/Curve';
import { isNil } from '@/util';

export type Canvas2DRendererPluginOpts = {
  /** temporary way to make compatibility with Coordinate plugin */
  forceSkipClear: boolean;
};

export class Canvas2DRendererPlugin implements IRenderingPlugin {
  name = 'Canvas2DRenderer';
  private fullRendering = false;

  private styleRendererFactory!: Record<Shape, StyleRenderer | undefined>;

  private dprMatrix = mat4.create();
  private vpMatrix = mat4.create();
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
      [Shape.Polygon]: undefined,
    };

    this.styleRendererFactory = styleRendererFactory;

    renderingSystem.hooks.render.tap((renderQueue: DisplayObject[]) => {
      const ctx = (contextSystem as ContextSystem<CanvasRenderingContext2D>).getContext();

      if (this.fullRendering) {
        this.renderByZIndex(renderingContext.root, ctx, context);
      } else {
        const dpr = config.devicePixelRatio;
        mat4.fromScaling(this.dprMatrix, [dpr, dpr, 1]);
        mat4.multiply(this.vpMatrix, this.dprMatrix, camera.OrthographicMatrix);

        ctx.save();
        !this.forceSkipClear && ctx.clearRect(0, 0, config.width * dpr, config.height * dpr);
        ctx.setTransform(
          this.vpMatrix[0],
          this.vpMatrix[1],
          this.vpMatrix[4],
          this.vpMatrix[5],
          this.vpMatrix[12],
          this.vpMatrix[13]
        );
        // rendering
        // TODO: dirty render (merge AABB and intersect)
        const dirtyObjects = renderQueue;

        dirtyObjects
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
      this.applyWorldTransform(ctx, object);

      ctx.save();

      // apply style
      this.applyStyle(ctx, object);
      // render shape
      renderer.render(ctx, object);
      ctx.restore();
    }
  };

  private applyWorldTransform = (ctx: CanvasRenderingContext2D, object: DisplayObject) => {
    // TODO: Support anchor
    mat4.copy(this.tmpMat4, object.getWorldTransform());

    mat4.multiply(this.tmpMat4, this.vpMatrix, this.tmpMat4);

    ctx.setTransform(
      this.tmpMat4[0],
      this.tmpMat4[1],
      this.tmpMat4[4],
      this.tmpMat4[5],
      this.tmpMat4[12],
      this.tmpMat4[13]
    );
  };

  private applyStyle = (ctx: CanvasRenderingContext2D, object: DisplayObject) => {
    const { opacity, fillStyle, strokeStyle, lineWidth } = object.style;

    if (!isNil(opacity)) ctx.globalAlpha = opacity;
    if (!isNil(fillStyle)) ctx.fillStyle = fillStyle;
    if (!isNil(strokeStyle)) ctx.strokeStyle = strokeStyle;
    if (!isNil(lineWidth)) ctx.lineWidth = lineWidth;
  };
}
