import { DisplayObject } from '@/core';
import { StyleRenderer } from './interface';
import { Line } from '@/drawable';
import { CanvasContext } from '@/interface';

export class LineRenderer implements StyleRenderer {
  render = (ctx: CanvasRenderingContext2D, object: DisplayObject, context: CanvasContext) => {
    const { begin, end } = (object as Line).style;
    const canvas = context.renderingContext.root.ownerCanvas;
    const realBegin = canvas.canvas2Viewport(begin);
    const realEnd = canvas.canvas2Viewport(end);
    ctx.beginPath();
    ctx.moveTo(realBegin.x, realBegin.y);
    ctx.lineTo(realEnd.x, realEnd.y);
    ctx.stroke();
  };
}
