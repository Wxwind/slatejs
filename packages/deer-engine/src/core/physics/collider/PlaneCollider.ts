import { PhysicsScene } from '../PhysicsScene';
import { IPlaneCollider } from '../interface';
import { Collider } from './Collider';

export class PlaneCollider extends Collider {
  _nativeCollider: IPlaneCollider;

  constructor() {
    super();
    this._nativeCollider = PhysicsScene._nativePhysics.createPlaneCollider(
      this._material._nativeMaterial,
    );
  }
}
