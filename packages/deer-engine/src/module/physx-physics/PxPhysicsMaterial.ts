import PhysX from 'physx-js-webidl';
import { PhysicsCombineMode } from '../../core/physics/enum';
import { PxPhysics } from './PxPhysics';
import { IPhysicsMaterial } from '@/core/physics/interface';

/** wrapper of PhysX.Material */
export class PxPhysicsMaterial implements IPhysicsMaterial {
  _pxMaterial: PhysX.PxMaterial;

  constructor(
    pxPhysics: PxPhysics,
    staticFriction: number,
    dynamicFriction: number,
    restitution: number,
    frictionCombineMode: PhysicsCombineMode,
    restitutionCombineMode: PhysicsCombineMode
  ) {
    const pxMaterial = pxPhysics._pxPhysics.createMaterial(staticFriction, dynamicFriction, restitution);
    pxMaterial.setFrictionCombineMode(frictionCombineMode as unknown as PhysX.PxCombineModeEnum);
    pxMaterial.setRestitutionCombineMode(restitutionCombineMode as unknown as PhysX.PxCombineModeEnum);
    this._pxMaterial = pxMaterial;
  }

  /**
   * Sets the coefficient of restitution or the spring stiffness for compliant contact.
   * @param value A coefficient of 0 makes the object bounce as little as possible, higher values up to 1.0 result in more bounce. If a negative value is provided it is interpreted as stiffness term for an implicit spring simulated at the contact site, with the spring positional error defined by the contact separation value. Higher stiffness terms produce stiffer springs that behave more like a rigid contact.
   */
  setRestitution(value: number) {
    this._pxMaterial.setRestitution(value);
  }

  /**
   * Sets the coefficient of static friction.
   * @param value [0, PX_MAX_F32)
   */
  setStaticFriction(value: number) {
    this._pxMaterial.setStaticFriction(value);
  }

  /**
   * Sets the coefficient of dynamic friction.
   * @param value [0, PX_MAX_F32)
   */
  setDynamicFriction(value: number) {
    this._pxMaterial.setDynamicFriction(value);
  }

  setFrictionCombineMode(mode: PhysicsCombineMode) {
    this._pxMaterial.setFrictionCombineMode(mode as unknown as PhysX.PxCombineModeEnum);
  }

  setRestitutionCombineMode(mode: PhysicsCombineMode) {
    this._pxMaterial.setRestitutionCombineMode(mode as unknown as PhysX.PxCombineModeEnum);
  }

  destroy() {
    this._pxMaterial.release();
  }
}
