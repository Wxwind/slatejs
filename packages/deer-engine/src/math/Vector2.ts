import { egclass, IClone, ICopyFrom, IVector2, property } from '..';

@egclass()
export class FVector2 implements IClone<FVector2>, ICopyFrom<IVector2, FVector2> {
  @property({ type: Number })
  x: number = 0;
  @property({ type: Number })
  y: number = 0;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x = 0, y = 0): FVector2 {
    this.x = x;
    this.y = y;
    return this;
  }

  clone(): FVector2 {
    return new FVector2(this.x, this.y);
  }

  copyFrom(from: IVector2): FVector2 {
    this.x = from.x;
    this.y = from.y;
    return this;
  }
}
