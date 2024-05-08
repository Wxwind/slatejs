export class Point {
  x = 0;
  y = 0;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Creates a clone of this point
   * @returns A clone of this point
   */
  clone(): Point {
    return new Point(this.x, this.y);
  }

  /**
   * Copies `x` and `y` from the given point into this point
   * @param p - The point to copy from
   * @returns The point instance itself
   */
  copyFrom(p: Point): this {
    this.set(p.x, p.y);

    return this;
  }

  copyTo(p: Point): Point {
    p.set(this.x, this.y);

    return p;
  }

  equals(p: Point): boolean {
    return p.x === this.x && p.y === this.y;
  }

  set(x = 0, y = x): this {
    this.x = x;
    this.y = y;

    return this;
  }
}

export function pointToSegment(x: number, y: number, x1: number, y1: number, x2: number, y2: number): number {
  const cross = (x2 - x1) * (x - x1) + (y2 - y1) * (y - y1);
  if (cross <= 0) return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));

  const d2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (cross >= d2) return Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2));

  const r = cross / d2;
  const px = x1 + (x2 - x1) * r;
  const py = y1 + (y2 - y1) * r;
  return Math.sqrt((x - px) * (x - px) + (y - py) * (y - py));
}
