import { Canvas, Paint } from 'canvaskit-wasm';
import { AnimationCurve } from 'deer-engine';
import { DrawableObject } from '../DrawableObject';
import { Vector2 } from '../util';
import { CanvasRenderingContext } from '../interface';

export class CoordinateSystem extends DrawableObject {
  curves: AnimationCurve[] = [];
  unitWidth = 32; // pixels per unit

  coordPaint: Paint;

  constructor(private context: CanvasRenderingContext) {
    super();
    const { canvaskit } = context;
    const paint = new canvaskit.Paint();
    const color = canvaskit.Color(80, 80, 80, 1);

    paint.setColor(color);
    paint.setStyle(canvaskit.PaintStyle.Stroke);
    this.coordPaint = paint;

    // set left bottom point is (0,0)
    const transform = this.transform;
    transform.translate(0, this.context.viewSizeInfo.height - 0.1);
    transform.rotate(Math.PI);
    transform.scale(-1, 1);

    transform.scale(this.unitWidth, this.unitWidth);
  }

  isPointHit: (point: Vector2) => boolean = () => true;

  _render: (canvas: Canvas) => void = (canvas) => {
    this.drawCoordinateSystem(canvas);
  };

  drawCoordinateSystem = (canvas: Canvas) => {
    const { canvaskit } = this.context;
    const Path = canvaskit.Path;
    const XYWHRect = canvaskit.XYWHRect;

    const rectSize = this.unitWidth;
    const lineNum = Math.ceil(400 / rectSize);
    const yLineNum = Math.ceil(400 / rectSize);

    const rectsPath = new Path();
    for (let i = 0; i < lineNum + 1; i++) {
      // 循环遍历绘制方格
      for (let j = 0; j < yLineNum + 1; j++) {
        const rect = XYWHRect(i, j, 1, 1);
        rectsPath.addRect(rect);
      }
    }

    canvas.drawPath(rectsPath, this.coordPaint);
  };

  drawRuler = (canvas: Canvas) => {
    const {} = this.context;
  };
}
