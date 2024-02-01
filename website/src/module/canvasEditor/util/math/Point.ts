export class Point {
  public x = 0;
  public y = 0;

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
