export type Vector2 = {
  x: number;
  y: number;
};

export function isPointInShape(shape: Vector2[], point: Vector2): boolean {
  const x = point.x;
  const y = point.y;
  const n = shape.length;
  let res = false;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const p1 = shape[j];
    const p2 = shape[i];

    // assume line's direction is up to +y
    const x_ok = p1.x > x !== p2.x > x;

    // (y - y1) / (y2 - y1) = (pos_x - x1) / (x2 - x1)
    // y = (pos_x - x1) * (y2 - y1) / (x2 - x1) + y1
    const k = (p2.y - p1.y) / (p2.x - p1.x);
    const tempY = (x - p1.x) * k + p1.y;
    const y_ok = tempY > y;
    if (x_ok && y_ok) {
      res = !res;
    }
  }

  return res;
}

export function length(v: Vector2) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function distance(v1: Vector2, v2: Vector2) {
  const dx = v2.x - v1.x;
  const dy = v2.y - v1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
