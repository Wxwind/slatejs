import { Canvas, Paint } from 'canvaskit-wasm';
import { AnimationCurve } from 'deer-engine';
import { DisplayObject } from '../core/DisplayObject';
import { Vector2 } from '../util';
import { CanvasContext } from '../interface';
import { ContextSystem } from '../systems';
import { CanvasKitContext } from '../plugins/plugin-canvaskit/interface';

export class CoordinateSystem extends DisplayObject {
  curves: AnimationCurve[] = [];
  unitWidth = 32; // pixels per unit

  coordPaint: Paint;

  constructor(private context: CanvasContext) {
    super();
    const { CanvasKit } = (this.context.contextSystem as ContextSystem<CanvasKitContext>).getContext();
    const paint = new CanvasKit.Paint();
    const color = CanvasKit.Color(80, 80, 80, 1);

    paint.setColor(color);
    paint.setStyle(CanvasKit.PaintStyle.Stroke);
    this.coordPaint = paint;

    // set left bottom point is (0,0)
    const transform = this.transform;
    transform.translate(0, this.context.contextSystem.getCanvasElement().height || 400 - 0.1);
    transform.rotate(Math.PI);
    transform.scaleTo(-1, 1);

    transform.scaleTo(this.unitWidth, this.unitWidth);
  }

  isPointHit: (point: Vector2) => boolean = () => true;

  _render: (canvas: Canvas) => void = (canvas) => {
    this.drawCoordinateSystem(canvas);
  };

  drawCoordinateSystem = (canvas: Canvas) => {
    const { CanvasKit } = (this.context.contextSystem as ContextSystem<CanvasKitContext>).getContext();
    const Path = CanvasKit.Path;
    const XYWHRect = CanvasKit.XYWHRect;

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
