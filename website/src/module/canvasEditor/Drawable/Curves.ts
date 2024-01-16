import { Canvas, CanvasKit, Paint } from 'canvaskit-wasm';
import { AnimationCurve } from 'deer-engine';
import { IDrawable } from '../IDrawable';

export class Curves implements IDrawable {
  curves: AnimationCurve[] = [];
  unitWidth = 16; // pixels per unit

  coordPaint: Paint;

  constructor(private canvaskit: CanvasKit) {
    const paint = new canvaskit.Paint();
    const color = canvaskit.Color(255, 0, 0, 1);

    paint.setColor(color);
    paint.setStyle(canvaskit.PaintStyle.Stroke);
    this.coordPaint = paint;
  }

  draw: (canvas: Canvas) => void = (canvas) => {
    this.drawCoordinateSystem(canvas);
    this.drawBezierCurve(canvas);
  };

  drawCoordinateSystem = (canvas: Canvas) => {
    const Path = this.canvaskit.Path;
    const XYWHRect = this.canvaskit.XYWHRect;

    const lineNum = 10;
    const yLineNum = 10;
    const rectSize = 10;

    const rectsPath = new Path();
    for (let i = 0; i < lineNum + 1; i++) {
      // 循环遍历绘制方格
      for (let j = 0; j < yLineNum + 1; j++) {
        if (i % 2 === 0 && j % 2 === 0) {
          const rect = XYWHRect(rectSize * i, rectSize * j, rectSize, rectSize);
          rectsPath.addRect(rect);
        }

        if (i % 2 === 1 && j % 2 === 1) {
          const rect = XYWHRect(rectSize * i, rectSize * j, rectSize, rectSize);
          rectsPath.addRect(rect);
        }
      }
    }

    canvas.drawPath(rectsPath, this.coordPaint);
  };

  drawBezierCurve = (canvas: Canvas) => {
    canvas.drawLine(10, 20, 200, 230, this.coordPaint);
    canvas.drawCircle(100, 100, 50, this.coordPaint);
  };
}
