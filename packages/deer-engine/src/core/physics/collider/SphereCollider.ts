import { PxPhysicsSphereCollider } from '@/module/physics/collider';
import { Collider } from './Collider';
import { PhysicsScene } from '@/core/physics/PhysicsScene';

export class SphereCollider extends Collider {
  _nativeCollider: PxPhysicsSphereCollider;

  private _radius: number = 0;
  public get radius(): number {
    return this._radius;
  }
  public set radius(v: number) {
    this._radius = v;
    this._nativeCollider.setRadius(v);
  }

  constructor() {
    super();
    this._nativeCollider = PhysicsScene._physics.createSphereCollider(this.radius, this._material._nativeMaterial);
  }
}
