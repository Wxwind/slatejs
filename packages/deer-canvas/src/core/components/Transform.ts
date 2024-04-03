import { mat4, quat, vec2, vec3 } from 'gl-matrix';
import { DisplayObject } from '../DisplayObject';
import { createVec3, isNil } from '@/util';

export class Transform {
  /** Local Space */
  private localMatrix = mat4.create();
  private localPosition = vec3.create();
  private localRotation = quat.create();
  private localScale = vec3.fromValues(1, 1, 1);

  /** World Space */
  private worldMatrix = mat4.create();
  private worldMatrixInverse = mat4.create();
  private worldPosition = vec3.create();
  private worldRotation = quat.create();
  private worldScale = vec3.create();

  dirtyFlag = false;
  localDirtyFlag = false;

  constructor(private owner: DisplayObject) {}

  /** sync self */
  private syncMatrix = () => {
    if (this.localDirtyFlag) {
      mat4.fromRotationTranslationScale(this.localMatrix, this.localRotation, this.localPosition, this.localScale);
      this.localDirtyFlag = false;
    }
    if (this.dirtyFlag) {
      const parent = this.owner.parent as DisplayObject | undefined;
      if (isNil(parent)) {
        mat4.copy(this.worldMatrix, this.localMatrix);
      } else {
        mat4.multiply(this.worldMatrix, parent.transform.worldMatrix, this.localMatrix);
      }
      mat4.invert(this.worldMatrixInverse, this.worldMatrix);

      mat4.getTranslation(this.worldPosition, this.worldMatrix);
      mat4.getRotation(this.worldRotation, this.worldMatrix);
      mat4.getScaling(this.worldScale, this.worldMatrix);
      this.dirtyFlag = false;
    }
  };

  /** sync self and children */
  syncRecursive = () => {
    this.syncMatrix();
    for (const child of this.owner.children) {
      child.transform.syncRecursive();
    }
  };

  private syncFromParentsToChildren = (updateParents: boolean, updateChildren: boolean) => {
    if (updateParents) {
      const parent = this.owner.parent as DisplayObject | undefined;
      if (!isNil(parent)) {
        parent.transform.syncFromParentsToChildren(true, false);
      }
    }

    this.syncMatrix();

    if (updateChildren) {
      for (const child of this.owner.children) {
        child.transform.syncFromParentsToChildren(false, true);
      }
    }
  };

  /** local to parent */
  getLocalTransform = () => {
    return this.localMatrix;
  };

  /** local to world */
  getWorldTransform = () => {
    this.syncFromParentsToChildren(true, false);
    return this.worldMatrix;
  };

  /** world to local */
  getWorldTransformInverse = () => {
    this.syncFromParentsToChildren(true, false);
    return this.worldMatrixInverse;
  };

  getPosition: () => vec3 = () => {
    this.syncFromParentsToChildren(true, false);
    return this.worldPosition;
  };

  setPosition: (pos: vec3) => void = (pos) => {
    this.syncFromParentsToChildren(true, false);
    if (vec3.equals(this.worldPosition, pos)) return;
    vec3.copy(this.worldPosition, pos);

    const parent = this.owner.parent as DisplayObject | undefined;
    if (isNil(parent)) {
      vec3.copy(this.localPosition, pos);
    } else {
      vec3.transformMat4(this.localPosition, pos, parent.transform.getWorldTransformInverse());
    }

    this.dirtifyLocal();
    return this;
  };

  getRotation: () => quat = () => {
    this.syncFromParentsToChildren(true, false);

    return this.worldRotation;
  };

  setRotation: (q: quat) => void = (q) => {
    this.syncFromParentsToChildren(true, false);

    const parent = this.owner.parent as DisplayObject | undefined;
    if (isNil(parent)) {
      quat.copy(this.localRotation, q);
    } else {
      const parentQuat = parent.transform.worldRotation;
      const parentQuatInverse = quat.invert(quat.create(), parentQuat);
      quat.multiply(this.localRotation, parentQuatInverse, q);
      quat.normalize(this.localRotation, this.localRotation);
    }

    this.dirtifyLocal();
    return this;
  };

  getScale: () => vec3 = () => {
    this.syncFromParentsToChildren(true, false);
    return this.worldScale;
  };

  getLocalPosition: () => vec3 = () => {
    return this.localPosition;
  };

  setLocalPosition: (pos: vec3 | vec2) => void = (pos) => {
    const p = createVec3(pos);
    if (vec3.equals(this.localPosition, p)) return;
    this.localPosition = p;

    this.dirtifyLocal();
    return this;
  };

  getLocalRotation: () => quat = () => {
    return this.localRotation;
  };

  setLocalRotition: (q: quat) => void = (q) => {
    this.localRotation = q;

    this.dirtifyLocal();
    return this;
  };

  getLocalScale: () => vec3 = () => {
    return this.localScale;
  };

  /**
   * Apply scale
   */
  setLocalScale(sx: number, sy: number, sz = this.localScale[2]) {
    const scale = vec3.fromValues(sx, sy, sz);
    if (vec3.equals(scale, this.localScale)) return this;

    vec3.copy(this.localScale, scale);

    this.dirtifyLocal();
    return this;
  }

  /**
   * Apply translation to world position
   */
  translate = (() => {
    const tmpVec3 = vec3.create();
    const tmpPos = vec3.create();

    return (x: number, y: number) => {
      if (x === 0 && y === 0) return this;
      const move = vec3.set(tmpVec3, x, y, 0);
      vec3.add(tmpPos, this.getPosition(), move);
      this.setPosition(tmpPos);
      this.dirtifyLocal();
      return this;
    };
  })();

  /** localMatrix will be recomposed in next frame */
  dirtifyLocal = () => {
    this.localDirtyFlag = true;
    if (!this.dirtyFlag) {
      this.dirtyWorld();
    }
  };

  /** matrix will be recomposed in next frame, and notify children / parents this has been updated */
  dirtyWorld = () => {
    this.dirtyFlag = true;

    dirtifySelfAndDescendant(this.owner);
    dirtifyAncestorBounds(this.owner);
  };

  toFloat32Array() {
    const m = this.worldMatrix;
    return Float32Array.of(m[0], m[2], m[12], m[1], m[3], m[13], 0, 0, 1);
  }
}

const dirtifySelfAndDescendant = (object: DisplayObject) => {
  const { transform, renderable } = object;
  transform.dirtyFlag = true;
  renderable.dirty = true;
  object.children.forEach((child) => {
    dirtifySelfAndDescendant(child);
  });
};

const dirtifyAncestorBounds = (object: DisplayObject) => {
  object.renderable.dirty = true;
  let p = object;
  while (p) {
    p.renderable.boundsDirty = true;
    p = p.parent as DisplayObject;
  }
};
