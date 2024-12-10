import { PhysicsScene } from '@/core/physics/PhysicsScene';
import { ISphereCollider } from '../interface';
import { Collider } from './Collider';

export class SphereCollider extends Collider {
  _nativeCollider: ISphereCollider;

  private _radius: number = 1;
  public get radius(): number {
    return this._radius;
  }
  public set radius(v: number) {
    this._radius = v;
    this._nativeCollider.setRadius(v);
  }

  constructor() {
    super();
    this._nativeCollider = PhysicsScene._nativePhysics.createSphereCollider(
      this.radius,
      this._material._nativeMaterial,
    );
  }
}
