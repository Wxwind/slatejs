import { PhysicsScene } from '@/core/physics/PhysicsScene';
import { IVector3 } from '@/type';
import { IBoxCollider } from '../interface';
import { Collider } from './Collider';

export class BoxCollider extends Collider {
  _nativeCollider: IBoxCollider;

  private _size: IVector3 = { x: 1, y: 1, z: 1 };
  public get size(): IVector3 {
    return this._size;
  }
  public set size(v: IVector3) {
    this._size = v;
    this._nativeCollider.setSize(v);
  }

  constructor() {
    super();
    this._nativeCollider = PhysicsScene._nativePhysics.createBoxCollider(
      this._id,
      this.size,
      this._material._nativeMaterial
    );
  }
}
