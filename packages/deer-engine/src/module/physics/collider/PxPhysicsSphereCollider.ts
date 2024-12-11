import PhysX from 'physx-js-webidl';
import { IVector3 } from '@/type';
import { PxPhysics } from '../PxPhysics';
import { PxPhysicsMaterial } from '../PxPhysicsMaterial';
import { PxPhysicsCollider } from './PxPhysicsCollider';
import { ISphereCollider } from '@/core/physics/interface';

export class PxPhysicsSphereCollider extends PxPhysicsCollider implements ISphereCollider {
  _pxGeometry: PhysX.PxSphereGeometry;
  _maxScale: number = 1;
  _radius: number;

  constructor(pxPhysics: PxPhysics, radius: number, material: PxPhysicsMaterial) {
    super(pxPhysics);
    this._radius = radius;
    const geo = new this._px.PxSphereGeometry(radius);
    this._pxGeometry = geo;
    this._initialize(material);
  }

  setRadius(radius: number) {
    this._radius = radius;
    this._pxGeometry.radius = radius * this._maxScale;
    this._pxShape.setGeometry(this._pxGeometry);
  }

  override setWorldScale(scale: IVector3): void {
    super.setWorldScale(scale);
    this._maxScale = Math.max(Math.abs(scale.x), Math.abs(scale.y), Math.abs(scale.z));

    this._pxGeometry.radius = this._radius * this._maxScale;
    this._pxShape.setGeometry(this._pxGeometry);
  }
}
