import { Canvas, CanvasKit, Paint } from 'canvaskit-wasm';
import { AnimationCurve, Keyframe } from 'deer-engine';
import { DrawableObject } from '../DrawableObject';
import { Vector2 } from '../types';
import { CoordinateSystem } from './CoordinateSystem';
import { Circle } from './Circle';

export class Curves extends DrawableObject {
  curves: AnimationCurve[];
  unitWidth = 32; // pixels per unit

  curvePaint: Paint;

  coord: CoordinateSystem;

  constructor(private canvaskit: CanvasKit, curves: AnimationCurve[]) {
    super();
    const paint = new canvaskit.Paint();
    const color = canvaskit.Color(80, 80, 80, 1);

    paint.setColor(color);
    paint.setStyle(canvaskit.PaintStyle.Stroke);
    this.curvePaint = paint;
    this.coord = new CoordinateSystem(canvaskit);
    this.curves = curves;
  }

  isPointIn: (point: Vector2) => boolean = () => false;

  draw: (canvas: Canvas) => void = (canvas) => {
    this.coord.draw(canvas);
    this.drawBezierCurve(canvas);
  };

  private drawBezierCurve = (canvas: Canvas) => {
    const curves = this.curves;
    for (let i = 0; i < curves.length; i++) {
      const curve = curves[i];
      for (let j = 0; j < curve.keys.length; j++) {
        const key = curve.keys[j];
        this.drawHandle(canvas, key);
      }
    }
    canvas.drawLine(10, 20, 200, 230, this.curvePaint);
  };

  private drawHandle = (canvas: Canvas, key: Keyframe) => {
    const handle = new Circle(this.canvaskit, {
      center: {
        x: key.time,
        y: key.value,
      },
      radius: 10,
    });
  };
}
