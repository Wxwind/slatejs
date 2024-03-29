import { DisplayObject } from '@/core';
import { StyleRenderer } from './interface';
import { Circle } from '@/drawable/Circle';

export class CirleRenderer implements StyleRenderer {
  render = (object: DisplayObject, ctx: CanvasRenderingContext2D) => {
    const { center, radius } = (object as Circle).style;
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2, false);
  };
}
