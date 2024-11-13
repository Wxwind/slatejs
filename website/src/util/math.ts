import { IVector2, IVector3 } from 'deer-engine';

export function toScaledVec3(newValue: IVector3, oldValue: IVector3): IVector3 {
  let factor = 1;
  if (newValue.x !== oldValue.x) {
    oldValue.x !== 0 && (factor = newValue.x / oldValue.x);
  } else if (newValue.y !== oldValue.y) {
    oldValue.y !== 0 && (factor = newValue.y / oldValue.y);
  } else if (newValue.z !== oldValue.z) {
    oldValue.z !== 0 && (factor = newValue.z / oldValue.z);
  }

  return {
    x: oldValue.x * factor,
    y: oldValue.y * factor,
    z: oldValue.z * factor,
  };
}

export function toScaledVec2(newValue: IVector2, oldValue: IVector2): IVector2 {
  let factor = 1;
  if (newValue.x !== oldValue.x) {
    oldValue.x !== 0 && (factor = newValue.x / oldValue.x);
  } else if (newValue.y !== oldValue.y) {
    oldValue.y !== 0 && (factor = newValue.y / oldValue.y);
  }

  return {
    x: oldValue.x * factor,
    y: oldValue.y * factor,
  };
}
