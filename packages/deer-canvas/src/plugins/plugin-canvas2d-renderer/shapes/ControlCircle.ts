import { DisplayObject } from '@/core';
import { StyleRenderer } from './interface';
import { CanvasContext } from '@/interface';
import { ControlCircle } from '@/drawable/ContorlCircle';

export class ControlCircleRender implements StyleRenderer {
  render = (ctx: CanvasRenderingContext2D, object: DisplayObject, context: CanvasContext) => {
    const { centerOffset, origin, radius } = (object as ControlCircle).style;
    const canvas = context.renderingContext.root.ownerCanvas;
    const realOrigin = canvas.canvas2Viewport(origin);
    const realCenter = { x: realOrigin.x + centerOffset.x, y: realOrigin.y + centerOffset.y };
    ctx.beginPath();
    ctx.arc(realCenter.x, realCenter.y, radius, 0, Math.PI * 2, false);
    ctx.fill();
  };
}
