import { egclass, IClone, ICopyFrom, IVector4, property } from '..';

@egclass()
export class FVector4 implements IClone<FVector4>, ICopyFrom<IVector4, FVector4> {
  @property({ type: Number })
  x: number = 0;
  @property({ type: Number })
  y: number = 0;
  @property({ type: Number })
  z: number = 0;
  @property({ type: Number })
  w: number = 0;

  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  set(x = 0, y = 0, z = 0, w = 1): FVector4 {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  clone(): FVector4 {
    return new FVector4(this.x, this.y, this.z, this.w);
  }

  copyFrom(from: IVector4): FVector4 {
    this.x = from.x;
    this.y = from.y;
    this.z = from.z;
    this.w = from.w;
    return this;
  }
}
