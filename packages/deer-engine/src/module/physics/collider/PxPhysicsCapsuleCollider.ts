import PhysX from 'physx-js-webidl';
import { Quaternion, Vector3 } from 'three';
import { IVector3 } from '@/type';
import { ICapsuleCollider } from '@/core/physics/interface';
import { PxPhysics } from '../PxPhysics';
import { PxPhysicsMaterial } from '../PxPhysicsMaterial';
import { HALF_SQRT, PxPhysicsCollider } from './PxPhysicsCollider';

enum ColliderUpAxis {
  X,
  Y,
  Z,
}

export class PxPhysicsCapsuleCollider extends PxPhysicsCollider implements ICapsuleCollider {
  _pxGeometry: PhysX.PxCapsuleGeometry;
  _radius: number;
  _halfHeight: number;

  _scaleAbs = new Vector3(1, 1, 1);
  private _upAxis: ColliderUpAxis = ColliderUpAxis.Y;

  constructor(pxPhysics: PxPhysics, radius: number, height: number, material: PxPhysicsMaterial) {
    super(pxPhysics);
    this._radius = radius;
    this._halfHeight = height / 2;
    const geo = new this._px.PxCapsuleGeometry(radius, height / 2);
    this._pxGeometry = geo;
    this._initialize(material);
    this.setUpAxis(this._upAxis);
    this._setLocalPose();
  }

  setRadius(radius: number) {
    this._radius = radius;
    const scaleAbs = this._scaleAbs;
    switch (this._upAxis) {
      case ColliderUpAxis.X:
        this._pxGeometry.radius = radius * Math.max(scaleAbs.y, scaleAbs.z);
        break;
      case ColliderUpAxis.Y:
        this._pxGeometry.radius = radius * Math.max(scaleAbs.x, scaleAbs.z);
        break;
      case ColliderUpAxis.Z:
        this._pxGeometry.radius = radius * Math.max(scaleAbs.x, scaleAbs.y);
        break;
    }

    this._pxShape.setGeometry(this._pxGeometry);
  }

  setHeight(height: number) {
    this._halfHeight = height / 2;
    const scaleAbs = this._scaleAbs;
    switch (this._upAxis) {
      case ColliderUpAxis.X:
        this._pxGeometry.halfHeight = this._halfHeight * scaleAbs.x;
        break;
      case ColliderUpAxis.Y:
        this._pxGeometry.halfHeight = this._halfHeight * scaleAbs.y;
        break;
      case ColliderUpAxis.Z:
        this._pxGeometry.halfHeight = this._halfHeight * scaleAbs.z;
        break;
    }
    this._pxShape.setGeometry(this._pxGeometry);
  }

  override setWorldScale(scale: IVector3): void {
    super.setWorldScale(scale);
    this._scaleAbs.set(Math.abs(scale.x), Math.abs(scale.y), Math.abs(scale.z));

    this.setHeight(this._halfHeight * 2);
    this.setRadius(this._radius);
    this._pxShape.setGeometry(this._pxGeometry);
  }

  setUpAxis(upAxis: ColliderUpAxis) {
    this._upAxis = upAxis;

    const newAxis = new Quaternion();

    switch (this._upAxis) {
      // 0, 0, 0
      case ColliderUpAxis.X:
        newAxis.set(0, 0, 0, 1);
        break;
      // 0, 0, 90
      case ColliderUpAxis.Y:
        newAxis.set(0, 0, HALF_SQRT, HALF_SQRT);
        break;
      //0, -90, 0,
      case ColliderUpAxis.Z:
        newAxis.set(0, -HALF_SQRT, 0, HALF_SQRT);
        break;
    }
    this.setAxis(newAxis);
  }
}
