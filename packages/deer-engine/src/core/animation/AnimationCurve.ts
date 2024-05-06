/* eslint-disable prefer-const */
import { isNearlyZero, lerp } from '@/util';
import {
  InterpMode,
  Keyframe,
  TangentMode,
  WeightMode,
  isInWeightEnabled,
  isNotWeighted,
  isOutWeightEnabled,
} from './Keyframe';
import { solveCubic } from './soleveCubic';
import { egclass, property } from '../data';
import { Signal } from '@/packages/signal';

export enum AnimationCurveExtrapolation {
  Linaer = 'Linaer',
  Constant = 'Constant',
  Repeat = 'Repeat',
  RepeatWithOffset = 'RepeatWithOffset',
  PingPong = 'PingPong',
}

export type AnimationCurveJson = {
  type: 'AnimationCurve';
  keys: {
    time: number;
    value: number;
    inTangent: number;
    outTangent: number;
    inWeight: number;
    outWeight: number;
    tangentMode: TangentMode;
    weightMode: WeightMode;
    interpMode: InterpMode;
  }[];
  preExtrapolation: AnimationCurveExtrapolation;
  postExtrapolation: AnimationCurveExtrapolation;
};

@egclass()
export class AnimationCurve {
  @property({ type: [Keyframe] })
  keys: Keyframe[];
  @property({ type: String })
  preExtrapolation: AnimationCurveExtrapolation;
  @property({ type: String })
  postExtrapolation: AnimationCurveExtrapolation;

  signals = {
    curveChanged: new Signal(),
  };

  public get length() {
    return this.keys.length;
  }

  constructor() {
    this.keys = [];
    this.preExtrapolation = AnimationCurveExtrapolation.Constant;
    this.postExtrapolation = AnimationCurveExtrapolation.Constant;
  }

  toJSON(): AnimationCurveJson {
    return {
      type: 'AnimationCurve',
      keys: this.keys,
      preExtrapolation: this.preExtrapolation,
      postExtrapolation: this.postExtrapolation,
    };
  }

  static fromJSON = (json: AnimationCurveJson) => {
    const curve = new AnimationCurve();
    curve.keys.push(...json.keys);
    curve.postExtrapolation = json.postExtrapolation;
    curve.preExtrapolation = json.preExtrapolation;
    return curve;
  };

  addKey = (keyframe: Keyframe) => {
    let index: number = 0;
    for (; index < this.keys.length && keyframe.time > this.keys[index].time; index++);
    this.keys.splice(index, 0, keyframe);
    this.signals.curveChanged.emit();
    return index;
  };

  getKey = (index: number) => {
    return this.keys[index];
  };

  /** remove key at index, then add key into keys and sort them. */
  moveKey = (index: number, key: Keyframe) => {
    this.keys.splice(index, 1);
    this.addKey(key);
    this.signals.curveChanged.emit();
  };

  removeKey = (index: number) => {
    this.keys.splice(index, 1);
    this.signals.curveChanged.emit();
  };

  setKeyTangentMode = (index: number, mode: TangentMode) => {
    this.keys[index].tangentMode === mode;
  };

  evaluate: (time: number) => number = (time) => {
    const offset0 = 0;
    const [inTime, offset] = this.RemapTimeValue(time, offset0);

    let val = 0;
    const keyLength = this.length;
    if (keyLength === 0) {
      val = 0;
    } else if (keyLength < 2 || inTime < this.keys[0].time) {
      // PreExtrap
      if (keyLength > 1 && this.preExtrapolation === AnimationCurveExtrapolation.Linaer) {
        const dt = this.keys[1].time - this.keys[0].time;
        if (isNearlyZero(dt)) {
          val = this.keys[0].value;
        } else {
          const dx = this.keys[1].value - this.keys[0].value;
          val = (dx / dt) * (inTime - this.keys[0].time) + this.keys[0].value;
        }
      } else {
        // if preInfinityExtrap is not linear or only one key, just use first key
        val = this.keys[0].value;
      }
    } else if (inTime <= this.keys[keyLength - 1].time) {
      // find a lower bound key
      let left = 1; // in case time == keys[0].time which will return 0.
      let right = this.keys.length - 1;
      while (left <= right) {
        const middle = (right + left) >> 1;
        if (this.keys[middle].time >= inTime) {
          right = middle - 1;
        } else {
          left = middle + 1;
        }
      }

      val = this.evalTwoKeys(this.keys[left - 1], this.keys[left], inTime);
    } else {
      // PostExtrap
      if (this.postExtrapolation === AnimationCurveExtrapolation.Linaer) {
        const dt = this.keys[keyLength - 1].time - this.keys[keyLength - 2].time;
        if (isNearlyZero(dt)) {
          val = this.keys[keyLength - 1].value;
        } else {
          const dx = this.keys[keyLength - 1].value - this.keys[keyLength - 2].value;
          val = (dx / dt) * (inTime - this.keys[keyLength - 1].time) + this.keys[keyLength - 1].value;
        }
      } else {
        val = this.keys[keyLength - 1].value;
      }
    }
    return val + offset;
  };

  private RemapTimeValue: (time: number, offset: number) => [time: number, offset: number] = (time, offset) => {
    const keyLength = this.length;
    if (keyLength < 2) {
      return [time, offset];
    }

    if (
      this.preExtrapolation === AnimationCurveExtrapolation.Linaer ||
      this.preExtrapolation === AnimationCurveExtrapolation.Constant
    ) {
      return [time, offset];
    }

    const firstKey = this.keys[0];
    const lastKey = this.keys[keyLength - 1];

    const minTime = firstKey.time;
    const maxTime = lastKey.time;

    if (time < this.keys[0].time) {
      let [newTime, repeatCount] = repeatTime(minTime, maxTime, time);

      if (this.preExtrapolation === AnimationCurveExtrapolation.Repeat) {
        return [newTime, offset];
      }

      if (this.preExtrapolation === AnimationCurveExtrapolation.RepeatWithOffset) {
        const dv = lastKey.value - firstKey.value;
        offset = dv * repeatCount;
        return [newTime, offset];
      }

      if (this.preExtrapolation === AnimationCurveExtrapolation.PingPong) {
        if (repeatCount % 2 === 1) {
          newTime = minTime + (maxTime - newTime);
          return [newTime, offset];
        }
      }
    } else if (time > lastKey.time) {
      let [newTime, repeatCount] = repeatTime(minTime, maxTime, time);

      if (this.preExtrapolation === AnimationCurveExtrapolation.Repeat) {
        return [newTime, offset];
      }

      if (this.preExtrapolation === AnimationCurveExtrapolation.RepeatWithOffset) {
        const dv = lastKey.value - firstKey.value;
        offset = -dv * repeatCount;
        return [newTime, offset];
      }

      if (this.preExtrapolation === AnimationCurveExtrapolation.PingPong) {
        if (repeatCount % 2 === 1) {
          newTime = minTime + (maxTime - newTime);
          return [newTime, offset];
        }
      }
    }

    return [time, offset];
  };

  private evalTwoKeys: (key1: Keyframe, key2: Keyframe, time: number) => number = (key1, key2, time) => {
    const dt = key2.time - key1.time;

    if (isNearlyZero(dt)) {
      return key1.value;
    }

    switch (key1.interpMode) {
      case InterpMode.Constant: {
        return key1.value;
      }

      case InterpMode.Linaer: {
        const t = (time - key1.time) / dt;
        const p0 = key1.value;
        const p3 = key2.value;
        return lerp(p0, p3, t);
      }

      case InterpMode.Cubic: {
        const t = (time - key1.time) / dt;
        const p0 = key1.value;
        const p3 = key2.value;

        // use hermite curve if not weighted.
        if (isNotWeighted(key1, key2)) {
          // Hermite to Beizer
          // p0 = q0
          // p1 = q0 + u0 / 3
          // p2 = q1 - u1 / 3
          // p3 = q1
          // where: u0 = f(q0)' = key1.outTangent, u1 = f(q1)' = key2.inTangent
          // ps: we (unreal / cocos) use t directly as x which hermite(t) = (x,y)
          // they are equivalent.
          // @see: https://math.stackexchange.com/questions/4128882/nonparametric-hermite-cubic-to-bezier-curve
          // @see: https://www.desmos.com/calculator/meiiosqvvt
          const oneThird = 1 / 3;
          // p1 = (key1.time + dt * oneThird, key1.value + key1.outTangent * dt * oneThird)
          const p1 = p0 + key1.outTangent * dt * oneThird;
          // p2 = (key2.time - dt * oneThird, key2.value - key2.outTangent * dt * oneThird)
          const p2 = p3 - key2.inTangent * dt * oneThird;

          return bezierInterp(p0, p1, p2, p3, t);
        }

        // Bezier
        return this.weightedEvalForTwoKeys(key1, key2, time);
      }
    }
  };

  private weightedEvalForTwoKeys: (key1: Keyframe, key2: Keyframe, time: number) => number = (key1, key2, time) => {
    const t1 = key1.time;
    const t2 = key2.time;
    const dt = t2 - t1;
    const t = (time - t1) / dt;
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

    const dx = dt;

    // Calculator Bezier
    // Reference: https://github.com/cocos/cocos-engine/blob/v3.8.2/cocos/core/curves/curve.ts

    // Normalize values
    const u1x = (tx1 - t1) / dx;
    const u2x = (tx2 - t1) / dx;
    const u1y = ty1;
    const u2y = ty2;

    // Convert Bernstein to Power bias.
    // Beizer represented by matrix:
    // [1, t, t^2, t^3] * [1, 0, 0, 0; -3, 3, 0, 0; 3, -6, 3, 0; -1, 3, -3, 1] * Transpose( [p_0，p_1，p_2，p_3] )
    // --------------------------------------
    // | Basis | Coeff
    // | t^0   |     p_0
    // | t^1   | -3* p_0 + 3 * p_1
    // | t^2   | 3 * p_0 - 6 * p_1 + 3 * p_2
    // | t^3   | -   p_0 + 3 * p_1 - 3 * p_2 + p_3
    // --------------------------------------
    // where: p_0 = 0, p_1 = u1x, p_2 = u2x, p_3 = 1
    const coeff0 = 0;
    const coeff1 = 3 * u1x;
    const coeff2 = 3 * u2x - 6 * u1x;
    const coeff3 = 3 * (u1x - u2x) + 1;

    const solutions: [number, number, number] = [0, 0, 0];
    // get the t of besizer value which cubic(t).x = t
    const NumRes = solveCubic(coeff0 - t, coeff1, coeff2, coeff3, solutions);
    let param = t;
    if (NumRes === 1) {
      param = solutions[0];
    } else {
      param = -Infinity;
      for (const res of solutions) {
        if (res >= 0.0 && res <= 1.0) {
          if (res > param) {
            param = res;
          }
        }
      }

      if (param === -Infinity) {
        param = 0.0;
      }
    }

    return bezierInterp(key1.value, u1y, u2y, key2.value, param);
  };
}

export const bezierInterp: (p0: number, p1: number, p2: number, p3: number, t: number) => number = (
  p0,
  p1,
  p2,
  p3,
  t
) => {
  const u = 1 - t;
  const coeff0 = u * u * u;
  const coeff1 = 3 * u * u * t;
  const coeff2 = 3 * u * t * t;
  const coeff3 = t * t * t;
  return coeff0 * p0 + coeff1 * p1 + coeff2 * p2 + coeff3 * p3;
};

export const repeatTime: (minTime: number, maxTime: number, time: number) => [newTime: number, repeatCount: number] = (
  minTime,
  maxTime,
  time
) => {
  const originalTime = time;
  let repeatCount = 0;

  const duration = maxTime - minTime;

  if (time > maxTime) {
    repeatCount = Math.floor((time - maxTime) / duration);
    time = time - repeatCount * duration;
  } else if (originalTime < minTime) {
    repeatCount = Math.floor((minTime - time) / duration);
    time = time + repeatCount * duration;
  }

  if (originalTime < minTime && time == maxTime) {
    time = minTime;
  } else if (originalTime > maxTime && time == minTime) {
    time = maxTime;
  }

  return [time, repeatCount];
};
