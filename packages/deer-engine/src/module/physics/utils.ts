import { IVector3 } from '@/type';
import PhysX from 'physx-js-webidl';
import { Quaternion } from 'three';

export function toPxVec3(src: IVector3, out: PhysX.PxVec3) {
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

export function toPxTransform(position: IVector3, rotation: Quaternion) {
  const _tempTransform = new window.PhysX.PxTransform();
  toPxVec3(position, _tempTransform.p);
  toPxQuat(rotation, _tempTransform.q);
  return _tempTransform;
}
