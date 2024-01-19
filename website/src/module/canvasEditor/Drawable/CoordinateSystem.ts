import { Canvas, CanvasKit, Paint } from 'canvaskit-wasm';
import { AnimationCurve } from 'deer-engine';
import { DrawableObject } from '../DrawableObject';
import { Vector2 } from '../types';

export class CoordinateSystem extends DrawableObject {
  curves: AnimationCurve[] = [];
  unitWidth = 32; // pixels per unit

  coordPaint: Paint;

  protected children: DrawableObject[] = [];

  addChild = (drawable: DrawableObject) => {
    this.children.push(drawable);
  };

  removeChild = (drawable: DrawableObject) => {
    const index = this.children.findIndex((a) => a === drawable);
    if (index === -1) {
      console.warn('drawable is not exit');
      return;
    }

    this.children.splice(index, 1);
  };

  constructor(private canvaskit: CanvasKit) {
    super();
    const paint = new canvaskit.Paint();
    const color = canvaskit.Color(80, 80, 80, 1);

    paint.setColor(color);
    paint.setStyle(canvaskit.PaintStyle.Stroke);
    this.coordPaint = paint;
  }

  isPointIn: (point: Vector2) => boolean = () => true;

  draw: (canvas: Canvas) => void = (canvas) => {
    this.drawCoordinateSystem(canvas);

    this.children.forEach((c) => {
      c.draw(canvas);
    });
  };

  drawCoordinateSystem = (canvas: Canvas) => {
    const Path = this.canvaskit.Path;
    const XYWHRect = this.canvaskit.XYWHRect;

    const rectSize = this.unitWidth;
    const lineNum = Math.ceil(320 / rectSize);
    const yLineNum = Math.ceil(320 / rectSize);

    const rectsPath = new Path();
    for (let i = 0; i < lineNum + 1; i++) {
      // 循环遍历绘制方格
      for (let j = 0; j < yLineNum + 1; j++) {
        const rect = XYWHRect(rectSize * i, rectSize * j, rectSize, rectSize);
        rectsPath.addRect(rect);
      }
    }

    canvas.drawPath(rectsPath, this.coordPaint);
  };
}
