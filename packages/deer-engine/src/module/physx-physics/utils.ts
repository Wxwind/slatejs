import { IVector3 } from '@/type';
import PhysX from 'physx-js-webidl';
import { Quaternion } from 'three';

export function toPxVec3(src: IVector3, out: PhysX.PxVec3) {
  out.x = src.x;
  out.y = src.y;
  out.z = src.z;
  return out;
}

export function toPxExtendVec3(src: IVector3, out: PhysX.PxExtendedVec3) {
  out.x = src.x;
  out.y = src.y;
  out.z = src.z;
  return out;
}

export function toPxQuat(src: Quaternion, out: PhysX.PxQuat) {
  out.x = src.x;
  out.y = src.y;
  out.z = src.z;
  out.w = src.w;
  return out;
}

export function toPxTransform(position: IVector3, rotation: Quaternion, out: PhysX.PxTransform) {
  toPxVec3(position, out.p);
  toPxQuat(rotation, out.q);
  return out;
}

export function fromPxVec3Like(value: PhysX.PxVec3 | PhysX.PxExtendedVec3, out: IVector3): IVector3 {
  out.x = value.x;
  out.y = value.y;
  out.z = value.z;
  return out;
}
