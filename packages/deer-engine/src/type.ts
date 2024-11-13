export interface IVector2 {
  x: number;
  y: number;
}

export interface IVector3 {
  x: number;
  y: number;
  z: number;
}

export interface IVector4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface IClone<T> {
  clone(): T;
}

export interface ICopyFrom<S, T> {
  copyFrom(from: S): T;
}
