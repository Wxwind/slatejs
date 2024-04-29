import { DisplayObject } from '@/core';
import { StyleRenderer } from './interface';
import { Canvas, CanvasKit } from 'canvaskit-wasm';
import { Circle, CircleStyleProps } from '@/drawable/Circle';

export class CirleRenderer implements StyleRenderer {
  render = (object: DisplayObject, CanvasKit: CanvasKit, canvas: Canvas) => {
    const style = (object as Circle).style;
    const paint = new CanvasKit.Paint();
    const color = CanvasKit.Color(255, 0, 0, 1);

    paint.setColor(color);
    paint.setStyle(CanvasKit.PaintStyle.Stroke);

    canvas.drawCircle(style.center.x, style.center.y, style.radius, paint);
  };
}
