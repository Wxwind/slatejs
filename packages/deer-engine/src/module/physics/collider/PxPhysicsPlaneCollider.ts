import PhysX from 'physx-js-webidl';
import { PxPhysicsCollider } from './PxPhysicsCollider';
import { PxPhysics } from '../PxPhysics';
import { PxPhysicsMaterial } from '../PxPhysicsMaterial';
import { IPlaneCollider } from '@/core/physics/interface';

export class PxPhysicsPlaneCollider extends PxPhysicsCollider implements IPlaneCollider {
  _pxGeometry: PhysX.PxPlaneGeometry;

  constructor(pxPhysics: PxPhysics, material: PxPhysicsMaterial) {
    super(pxPhysics);
    const geo = new this._px.PxPlaneGeometry();
    this._pxGeometry = geo;
    this._initialize(material);
  }
}
