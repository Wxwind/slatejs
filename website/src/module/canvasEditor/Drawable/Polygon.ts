import { Canvas, CanvasKit, Paint } from 'canvaskit-wasm';
import { DrawableObject } from '../DrawableObject';
import { Vector2 } from '../types';
import { isPointInShape } from '../util/math';

export class Polygon extends DrawableObject {
  points: Vector2[];
  paint: Paint;

  constructor(private canvaskit: CanvasKit, points: Vector2[]) {
    super();
    this.points = points;
    const paint = new canvaskit.Paint();
    const color = canvaskit.Color(255, 0, 0, 1);

    paint.setColor(color);
    paint.setStyle(canvaskit.PaintStyle.Stroke);
    this.paint = paint;
  }

  draw: (canvas: Canvas) => void = (canvas) => {
    const array = [];
    for (const p of this.points) {
      array.push(p.x);
      array.push(p.y);
    }
    canvas.drawPoints(this.canvaskit.PointMode.Polygon, array, this.paint);
  };

  isPointIn: (point: Vector2) => boolean = (point) => {
    return isPointInShape(this.points, point);
  };
}
