import { Canvas, CanvasKit, Paint } from 'canvaskit-wasm';
import { AnimationCurve, Keyframe, isInWeightEnabled, isNotWeighted, isOutWeightEnabled } from 'deer-engine';
import { DrawableObject } from '../../DrawableObject';
import { Vector2 } from '../../util';
import { Handle } from './Handle';
import { CanvasRenderingContext } from '../../interface';

export class Curves extends DrawableObject {
  curves: AnimationCurve[];

  curvePaint: Paint;

  constructor(
    private context: CanvasRenderingContext,
    curves: AnimationCurve[]
  ) {
    const { canvaskit } = context;
    super();
    const paint = new canvaskit.Paint();
    const color = canvaskit.Color(80, 80, 80, 1);

    paint.setColor(color);
    paint.setStyle(canvaskit.PaintStyle.Stroke);
    this.curvePaint = paint;
    this.curves = curves;

    for (const curve of curves) {
      for (let j = 0; j < curve.keys.length; j += 1) {
        const handle = this.createHandle(context, curve, curve.keys[j]);
        this.addChild(handle);
      }
    }
  }

  createHandle = (context: CanvasRenderingContext, curve: AnimationCurve, key: Keyframe) => {
    const handle = new Handle(context, {
      center: {
        x: key.time,
        y: key.value,
      },
      radius: 0.2,
    });

    handle.setDragMoveHandler((pos) => {
      const index = curve.keys.findIndex((a) => a === key);
      key.time = pos.x;
      key.value = pos.y;
      curve.moveKey(index, key);
      handle.setOptions({ center: pos });
    });

    return handle;
  };

  isPointHit: (point: Vector2) => boolean = () => false;

  _render: (canvas: Canvas) => void = (canvas) => {
    this.drawBezierCurve(canvas);
  };

  private drawBezierCurve = (canvas: Canvas) => {
    const curves = this.curves;

    for (let i = 0; i < curves.length; i++) {
      const curve = curves[i];
      if (curve.keys.length === 0) continue;
      const path = new this.context.canvaskit.Path();
      const key0 = curve.keys[0];
      path.moveTo(key0.time, key0.value);
      const keys = curve.keys;
      for (let j = 1; j < curve.keys.length; j++) {
        const prevKey = keys[j - 1];
        const nowKey = keys[j];

        // not weighted curve
        if (isNotWeighted(prevKey, nowKey)) {
          const dt = nowKey.time - prevKey.time;
          const oneThird = 1 / 3;

          const p1x = prevKey.time + oneThird * dt;
          const p2x = nowKey.time - oneThird * dt;
          const p1y = prevKey.value + prevKey.outTangent * dt * oneThird;
          const p2y = nowKey.value - nowKey.inTangent * dt * oneThird;

          path.cubicTo(p1x, p1y, p2x, p2y, nowKey.time, nowKey.value);
        }
        // weighted curve
        else {
          const getp1p2 = (key1: Keyframe, key2: Keyframe) => {
            const t1 = key1.time;
            const t2 = key2.time;
            const dt = t2 - t1;
            const oneThird = 1 / 3;

            let prevWeight = 0;
            if (isOutWeightEnabled(key1)) {
              prevWeight = key1.outWeight;
            } else {
              const x = dt;
              const y = x * key1.outTangent;
              prevWeight = Math.sqrt(x * x + y * y) * oneThird;
            }
            const angle1 = Math.atan(key1.outTangent);
            const tx1 = Math.cos(angle1) * prevWeight + t1;
            const ty1 = Math.sin(angle1) * prevWeight + key1.value;

            let nextWeight = 0;
            if (isInWeightEnabled(key2)) {
              nextWeight = key2.inWeight;
            } else {
              const x = dt;
              const y = x * key2.inTangent;
              nextWeight = Math.sqrt(x * x + y * y) * oneThird;
            }
            const angle2 = Math.atan(key2.inTangent);
            const tx2 = t2 - Math.cos(angle2) * nextWeight;
            const ty2 = key2.value - Math.sin(angle2) * nextWeight;
            return [tx1, ty1, tx2, ty2];
          };

          const [p1x, p1y, p2x, p2y] = getp1p2(prevKey, nowKey);

          path.cubicTo(p1x, p1y, p2x, p2y, nowKey.time, nowKey.value);
        }
        canvas.drawPath(path, this.curvePaint);
      }
    }
  };
}
