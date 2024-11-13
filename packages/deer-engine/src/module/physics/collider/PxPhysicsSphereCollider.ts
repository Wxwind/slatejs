import PhysX from 'physx-js-webidl';
import { PxPhysicsCollider } from './PxPhysicsCollider';
import { PxPhysics } from '../PxPhysics';
import { PxPhysicsMaterial } from '../PxPhysicsMaterial';

export class PxPhysicsSphereCollider extends PxPhysicsCollider {
  _pxGeometry: PhysX.PxSphereGeometry;

  constructor(pxPhysics: PxPhysics, radius: number, material: PxPhysicsMaterial) {
    super(pxPhysics);
    const geo = new this._px.PxSphereGeometry(radius);
    this._pxGeometry = geo;
    this._initialize(material);
  }

  setRadius(radius: number) {
    this._pxGeometry.radius = radius;
  }
}
