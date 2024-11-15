import { egclass, property } from '@/core';
import { IClone, ICopyFrom, IVector3 } from '@/type';
import { clamp } from '@/util';

@egclass()
export class FVector3 implements IClone<FVector3>, ICopyFrom<IVector3, FVector3> {
  @property({ type: Number })
  x: number = 0;
  @property({ type: Number })
  y: number = 0;
  @property({ type: Number })
  z: number = 0;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x = 0, y = 0, z = 0): FVector3 {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  clone(): FVector3 {
    return new FVector3(this.x, this.y, this.z);
  }

  copyFrom(from: IVector3): FVector3 {
    this.x = from.x;
    this.y = from.y;
    this.z = from.z;
    return this;
  }

  static scale<T extends IVector3 = IVector3>(a: T, b: number, out: T) {
    out.x = a.x * b;
    out.y = a.y * b;
    out.z = a.z * b;
    return out;
  }

  static scaleVector<T extends IVector3 = IVector3>(a: T, b: T, out: T) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    return out;
  }

  static clamp<T extends IVector3 = IVector3>(src: T, min: number, max: number) {
    src.x = clamp(src.x, min, max);
    src.y = clamp(src.y, min, max);
    src.z = clamp(src.z, min, max);
    return src;
  }

  static clampVector3<T extends IVector3 = IVector3>(src: T, clampMinMax: T, out: T) {
    out.x = clamp(src.x, -clampMinMax.x, clampMinMax.x);
    out.y = clamp(src.y, -clampMinMax.y, clampMinMax.y);
    out.z = clamp(src.z, -clampMinMax.z, clampMinMax.z);
    return out;
  }
}
