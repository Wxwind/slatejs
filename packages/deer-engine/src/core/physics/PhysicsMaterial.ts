import { PxPhysicsMaterial } from '@/module/physics/PxPhysicsMaterial';
import { PhysicsScene } from './PhysicsScene';
import { PxCombineMode } from '@/module/physics/enum';

export class PhysicsMateral {
  _nativeMaterial: PxPhysicsMaterial;

  private _bounciness: number = 0.1;
  private _dynamicFriction: number = 0.1;
  private _staticFriction: number = 0.1;
  private _bounceCombine: PxCombineMode = PxCombineMode.AVERAGE;
  private _frictionCombine: PxCombineMode = PxCombineMode.AVERAGE;

  private _isDestroyed: boolean = false;

  constructor() {
    this._nativeMaterial = PhysicsScene._physics.createPhysicMaterial(
      this._staticFriction,
      this._dynamicFriction,
      this._bounciness,
      this._bounceCombine,
      this._frictionCombine
    );
  }

  setBounciness(value: number) {
    this._nativeMaterial.setRestitution(value);
  }

  /**
   * Sets the coefficient of static friction.
   * @param value [0, PX_MAX_F32)
   */
  setStaticFriction(value: number) {
    this._nativeMaterial.setStaticFriction(value);
  }

  /**
   * Sets the coefficient of dynamic friction.
   * @param value [0, PX_MAX_F32)
   */
  setDynamicFriction(value: number) {
    this._nativeMaterial.setDynamicFriction(value);
  }

  setFrictionCombineMode(mode: PxCombineMode) {
    this._nativeMaterial.setFrictionCombineMode(mode);
  }

  setBouncinessCombineMode(mode: PxCombineMode) {
    this._nativeMaterial.setRestitutionCombineMode(mode);
  }

  destroy() {
    if (this._isDestroyed) return;
    this._nativeMaterial.destroy();
    this._isDestroyed = true;
  }
}
