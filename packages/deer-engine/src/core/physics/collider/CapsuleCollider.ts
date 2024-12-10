import { Collider } from './Collider';
import { PhysicsScene } from '@/core/physics/PhysicsScene';
import { ICapsuleCollider } from '../interface';

export class CapsuleCollider extends Collider {
  _nativeCollider: ICapsuleCollider;

  private _radius: number = 1;
  public get radius(): number {
    return this._radius;
  }
  public set radius(v: number) {
    this._radius = v;
    this._nativeCollider.setRadius(v);
  }

  private _height: number = 2;
  public get height(): number {
    return this._height;
  }
  public set height(v: number) {
    this._height = v;
    this._nativeCollider.setHeight(v);
  }

  constructor() {
    super();
    this._nativeCollider = PhysicsScene._nativePhysics.createCapsuleCollider(
      this.radius,
      this.height,
      this._material._nativeMaterial,
    );
  }
}
