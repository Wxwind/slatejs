import PhysX from 'physx-js-webidl';

import { IVector3 } from '@/type';
import { PxPhysics } from '../PxPhysics';
import { PxPhysicsMaterial } from '../PxPhysicsMaterial';
import { toPxVec3 } from '../utils';
import { PxPhysicsCollider } from './PxPhysicsCollider';
import { Vector3 } from 'three';
import { IBoxCollider } from '@/core/physics/interface';

export class PxPhysicsBoxCollider extends PxPhysicsCollider implements IBoxCollider {
  _pxGeometry: PhysX.PxBoxGeometry;

  _halfSize: Vector3;
  _scaleAbs = new Vector3(1, 1, 1);

  private _tempVec3 = new Vector3();
  private _tempPxVec3: PhysX.PxVec3;

  constructor(pxPhysics: PxPhysics, size: IVector3, material: PxPhysicsMaterial) {
    super(pxPhysics);
    const halfSize = new Vector3(size.x / 2, size.y / 2, size.z / 2);
    const geo = new this._px.PxBoxGeometry(halfSize.x, halfSize.y, halfSize.z);
    this._pxGeometry = geo;
    this._initialize(material);
    this._halfSize = halfSize;
    this._tempPxVec3 = new pxPhysics._physX.PxVec3();
  }

  setSize(value: IVector3) {
    this._halfSize.set(value.x / 2, value.y / 2, value.z / 2);

    const vec3 = this._tempVec3.multiplyVectors(this._halfSize, this._worldScale);
    const pxVec3 = toPxVec3(vec3, this._tempPxVec3);
    this._pxGeometry.halfExtents = pxVec3;
    this._pxShape.setGeometry(this._pxGeometry);
  }

  override setWorldScale(scale: IVector3): void {
    super.setWorldScale(scale);
    this._scaleAbs.set(Math.abs(scale.x), Math.abs(scale.y), Math.abs(scale.z));
    const vec3 = this._tempVec3.multiplyVectors(this._halfSize, this._worldScale);
    const pxVec3 = toPxVec3(vec3, this._tempPxVec3);
    this._pxGeometry.halfExtents = pxVec3;
    this._pxShape.setGeometry(this._pxGeometry);
  }
}
