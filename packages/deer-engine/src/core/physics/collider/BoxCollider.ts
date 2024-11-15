import { PxPhysicsBoxCollider } from '@/module/physics/collider';
import { Collider } from './Collider';
import { PhysicsScene } from '@/core/physics/PhysicsScene';
import { Vector3 } from 'three';

export class BoxCollider extends Collider {
  _nativeCollider: PxPhysicsBoxCollider;

  private _size: Vector3 = new Vector3(1, 1, 1);
  public get size(): Vector3 {
    return this._size;
  }
  public set size(v: Vector3) {
    this._size = v;
    this._nativeCollider.setSize(v);
  }

  constructor() {
    super();
    this._nativeCollider = PhysicsScene._nativePhysics.createBoxCollider(this.size, this._material._nativeMaterial);
  }
}
