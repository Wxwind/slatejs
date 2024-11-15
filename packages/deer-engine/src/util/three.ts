import { Matrix4, Object3D, Quaternion, Vector3 } from 'three';

export function objectToLocalPosition(obj: Object3D, worldPos: Vector3) {
  if (!obj.parent) return worldPos;
  const local = obj.parent.worldToLocal(worldPos);
  return local;
}

export function objectToLocalQuaternion(obj: Object3D, worldRot: Quaternion) {
  if (!obj.parent) return worldRot;
  const rot = new Matrix4();
  rot.makeRotationFromQuaternion(worldRot);
  const local = rot.multiply(obj.parent.matrixWorld);
  const quaternion = new Quaternion().setFromRotationMatrix(local);
  return quaternion;
}
