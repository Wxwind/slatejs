import { Canvas, Paint } from 'canvaskit-wasm';
import { DisplayObject } from '../DisplayObject';
import { Vector2, distance2 } from '../util';
import { CanvasContext } from '../interface';
import { CanvasKitContext } from '../plugins/plugin-canvaskit/interface';
import { ContextSystem } from '../systems';

export interface CircleOptions {
  center: Vector2;
  radius: number;
}

export class Circle extends DisplayObject {
  paint: Paint;

  center: Vector2 = { x: 0, y: 0 };
  radius = 1;

  constructor(protected context: CanvasContext) {
    super();
    const { CanvasKit } = (this.context.contextSystem as ContextSystem<CanvasKitContext>).getContext();
    const paint = new CanvasKit.Paint();
    const color = CanvasKit.Color(255, 0, 0, 1);

    paint.setColor(color);
    paint.setStyle(CanvasKit.PaintStyle.Stroke);
    this.paint = paint;

    // this.center = options.center;
    // this.radius = options.radius;
  }

  setOptions(options: Partial<CircleOptions>) {
    this.center = options.center ?? this.center;
    this.radius = options.radius ?? this.radius;
  }

  isPointHit: (point: Vector2) => boolean = (point) => {
    const localP = this.toLocal(point);
    return distance2(localP, this.center) <= this.radius * this.radius;
  };

  _render: (canvas: Canvas) => void = (canvas) => {
    canvas.drawCircle(this.center.x, this.center.y, this.radius, this.paint);
  };
}
