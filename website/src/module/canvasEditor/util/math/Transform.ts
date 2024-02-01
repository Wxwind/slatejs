import { Vector2 } from './Vector2';
import { getRotation } from './util';

export class Transform {
  /**
   * [ m[0], m[1], m[4] ]
   * [ m[2], m[3], m[5] ]
   * [ 0   , 0   , 1    ]
   */
  m: [number, number, number, number, number, number];

  constructor(m: [number, number, number, number, number, number] = [1, 0, 0, 1, 0, 0]) {
    this.m = m;
  }

  reset() {
    this.m[0] = 1;
    this.m[1] = 0;
    this.m[2] = 0;
    this.m[3] = 1;
    this.m[4] = 0;
    this.m[5] = 0;
  }

  /**
   * Copy Konva.Transform object
   */
  copy() {
    return new Transform(this.m);
  }

  copyInto(tr: Transform) {
    tr.m[0] = this.m[0];
    tr.m[1] = this.m[1];
    tr.m[2] = this.m[2];
    tr.m[3] = this.m[3];
    tr.m[4] = this.m[4];
    tr.m[5] = this.m[5];
  }

  /**
   * Transform point
   */
  point(point: Vector2) {
    var m = this.m;
    return {
      x: m[0] * point.x + m[2] * point.y + m[4],
      y: m[1] * point.x + m[3] * point.y + m[5],
    };
  }

  /**
   * Apply translation
   */
  translate(x: number, y: number) {
    this.m[4] += this.m[0] * x + this.m[2] * y;
    this.m[5] += this.m[1] * x + this.m[3] * y;
    return this;
  }

  /**
   * Apply scale
   */
  scale(sx: number, sy: number) {
    this.m[0] *= sx;
    this.m[1] *= sx;
    this.m[2] *= sy;
    this.m[3] *= sy;
    return this;
  }

  /**
   * Apply rotation
   */
  rotate(rad: number) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var m11 = this.m[0] * c + this.m[2] * s;
    var m12 = this.m[1] * c + this.m[3] * s;
    var m21 = this.m[0] * -s + this.m[2] * c;
    var m22 = this.m[1] * -s + this.m[3] * c;
    this.m[0] = m11;
    this.m[1] = m12;
    this.m[2] = m21;
    this.m[3] = m22;
    return this;
  }

  /**
   * Returns the translation
   */
  getTranslation() {
    return {
      x: this.m[4],
      y: this.m[5],
    };
  }

  /**
   * Apply skew
   */
  skew(sx: number, sy: number) {
    var m11 = this.m[0] + this.m[2] * sy;
    var m12 = this.m[1] + this.m[3] * sy;
    var m21 = this.m[2] + this.m[0] * sx;
    var m22 = this.m[3] + this.m[1] * sx;
    this.m[0] = m11;
    this.m[1] = m12;
    this.m[2] = m21;
    this.m[3] = m22;
    return this;
  }

  /**
   * Transform multiplication
   */
  multiply(matrix: Transform) {
    var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
    var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];

    var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
    var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];

    var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
    var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];

    this.m[0] = m11;
    this.m[1] = m12;
    this.m[2] = m21;
    this.m[3] = m22;
    this.m[4] = dx;
    this.m[5] = dy;
    return this;
  }

  /**
   * Invert the matrix
   */
  invert() {
    var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
    var m0 = this.m[3] * d;
    var m1 = -this.m[1] * d;
    var m2 = -this.m[2] * d;
    var m3 = this.m[0] * d;
    var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
    var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
    this.m[0] = m0;
    this.m[1] = m1;
    this.m[2] = m2;
    this.m[3] = m3;
    this.m[4] = m4;
    this.m[5] = m5;
    return this;
  }

  /**
   * return matrix
   */
  getMatrix() {
    return this.m;
  }

  /**
   * convert transformation matrix back into node's attributes
   */
  decompose() {
    var a = this.m[0];
    var b = this.m[1];
    var c = this.m[2];
    var d = this.m[3];
    var e = this.m[4];
    var f = this.m[5];

    var delta = a * d - b * c;

    let result = {
      x: e,
      y: f,
      rotation: 0,
      scaleX: 0,
      scaleY: 0,
      skewX: 0,
      skewY: 0,
    };

    // Apply the QR-like decomposition.
    if (a != 0 || b != 0) {
      var r = Math.sqrt(a * a + b * b);
      result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
      result.scaleX = r;
      result.scaleY = delta / r;
      result.skewX = (a * c + b * d) / delta;
      result.skewY = 0;
    } else if (c != 0 || d != 0) {
      var s = Math.sqrt(c * c + d * d);
      result.rotation = Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
      result.scaleX = delta / s;
      result.scaleY = s;
      result.skewX = 0;
      result.skewY = (a * c + b * d) / delta;
    } else {
      // a = b = c = d = 0
    }

    result.rotation = getRotation(result.rotation);

    return result;
  }
}
