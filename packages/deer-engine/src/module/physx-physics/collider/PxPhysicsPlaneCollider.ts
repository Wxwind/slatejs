import PhysX from 'physx-js-webidl';
import { HALF_SQRT, PxPhysicsCollider } from './PxPhysicsCollider';
import { PxPhysics } from '../PxPhysics';
import { PxPhysicsMaterial } from '../PxPhysicsMaterial';
import { IPlaneCollider } from '@/core/physics/interface';
import { Quaternion } from 'three';

export class PxPhysicsPlaneCollider extends PxPhysicsCollider implements IPlaneCollider {
  _pxGeometry: PhysX.PxPlaneGeometry;

  constructor(pxPhysics: PxPhysics, id: number, material: PxPhysicsMaterial) {
    super(pxPhysics, id);
    const geo = new this._px.PxPlaneGeometry();
    this._pxGeometry = geo;
    this.setAxis(new Quaternion(0, 0, HALF_SQRT, HALF_SQRT));
    this._initialize(material);
  }
}
