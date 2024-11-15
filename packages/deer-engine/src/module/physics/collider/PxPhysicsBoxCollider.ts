import PhysX from 'physx-js-webidl';
import { PxPhysicsCollider } from './PxPhysicsCollider';
import { PxPhysics } from '../PxPhysics';
import { Vector3 } from 'three';
import { PxPhysicsMaterial } from '../PxPhysicsMaterial';
import { IVector3 } from '@/type';

export class PxPhysicsBoxCollider extends PxPhysicsCollider {
  _pxGeometry: PhysX.PxBoxGeometry;

  _halfSize: Vector3;

  constructor(pxPhysics: PxPhysics, size: IVector3, material: PxPhysicsMaterial) {
    super(pxPhysics);
    const halfSize = new Vector3(size.x / 2, size.y / 2, size.z / 2);
    const geo = new this._px.PxBoxGeometry(halfSize.x, halfSize.y, halfSize.z);
    this._pxGeometry = geo;
    this._initialize(material);
    this._halfSize = halfSize;
  }

  setSize(value: IVector3) {
    this._halfSize.set(value.x / 2, value.y / 2, value.z / 2);
    this._pxGeometry.halfExtents = new this._px.PxVec3(value.x / 2, value.y / 2, value.z / 2);
    this._pxShape.setGeometry(this._pxGeometry);
  }
}
