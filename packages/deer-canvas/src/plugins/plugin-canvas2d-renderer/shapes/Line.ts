import { DisplayObject } from '@/core';
import { StyleRenderer } from './interface';
import { Line } from '@/drawable';

export class LineRenderer implements StyleRenderer {
  render = (ctx: CanvasRenderingContext2D, object: DisplayObject) => {
    const { begin, end } = object as Line;
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(begin.x, begin.y);
    ctx.lineTo(end.x, end.y);
    ctx.fill();
  };
}
