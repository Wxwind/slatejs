import { PxPhysics } from '../PxPhysics';
import PhysX from 'physx-js-webidl';
import { PxShapeFlag } from '../enum';
import { PxPhysicsMaterial } from '../PxPhysicsMaterial';
import { Vector3, Quaternion } from 'three';
import { toPxTransform } from '../utils';

export abstract class PxPhysicsCollider {
  abstract _pxGeometry: PhysX.PxGeometry;
  _pxMaterial!: PhysX.PxMaterial;
  _pxShape!: PhysX.PxShape;

  protected _pxPhysics: PhysX.PxPhysics;
  protected _px: typeof PhysX & typeof PhysX.PxTopLevelFunctions;

  /** @readonly */
  _shapeFlag: PxShapeFlag = PxShapeFlag.SCENE_QUERY_SHAPE | PxShapeFlag.SIMULATION_SHAPE;

  protected _position = new Vector3();
  protected _rotation = new Quaternion();

  private _filterData: PhysX.PxFilterData;

  constructor(pxPhysics: PxPhysics) {
    this._pxPhysics = pxPhysics._pxPhysics;
    this._px = pxPhysics._physX;
    this._filterData = new this._px.PxFilterData(1, 1, 0, 0);
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

  setTrigger(value: boolean) {
    this.setShapeFlag(PxShapeFlag.SIMULATION_SHAPE, !value);
    this.setShapeFlag(PxShapeFlag.TRIGGER_SHAPE, value);
  }

  setShapeFlags(flags: PxShapeFlag) {
    this._shapeFlag = flags;
    this._pxShape.setFlags(new this._px.PxShapeFlags(flags));
  }

  setShapeFlag(flag: PxShapeFlag, value: boolean) {
    value ? (this._shapeFlag |= flag) : (this._shapeFlag ^= flag);
    this._pxShape.setFlag(flag as unknown as PhysX.PxShapeFlagEnum, value);
  }

  setPosition(position: Vector3) {
    this._position.copy(position);
    this._setLocalPose();
  }

  setRotation(rotation: Quaternion) {
    this._rotation.copy(rotation);
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
    this._pxShape.setLocalPose(toPxTransform(this._position, this._rotation));
  }

  destroy() {
    this._pxShape.release();
  }
}
