import PhysX from 'physx-js-webidl';
import { Vector3, Quaternion } from 'three';
import { ICollider } from '@/core/physics/interface';
import { IVector3 } from '@/type';
import { PxPhysics } from '../PxPhysics';
import { PhysicsShapeFlag } from '../../../core/physics/enum';
import { PxPhysicsMaterial } from '../PxPhysicsMaterial';
import { toPxTransform } from '../utils';

export const HALF_SQRT = 0.7071067811;

export abstract class PxPhysicsCollider implements ICollider {
  protected abstract _pxGeometry: PhysX.PxGeometry;
  _pxMaterial!: PhysX.PxMaterial;
  _pxShape!: PhysX.PxShape;

  protected _pxPhysics: PhysX.PxPhysics;
  protected _px: typeof PhysX & typeof PhysX.PxTopLevelFunctions;
  protected _axis: Quaternion | null = null;

  protected _shapeFlag: PhysicsShapeFlag = PhysicsShapeFlag.SCENE_QUERY_SHAPE | PhysicsShapeFlag.SIMULATION_SHAPE;

  protected _position = new Vector3();
  protected _rotation = new Quaternion();
  protected _worldScale = new Vector3(1, 1, 1);
  protected _tempPxTransform: PhysX.PxTransform;

  private _filterData: PhysX.PxFilterData;

  private _realRotation = new Quaternion();
  private _realPosition = new Vector3();

  _id: number;

  constructor(pxPhysics: PxPhysics, id: number) {
    this._pxPhysics = pxPhysics._pxPhysics;
    this._px = pxPhysics._physX;

    const PxPairFlagEnum = this._px.PxPairFlagEnum;
    this._filterData = new this._px.PxFilterData(
      1,
      1,
      PxPairFlagEnum.eNOTIFY_TOUCH_FOUND | PxPairFlagEnum.eNOTIFY_TOUCH_LOST | PxPairFlagEnum.eNOTIFY_TOUCH_PERSISTS,
      0
    );
    this._tempPxTransform = new pxPhysics._physX.PxTransform();
    this._id = id;
  }

  /**
   * called in inherited class' ctor
   */
  protected _initialize(material: PxPhysicsMaterial) {
    this._pxMaterial = material._pxMaterial;
    this._pxShape = this._pxPhysics.createShape(
      this._pxGeometry,
      material._pxMaterial,
      true,
      new this._px.PxShapeFlags(this._shapeFlag)
    );
    this._pxShape.setSimulationFilterData(this._filterData);
  }

  setIsTrigger(value: boolean) {
    // use SIMULATION_SHAPE to implements trigger-trigger events
    this._filterData.word3 = value ? this._filterData.word3 | 1 : this._filterData.word3 & ~1;
    this._pxShape.setSimulationFilterData(this._filterData);
  }

  setShapeFlags(flags: PhysicsShapeFlag) {
    this._shapeFlag = flags;
    this._pxShape.setFlags(new this._px.PxShapeFlags(flags));
  }

  setShapeFlag(flag: PhysicsShapeFlag, value: boolean) {
    value ? (this._shapeFlag |= flag) : (this._shapeFlag ^= flag);
    this._pxShape.setFlag(flag as unknown as PhysX.PxShapeFlagEnum, value);
  }

  setPosition(position: IVector3) {
    IVector3.copy(this._position, position);
    this._setLocalPose();
  }

  setRotation(rotation: Quaternion) {
    this._rotation.copy(rotation);
    this._realRotation.copy(this._rotation);
    this._axis && this._realRotation.multiplyQuaternions(this._rotation, this._axis);
    this._setLocalPose();
  }

  setAxis(axis: Quaternion) {
    this._axis = axis;
    this._realRotation.multiplyQuaternions(this._rotation, this._axis);
    this._setLocalPose();
  }

  setWorldScale(scale: IVector3): void {
    IVector3.copy(this._worldScale, scale);
    this._setLocalPose();
  }

  /**
   * Shapes whose distance is less than the sum of their contactOffset values will generate contacts. The contact offset must be positive and greater than the rest offset. Having a contactOffset greater than than the restOffset allows the collision detection system to predictively enforce the contact constraint even when the objects are slightly separated. This prevents jitter that would occur if the constraint were enforced only when shapes were within the rest distance.
   * @default 0.02f * PxTolerancesScale::length
   */
  setContactOffset(offset: number): void {
    this._pxShape.setContactOffset(offset);
  }

  /**
   * Two shapes will come to rest at a distance equal to the sum of their restOffset values. If the restOffset is 0, they should converge to touching exactly. Having a restOffset greater than zero is useful to have objects slide smoothly, so that they do not get hung up on irregularities of each others’ surfaces.
   * @default 0
   */
  setRestOffset(offset: number): void {
    this._pxShape.setRestOffset(offset);
  }

  protected _setLocalPose() {
    this._realPosition.multiplyVectors(this._position, this._worldScale);
    this._pxShape.setLocalPose(toPxTransform(this._realPosition, this._realRotation, this._tempPxTransform));
  }

  destroy() {
    this._pxShape.release();
  }
}
