import { DisplayObject } from '@/core';
import { StyleRenderer } from './interface';
import { OffsetLine } from '@/drawable';
import { CanvasContext } from '@/interface';

export class OffsetLineRenderer implements StyleRenderer {
  render = (ctx: CanvasRenderingContext2D, object: DisplayObject, context: CanvasContext) => {
    const { beginOffset, endOffset, origin } = (object as OffsetLine).style;
    const canvas = context.renderingContext.root.ownerCanvas;
    const lengthFactor = 1;
    const realOrigin = canvas.canvas2Viewport(origin);
    const realBegin = {
      x: realOrigin.x + beginOffset.x * lengthFactor,
      y: realOrigin.y + beginOffset.y * lengthFactor,
    };
    const realEnd = { x: realOrigin.x + endOffset.x * lengthFactor, y: realOrigin.y + endOffset.y * lengthFactor };

    ctx.beginPath();
    ctx.moveTo(realBegin.x, realBegin.y);
    ctx.lineTo(realEnd.x, realEnd.y);
    ctx.stroke();
  };
}
