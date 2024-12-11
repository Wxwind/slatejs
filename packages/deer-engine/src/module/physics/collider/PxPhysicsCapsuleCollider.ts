import PhysX from 'physx-js-webidl';

import { IVector3 } from '@/type';
import { PxPhysics } from '../PxPhysics';
import { PxPhysicsMaterial } from '../PxPhysicsMaterial';
import { HALF_SQRT, PxPhysicsCollider } from './PxPhysicsCollider';
import { Quaternion, Vector3 } from 'three';
import { ICapsuleCollider } from '@/core/physics/interface';

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
  _axis: Quaternion = new Quaternion(0, 0, HALF_SQRT, HALF_SQRT);

  constructor(pxPhysics: PxPhysics, radius: number, height: number, material: PxPhysicsMaterial) {
    super(pxPhysics);
    this._radius = radius;
    this._halfHeight = height / 2;
    const geo = new this._px.PxCapsuleGeometry(radius, height / 2);
    this._pxGeometry = geo;
    this._rotation.copy(this._axis);
    this._initialize(material);
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
    const { _axis: axis, _rotation: rotation } = this;
    this._upAxis = upAxis;

    switch (this._upAxis) {
      case ColliderUpAxis.X:
        axis.set(0, 0, 0, 1);
        break;
      case ColliderUpAxis.Y:
        axis.set(0, 0, HALF_SQRT, HALF_SQRT);
        break;
      case ColliderUpAxis.Z:
        axis.set(0, HALF_SQRT, 0, HALF_SQRT);
        break;
    }

    rotation.multiply(axis);
    this._setLocalPose();
  }
}
