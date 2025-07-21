/* eslint-disable @typescript-eslint/no-namespace */
import { Vector3 } from 'three';
import { FVector3, MathUtils } from './math';

export interface IVector2 {
  x: number;
  y: number;
}

export namespace IVector2 {
  export function scale(a: IVector2, b: number, out: IVector2) {
    out.x = a.x * b;
    out.y = a.y * b;
    return out;
  }

  export function scaleVector(a: IVector2, b: IVector2, out: IVector2) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    return out;
  }
}

export interface IVector3 {
  x: number;
  y: number;
  z: number;
}

export namespace IVector3 {
  export function add<T extends IVector3 = IVector3>(a: T, b: IVector3, out: T) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;
    return out;
  }

  export function sub<T extends IVector3 = IVector3>(a: T, b: IVector3, out: T) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    return out;
  }

  export function scale<T extends IVector3 = IVector3>(a: T, b: number, out: T) {
    out.x = a.x * b;
    out.y = a.y * b;
    out.z = a.z * b;
    return out;
  }

  export function scaleVector<T extends IVector3 = IVector3>(a: T, b: IVector3, out: T) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    return out;
  }

  export function clamp<T extends IVector3 = IVector3>(src: T, min: number, max: number) {
    src.x = MathUtils.clamp(src.x, min, max);
    src.y = MathUtils.clamp(src.y, min, max);
    src.z = MathUtils.clamp(src.z, min, max);
    return src;
  }

  export function clampVector3<T extends IVector3 = IVector3>(src: T, clampMinMax: IVector3, out: T) {
    out.x = MathUtils.clamp(src.x, -clampMinMax.x, clampMinMax.x);
    out.y = MathUtils.clamp(src.y, -clampMinMax.y, clampMinMax.y);
    out.z = MathUtils.clamp(src.z, -clampMinMax.z, clampMinMax.z);
    return out;
  }

  export function copy<T extends IVector3 = IVector3>(out: T, src: IVector3): T {
    out.x = src.x;
    out.y = src.y;
    out.z = src.z;
    return out;
  }

  export function lerp<T extends IVector3 = IVector3>(out: T, start: IVector3, end: IVector3, t: number): T {
    out.x = MathUtils.lerp(start.x, end.x, t);
    out.y = MathUtils.lerp(start.y, end.y, t);
    out.z = MathUtils.lerp(start.z, end.z, t);
    return out;
  }

  // https://github.com/Unity-Technologies/UnityCsReference/blob/master/Runtime/Export/Math/Vector3.cs#L97
  export function smoothDamp<T extends IVector3 = IVector3>(
    out: T,
    current: T,
    target: T,
    currentVelocity: T,
    smoothTime: number,
    maxSpeed: number,
    deltaTime: number
  ): T {
    let output_x = 0;
    let output_y = 0;
    let output_z = 0;

    // Based on Game Programming Gems 4 Chapter 1.10
    smoothTime = Math.max(0.0001, smoothTime);
    const omega = 2 / smoothTime;

    const x = omega * deltaTime;
    const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);

    let change_x = current.x - target.x;
    let change_y = current.y - target.y;
    let change_z = current.z - target.z;
    const originalTo = target;

    // Clamp maximum speed
    const maxChange = maxSpeed * smoothTime;

    const maxChangeSq = maxChange * maxChange;
    const sqrmag = change_x * change_x + change_y * change_y + change_z * change_z;
    if (sqrmag > maxChangeSq) {
      const mag = Math.sqrt(sqrmag);
      change_x = (change_x / mag) * maxChange;
      change_y = (change_y / mag) * maxChange;
      change_z = (change_z / mag) * maxChange;
    }

    target.x = current.x - change_x;
    target.y = current.y - change_y;
    target.z = current.z - change_z;

    const temp_x = (currentVelocity.x + omega * change_x) * deltaTime;
    const temp_y = (currentVelocity.y + omega * change_y) * deltaTime;
    const temp_z = (currentVelocity.z + omega * change_z) * deltaTime;

    currentVelocity.x = (currentVelocity.x - omega * temp_x) * exp;
    currentVelocity.y = (currentVelocity.y - omega * temp_y) * exp;
    currentVelocity.z = (currentVelocity.z - omega * temp_z) * exp;

    output_x = target.x + (change_x + temp_x) * exp;
    output_y = target.y + (change_y + temp_y) * exp;
    output_z = target.z + (change_z + temp_z) * exp;

    // Prevent overshooting
    const origMinusCurrent_x = originalTo.x - current.x;
    const origMinusCurrent_y = originalTo.y - current.y;
    const origMinusCurrent_z = originalTo.z - current.z;
    const outMinusOrig_x = output_x - originalTo.x;
    const outMinusOrig_y = output_y - originalTo.y;
    const outMinusOrig_z = output_z - originalTo.z;

    if (
      origMinusCurrent_x * outMinusOrig_x + origMinusCurrent_y * outMinusOrig_y + origMinusCurrent_z * outMinusOrig_z >
      0
    ) {
      output_x = originalTo.x;
      output_y = originalTo.y;
      output_z = originalTo.z;

      currentVelocity.x = (output_x - originalTo.x) / deltaTime;
      currentVelocity.y = (output_y - originalTo.y) / deltaTime;
      currentVelocity.z = (output_z - originalTo.z) / deltaTime;
    }

    out.x = output_x;
    out.y = output_y;
    out.z = output_z;
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
