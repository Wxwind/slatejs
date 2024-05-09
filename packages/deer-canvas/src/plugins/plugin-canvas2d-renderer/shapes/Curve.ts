import { DisplayObject } from '@/core';
import { StyleRenderer } from './interface';
import { Curve } from '@/drawable';
import {
  AnimationCurve,
  InterpMode,
  isInWeightEnabled,
  isNotWeighted,
  isOutWeightEnabled,
  Keyframe,
} from 'deer-engine';
import { isNil } from '@/util';
import { CanvasContext } from '@/interface';

export class CurveRenderer implements StyleRenderer {
  render = (ctx: CanvasRenderingContext2D, object: DisplayObject, context: CanvasContext) => {
    const { curve } = object as Curve;
    this.drawBezierCurve(curve, ctx, context);
  };

  private drawBezierCurve = (
    curve: AnimationCurve | undefined,
    ctx: CanvasRenderingContext2D,
    context: CanvasContext
  ) => {
    if (isNil(curve)) return;
    if (curve.keys.length === 0) return;
    const canvas = context.renderingContext.root.ownerCanvas;

    ctx.beginPath();
    const key0 = curve.keys[0];
    const a = canvas.canvas2Viewport({ x: key0.time, y: key0.value });
    ctx.moveTo(a.x, a.y);
    const keys = curve.keys;
    for (let j = 1; j < curve.keys.length; j++) {
      const prevKey = keys[j - 1];
      const nowKey = keys[j];

      switch (prevKey.interpMode) {
        case InterpMode.Constant: {
          const a = canvas.canvas2Viewport({ x: nowKey.time, y: prevKey.value });
          ctx.lineTo(a.x, a.y);
          const b = canvas.canvas2Viewport({ x: nowKey.time, y: nowKey.value });
          ctx.lineTo(b.x, b.y);
          break;
        }
        case InterpMode.Linaer: {
          const a = canvas.canvas2Viewport({ x: nowKey.time, y: nowKey.value });
          ctx.lineTo(a.x, a.y);
          break;
        }
        case InterpMode.Cubic: {
          // not weighted curve
          if (isNotWeighted(prevKey, nowKey)) {
            const dt = nowKey.time - prevKey.time;
            const oneThird = 1 / 3;

            const p1x = prevKey.time + oneThird * dt;
            const p2x = nowKey.time - oneThird * dt;
            const p1y = prevKey.value + prevKey.outTangent * dt * oneThird;
            const p2y = nowKey.value - nowKey.inTangent * dt * oneThird;

            const p1 = canvas.canvas2Viewport({ x: p1x, y: p1y });
            const p2 = canvas.canvas2Viewport({ x: p2x, y: p2y });
            const a = canvas.canvas2Viewport({ x: nowKey.time, y: nowKey.value });
            ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, a.x, a.y);
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

            const p1 = canvas.canvas2Viewport({ x: p1x, y: p1y });
            const p2 = canvas.canvas2Viewport({ x: p2x, y: p2y });
            const a = canvas.canvas2Viewport({ x: nowKey.time, y: nowKey.value });
            ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, a.x, a.y);
          }
          break;
        }
      }

      ctx.stroke();
    }
  };
}
