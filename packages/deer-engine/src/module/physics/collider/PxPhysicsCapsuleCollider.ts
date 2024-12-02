import PhysX from 'physx-js-webidl';
import { PxPhysicsCollider } from './PxPhysicsCollider';
import { PxPhysics } from '../PxPhysics';
import { PxPhysicsMaterial } from '../PxPhysicsMaterial';
import { ICapsuleCollider } from '@/core/physics/interface';

export class PxPhysicsCapsuleCollider extends PxPhysicsCollider implements ICapsuleCollider {
  _pxGeometry: PhysX.PxCapsuleGeometry;
  _radius: number;
  _halfHeight: number;

  constructor(pxPhysics: PxPhysics, radius: number, height: number, material: PxPhysicsMaterial) {
    super(pxPhysics);
    this._radius = radius;
    this._halfHeight = height / 2;
    const geo = new this._px.PxCapsuleGeometry(radius, height / 2);
    this._pxGeometry = geo;
    this._initialize(material);
  }

  setRadius(radius: number) {
    this._radius = radius;
    this._pxGeometry.radius = radius;
    this._pxShape.setGeometry(this._pxGeometry);
  }

  setHeight(height: number) {
    this._halfHeight = height / 2;
    this._pxGeometry.halfHeight = height / 2;
    this._pxShape.setGeometry(this._pxGeometry);
  }
}
