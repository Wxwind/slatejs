import { DisplayObject } from '@/core';
import { StyleRenderer } from './interface';
import { Curve } from '@/drawable';
import { AnimationCurve, isInWeightEnabled, isNotWeighted, isOutWeightEnabled, Keyframe } from 'deer-engine';

export class CurveRenderer implements StyleRenderer {
  render = (object: DisplayObject, ctx: CanvasRenderingContext2D) => {
    const { curve } = (object as Curve).style;
    this.drawBezierCurve(curve, ctx);
  };

  private drawBezierCurve = (curve: AnimationCurve, ctx: CanvasRenderingContext2D) => {
    if (curve.keys.length === 0) return;
    ctx.beginPath();
    const key0 = curve.keys[0];
    ctx.moveTo(key0.time, key0.value);
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

        ctx.bezierCurveTo(p1x, p1y, p2x, p2y, nowKey.time, nowKey.value);
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

        ctx.bezierCurveTo(p1x, p1y, p2x, p2y, nowKey.time, nowKey.value);
      }
      ctx.closePath();
    }
  };
}
