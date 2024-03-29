import { DisplayObject } from '@/core';
import { CanvasContext, IRenderingPlugin } from '@/interface';
import { ContextSystem } from '@/systems';
import { Shape } from '@/types';
import { mat4 } from 'gl-matrix';
import { CirleRenderer, StyleRenderer } from './shapes';
import { CurveRenderer } from './shapes/Curve';

export class Canvas2DRendererPlugin implements IRenderingPlugin {
  private fullRendering = false;

  private renderQueue: DisplayObject[] = [];
  private styleRendererFactory!: Record<Shape, StyleRenderer | undefined>;

  private dprMatrix = mat4.create();
  private vpMatrix = mat4.create();

  apply = (context: CanvasContext) => {
    const { renderingSystem, renderingContext, contextSystem, config, camera } = context;

    const styleRendererFactory: Record<Shape, StyleRenderer | undefined> = {
      [Shape.Circle]: new CirleRenderer(),
      [Shape.Curve]: new CurveRenderer(),
      [Shape.Group]: undefined,
    };

    this.styleRendererFactory = styleRendererFactory;

    renderingSystem.hooks.render.tap((object: DisplayObject) => {
      if (!this.fullRendering) {
        // render at the end of frame
        this.renderQueue.push(object);
      }
    });

    renderingSystem.hooks.endFrame.tap(() => {
      const ctx = (contextSystem as ContextSystem<CanvasRenderingContext2D>).getContext();
      if (this.fullRendering) {
        this.renderByZIndex(renderingContext.root, ctx, context);
      } else {
        const dpr = config.devicePixelRatio;
        mat4.fromScaling(this.dprMatrix, [dpr, dpr, 1]);
        mat4.multiply(this.vpMatrix, this.dprMatrix, camera.OrthographicMatrix);

        ctx.save();
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
        const dirtyObjects = this.renderQueue;

        dirtyObjects
          .sort((a, b) => a.sortable.renderOrder - b.sortable.renderOrder)
          .forEach((object) => {
            if (object.visible) {
              this.renderDisplayObject(object, ctx, context);
            }
          });
        // reset matrix
        ctx.restore();

        this.renderQueue = [];
      }
    });
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

      // render shape
      // apply style
      renderer.render(object, ctx);
      ctx.restore();
    }
  };

  private applyWorldTransform = (ctx: CanvasRenderingContext2D, object: DisplayObject) => {};
}
