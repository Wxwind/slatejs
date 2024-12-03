import { egclass, property } from '@/core';
import { IClone, ICopyFrom, IVector3 } from '@/type';

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
}
