import { Object3D, Quaternion, Vector3 } from 'three';

export function objectToLocalPosition(obj: Object3D, worldPos: Vector3) {
  if (!obj.parent) return worldPos;
  // obj.parent.updateWorldMatrix(true, false);
  const local = obj.parent.worldToLocal(worldPos);
  return local;
}

export function objectToLocalQuaternion(obj: Object3D, worldQuaternion: Quaternion) {
  const parent = obj.parent;
  const localQuaternion = new Quaternion();

  if (parent) {
    //  parent.updateWorldMatrix(true, false);
    const parentQuaternion = new Quaternion().setFromRotationMatrix(parent.matrixWorld);
    // localQuaternion = parentQuaternion ^ -1 * worldQuaternion
    localQuaternion.copy(parentQuaternion.invert()).multiply(worldQuaternion);
  } else {
    localQuaternion.copy(worldQuaternion);
  }

  return localQuaternion;
}
