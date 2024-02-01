import { Canvas, CanvasKit, Paint } from 'canvaskit-wasm';
import { DrawableObject } from '../DrawableObject';
import { Vector2, distance2 } from '../util';

export interface CircleOptions {
  center: Vector2;
  radius: number;
}

export class Circle extends DrawableObject {
  paint: Paint;

  center: Vector2;
  radius: number;

  constructor(protected canvaskit: CanvasKit, options: CircleOptions) {
    super();
    const paint = new canvaskit.Paint();
    const color = canvaskit.Color(255, 0, 0, 1);

    paint.setColor(color);
    paint.setStyle(canvaskit.PaintStyle.Stroke);
    this.paint = paint;

    this.center = options.center;
    this.radius = options.radius;
  }

  setOptions(options: Partial<CircleOptions>) {
    this.center = options.center ?? this.center;
    this.radius = options.radius ?? this.radius;
  }

  isPointHit: (point: Vector2) => boolean = (point) => {
    return distance2(point, this.center) <= this.radius * this.radius;
  };

  drawFrame: (canvas: Canvas) => void = (canvas) => {
    canvas.drawCircle(this.center.x, this.center.y, this.radius, this.paint);
  };
}
