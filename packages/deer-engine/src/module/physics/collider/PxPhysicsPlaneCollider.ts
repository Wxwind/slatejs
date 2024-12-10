import PhysX from 'physx-js-webidl';
import { PxPhysicsCollider } from './PxPhysicsCollider';
import { PxPhysics } from '../PxPhysics';
import { PxPhysicsMaterial } from '../PxPhysicsMaterial';

export class PxPhysicsPlaneCollider extends PxPhysicsCollider {
  _pxGeometry: PhysX.PxPlaneGeometry;

  constructor(pxPhysics: PxPhysics, material: PxPhysicsMaterial) {
    super(pxPhysics);
    const geo = new this._px.PxPlaneGeometry();
    this._pxGeometry = geo;
    this._initialize(material);
  }
}
