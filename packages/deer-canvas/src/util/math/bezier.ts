import { Keyframe, isInWeightEnabled, isOutWeightEnabled } from 'deer-engine';

// https://stackoverflow.com/questions/2587751/an-algorithm-to-find-bounding-box-of-closed-bezier-curves
const sqrt = Math.sqrt,
  min = Math.min,
  max = Math.max,
  abs = Math.abs;

function getBoundsOfCurve(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
) {
  const tvalues = [];
  const bounds: number[][] = [[], []];
  const points = [];

  let a, b, c, t, t1, t2, b2ac, sqrtb2ac;
  for (let i = 0; i < 2; ++i) {
    if (i == 0) {
      b = 6 * x0 - 12 * x1 + 6 * x2;
      a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
      c = 3 * x1 - 3 * x0;
    } else {
      b = 6 * y0 - 12 * y1 + 6 * y2;
      a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
      c = 3 * y1 - 3 * y0;
    }

    if (abs(a) < 1e-12) {
      // Numerical robustness
      if (abs(b) < 1e-12) {
        // Numerical robustness
        continue;
      }
      t = -c / b;
      if (0 < t && t < 1) {
        tvalues.push(t);
      }
      continue;
    }
    b2ac = b * b - 4 * c * a;
    sqrtb2ac = sqrt(b2ac);
    if (b2ac < 0) {
      continue;
    }
    t1 = (-b + sqrtb2ac) / (2 * a);
    if (0 < t1 && t1 < 1) {
      tvalues.push(t1);
    }
    t2 = (-b - sqrtb2ac) / (2 * a);
    if (0 < t2 && t2 < 1) {
      tvalues.push(t2);
    }
  }

  let x,
    y,
    j = tvalues.length,
    mt;
  const jlen = j;

  while (j--) {
    t = tvalues[j];
    mt = 1 - t;
    x = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
    bounds[0][j] = x;

    y = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
    bounds[1][j] = y;
    points[j] = {
      X: x,
      Y: y,
    };
  }

  tvalues[jlen] = 0;
  tvalues[jlen + 1] = 1;
  points[jlen] = {
    X: x0,
    Y: y0,
  };
  points[jlen + 1] = {
    X: x3,
    Y: y3,
  };
  bounds[0][jlen] = x0;
  bounds[1][jlen] = y0;
  bounds[0][jlen + 1] = x3;
  bounds[1][jlen + 1] = y3;
  tvalues.length = bounds[0].length = bounds[1].length = points.length = jlen + 2;

  return {
    left: min(...bounds[0]),
    top: min(...bounds[1]),
    right: max(...bounds[0]),
    bottom: max(...bounds[1]),
    points: points, // local extremes
    tvalues: tvalues, // t values of local extremes
  };
}

export function getBoundsOfCurveByKeys(keys: Keyframe[]) {
  let minx = Infinity,
    miny = Infinity,
    maxx = 0,
    maxy = 0;

  for (let i = 0; i < keys.length - 1; i++) {
    const p0 = keys[i];
    const p3 = keys[i + 1];

    let prevWeight = 0;
    if (isOutWeightEnabled(p0)) {
      prevWeight = p0.outWeight;
    } else {
      const x = p3.time - p0.time;
      const y = x * p0.outTangent;
      prevWeight = (Math.sqrt(x * x + y * y) * 1) / 3;
    }
    const angle1 = Math.atan(p0.outTangent);
    const p1x = Math.cos(angle1) * prevWeight + p0.time;
    const p1y = Math.sin(angle1) * prevWeight + p0.value;

    let nextWeight = 0;
    if (isInWeightEnabled(p3)) {
      nextWeight = p3.inWeight;
    } else {
      const x = p3.time - p0.time;
      const y = x * p3.inTangent;
      nextWeight = (Math.sqrt(x * x + y * y) * 1) / 3;
    }
    const angle2 = Math.atan(p3.inTangent);
    const p2x = p3.time - Math.cos(angle2) * nextWeight;
    const p2y = p3.value - Math.sin(angle2) * nextWeight;

    const { left, right, top, bottom } = getBoundsOfCurve(p0.time, p0.value, p1x, p1y, p2x, p2y, p3.time, p3.value);

    if (left < minx) minx = left;
    if (right > maxx) maxx = right;
    if (top > maxy) maxy = top;
    if (bottom < miny) miny = bottom;
  }

  return { minx, maxx, miny, maxy };
}
