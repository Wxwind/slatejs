import PhysX from 'physx-js-webidl';
import { PxPhysicsScene } from './PxPhysicsScene';
import { PhysicsControllerNonWalkableModeEnum, PhysicsControllerCollisionFlag } from '../../core/physics/enum';
import { Quaternion, Vector3 } from 'three';
import { toPxExtendVec3, toPxVec3 } from './utils';
import { IVector3 } from '@/type';
import { PxPhysicsCapsuleCollider, PxPhysicsCollider } from './collider';
import { ICharacterController } from '@/core/physics/interface';
import { castPxObject } from './pxExtensions';

export class PxPhysicsCharacterController implements ICharacterController {
  _pxController: PhysX.PxCapsuleController | undefined = undefined;
  _tempVec3: PhysX.PxVec3;
  _tempExtendedVec3: PhysX.PxExtendedVec3;

  _pxScene: PxPhysicsScene;

  _worldPosition = new Vector3();

  constructor(pxScene: PxPhysicsScene) {
    this._pxScene = pxScene;
    const _px = pxScene._px;
    this._tempVec3 = new _px.PxVec3();
    this._tempExtendedVec3 = new _px.PxExtendedVec3();
  }

  addCollider(collider: PxPhysicsCollider): boolean {
    if (!(collider instanceof PxPhysicsCapsuleCollider)) {
      throw new Error('only support PxPhysicsCollider');
    }
    const controller = this._createPXController(
      this._pxScene,
      collider._radius,
      collider._halfHeight * 2,
      collider._pxMaterial
    );
    this._pxController = controller;

    return true;
  }

  removeCollider(collider: PxPhysicsCollider, wakeOnLostTouch?: boolean): void {
    this._destroyController();
  }

  setRadius(radius: number): void {
    if (!this._pxController) return;
    this._pxController.setRadius(radius);
  }

  setHeight(height: number): void {
    if (!this._pxController) return;
    this._pxController.setHeight(height);
  }

  setStepOffset(offset: number): void {
    if (!this._pxController) return;
    this._pxController.setStepOffset(offset);
  }

  setNonWalkableMode(flag: PhysicsControllerNonWalkableModeEnum): void {
    if (!this._pxController) return;
    this._pxController.setNonWalkableMode(flag as unknown as PhysX.PxControllerNonWalkableModeEnum);
  }

  setUpDirection(up: Vector3): void {
    if (!this._pxController) return;
  }

  setSlopeLimit(slopeLimit: number): void {
    if (!this._pxController) return;
    this._pxController.setSlopeLimit(slopeLimit);
  }

  getWorldTransform(outPosition: Vector3, outRotation: Quaternion): void {
    throw new Error('CharacterController can only get position, use "getWorldPosition" instead.');
  }

  setWorldTransform(position: Vector3, rotation: Quaternion): void {
    throw new Error('CharacterController can only set potation, use "setWorldPosition" instead.');
  }

  private _createPXController(
    pxScene: PxPhysicsScene,
    radius: number,
    height: number,
    material: PhysX.PxMaterial
  ): PhysX.PxCapsuleController {
    const { _px: px, _pxControllerManager: pxControllerManager } = pxScene;

    const desc = new px.PxCapsuleControllerDesc();
    desc.radius = radius;
    desc.height = height;
    desc.climbingMode = 1; // eCONSTRAINED

    desc.material = material;

    return castPxObject(px, pxControllerManager.createController(desc), px.PxCapsuleController);
  }

  /**
   *

   */
  move(
    disp: IVector3,
    minDist: number,
    elapsedTime: number,
    filters?: PhysX.PxControllerFilters,
    obstacles?: PhysX.PxObstacleContext | undefined
  ): number {
    filters ??= new this._pxScene._px.PxControllerFilters();
    if (!this._pxController) return PhysicsControllerCollisionFlag.COLLISION_SIDES;
    const flag = this._pxController.move(toPxVec3(disp, this._tempVec3), minDist, elapsedTime, filters, obstacles);

    return this._toPhysicsControllerCollisionFlagsNumber(flag);
  }

  private _toPhysicsControllerCollisionFlagsNumber(flag: PhysX.PxControllerCollisionFlags): number {
    let mask = 0;
    const px = this._pxScene._px;
    if (flag.isSet(px.PxControllerCollisionFlagEnum.eCOLLISION_DOWN)) {
      mask |= PhysicsControllerCollisionFlag.COLLISION_DOWN;
    }
    if (flag.isSet(px.PxControllerCollisionFlagEnum.eCOLLISION_UP)) {
      mask |= PhysicsControllerCollisionFlag.COLLISION_UP;
    }
    if (flag.isSet(px.PxControllerCollisionFlagEnum.eCOLLISION_SIDES)) {
      mask |= PhysicsControllerCollisionFlag.COLLISION_SIDES;
    }
    return mask;
  }

  /**
   *
   * @returns the position from the center of the collision shape
   */
  getWorldPosition(outPosition: Vector3) {
    if (!this._pxController) return;
    const position = this._pxController.getPosition();
    outPosition.set(position.x, position.y, position.z);
    return outPosition;
  }

  setWorldPosition(position: Vector3): void {
    this._worldPosition = position;
    this._updateNativeWorldPosition();
  }

  getFootPosition(outPosition: Vector3) {
    if (!this._pxController) return;
    const position = this._pxController.getFootPosition();
    outPosition.set(position.x, position.y, position.z);
    return outPosition;
  }

  destroy(): void {
    this._destroyController();
  }

  private _destroyController() {
    if (this._pxController) {
      this._pxController.release();
      this._pxController = undefined;
    }
  }

  private _updateNativeWorldPosition() {
    if (!this._pxController) return;
    this._pxController.setPosition(toPxExtendVec3(this._worldPosition, this._tempExtendedVec3));
  }
}
