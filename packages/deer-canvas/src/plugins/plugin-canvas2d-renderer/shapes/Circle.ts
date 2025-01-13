import { DisplayObject } from '@/core';
import { StyleRenderer } from './interface';
import { Circle } from '@/drawable/Circle';
import { CanvasContext } from '@/interface';

export class CircleRenderer implements StyleRenderer {
  render = (ctx: CanvasRenderingContext2D, object: DisplayObject, context: CanvasContext) => {
    const { center, radius } = (object as Circle).style;
    const canvas = context.renderingContext.root.ownerCanvas;
    const realCenter = canvas.canvas2Viewport(center);
    ctx.beginPath();
    ctx.arc(realCenter.x, realCenter.y, radius, 0, Math.PI * 2, false);
    ctx.fill();
  };
}
