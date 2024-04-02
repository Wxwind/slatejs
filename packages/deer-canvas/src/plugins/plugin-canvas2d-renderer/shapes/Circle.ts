import { DisplayObject } from '@/core';
import { StyleRenderer } from './interface';
import { Circle } from '@/drawable/Circle';

export class CirleRenderer implements StyleRenderer {
  render = (ctx: CanvasRenderingContext2D, object: DisplayObject) => {
    const { center, radius } = (object as Circle).style;
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2, false);
    ctx.lineWidth = 1;
    ctx.fill();
  };
}
