/* eslint-disable @typescript-eslint/no-namespace */
import { MathUtil } from './util';

export interface IVector2 {
  x: number;
  y: number;
}

export namespace IVector2 {
  export function scale(a: IVector2, b: number, out: IVector2) {
    out.x = a.x * b;
    out.y = a.y * b;
  }

  export function scaleVector(a: IVector2, b: IVector2, out: IVector2) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
  }
}

export interface IVector3 {
  x: number;
  y: number;
  z: number;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IVector3 {
  export function scale<T extends IVector3 = IVector3>(a: T, b: number, out: T) {
    out.x = a.x * b;
    out.y = a.y * b;
    out.z = a.z * b;
    return out;
  }

  export function scaleVector<T extends IVector3 = IVector3>(a: T, b: T, out: T) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    return out;
  }

  export function clamp<T extends IVector3 = IVector3>(src: T, min: number, max: number) {
    src.x = MathUtil.clamp(src.x, min, max);
    src.y = MathUtil.clamp(src.y, min, max);
    src.z = MathUtil.clamp(src.z, min, max);
    return src;
  }

  export function clampVector3<T extends IVector3 = IVector3>(src: T, clampMinMax: T, out: T) {
    out.x = MathUtil.clamp(src.x, -clampMinMax.x, clampMinMax.x);
    out.y = MathUtil.clamp(src.y, -clampMinMax.y, clampMinMax.y);
    out.z = MathUtil.clamp(src.z, -clampMinMax.z, clampMinMax.z);
    return out;
  }
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
