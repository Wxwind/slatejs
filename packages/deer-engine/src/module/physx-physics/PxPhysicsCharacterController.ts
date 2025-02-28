import PhysX from 'physx-js-webidl';
import { PxPhysicsScene } from './PxPhysicsScene';
import { PhysicsControllerNonWalkableModeEnum, PhysicsControllerCollisionFlag } from '../../core/physics/enum';
import { Quaternion, Vector3 } from 'three';
import { fromPxVec3Like, toPxExtendVec3, toPxVec3 } from './utils';
import { IVector3 } from '@/type';
import { PxPhysicsCapsuleCollider, PxPhysicsCollider } from './collider';
import { ICharacterController } from '@/core/physics/interface';
import { castPxObject, castPxPointer } from './pxExtensions';

export class PxPhysicsCharacterController implements ICharacterController {
  _px: typeof PhysX & typeof PhysX.PxTopLevelFunctions;
  _pxController: PhysX.PxCapsuleController | undefined = undefined;
  _tempVec3: PhysX.PxVec3;
  _tempExtendedVec3: PhysX.PxExtendedVec3;

  _scene: PxPhysicsScene;

  _worldPosition = new Vector3();

  _collider: PxPhysicsCapsuleCollider | null = null;
  _filters: PhysX.PxControllerFilters;

  _id: number;

  private _activeInScene: boolean = false;

  set activeInScene(v: boolean) {
    if (this._activeInScene === v) return;
    this._activeInScene = v;
    const collider = this._collider;
    if (v) {
      if (collider) {
        const controller = this._createPXController(
          this._scene,
          collider._radius,
          collider._halfHeight * 2,
          collider._pxMaterial
        );
        this._pxController = controller;
        const shape = (this._px.SupportFunctions.prototype as any).PxActor_getShape(controller.getActor(), 0);
        collider._pxShape = shape;
        this._collider = collider;
        this._scene._onColliderAdd(collider);
        this._scene._onControllerAdd(this);
      }
    } else {
      if (collider) {
        this._scene._onColliderRemove(collider);
        this._scene._onControllerRemove(this);
      }
    }
  }

  get activeInScene(): boolean {
    return this._activeInScene;
  }

  constructor(pxScene: PxPhysicsScene, id: number) {
    const px = pxScene._px;
    this._scene = pxScene;
    this._px = px;
    this._tempVec3 = new px.PxVec3();
    this._tempExtendedVec3 = new px.PxExtendedVec3();
    this._id = id;
    this._filters = new px.PxControllerFilters();
    const queryFilterCallback = new px.PxQueryFilterCallbackImpl();
    queryFilterCallback.simplePreFilter = (data, shape, actor, flag) => {
      const obj = castPxPointer(px, shape, px.PxShape);
      if (px.IsTriggerShape(obj)) {
        return px.PxQueryHitType.eNONE;
      }
      return px.PxQueryHitType.eBLOCK;
    };
    this._filters.mFilterCallback = queryFilterCallback;
    this._filters.mFilterFlags.raise(px.PxQueryFlagEnum.ePREFILTER);
  }

  setGravityFlag(enable: boolean): void {
    this._pxController?.getActor().setActorFlag(this._px.PxActorFlagEnum.eDISABLE_GRAVITY, !enable);
  }

  addCollider(collider: PxPhysicsCollider): boolean {
    if (!(collider instanceof PxPhysicsCapsuleCollider)) {
      throw new Error('only support PxPhysicsCapsuleCollider');
    }

    if (!this._activeInScene) {
      // don't create pxController if disabled
      this._collider = collider;
      return true;
    }
    const controller = this._createPXController(
      this._scene,
      collider._radius,
      collider._halfHeight * 2,
      collider._pxMaterial
    );
    this._pxController = controller;

    const shape = (this._px.SupportFunctions.prototype as any).PxActor_getShape(
      controller.getActor(),
      0
    ) as PhysX.PxShape;
    collider._pxShape = shape;
    const PxPairFlagEnum = this._px.PxPairFlagEnum;
    shape.setSimulationFilterData(
      new this._px.PxFilterData(
        1,
        1,
        PxPairFlagEnum.eNOTIFY_TOUCH_FOUND | PxPairFlagEnum.eNOTIFY_TOUCH_LOST | PxPairFlagEnum.eNOTIFY_TOUCH_PERSISTS,
        0
      )
    );

    this._collider = collider;
    this._scene._onColliderAdd(this._collider);
    this._scene._onControllerAdd(this);

    return true;
  }

  removeCollider(collider: PxPhysicsCollider, wakeOnLostTouch?: boolean): void {
    if (!this._collider) return;

    if (this._activeInScene) {
      this._destroyController();
      this._scene._onColliderRemove(this._collider);
      this._scene._onControllerRemove(this);
      this._collider = null;
    }
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

    const reportCallback = new px.PxUserControllerHitReportImpl();

    reportCallback.onShapeHit = (hitPointer: PhysX.PxControllerShapeHit) => {
      const hit = this._px.NativeArrayHelpers.prototype.getControllerShapeHitAt(hitPointer, 0);
      const cct = hit.controller as any;
      const nativeShape = hit.shape as any;
      const shape = this._scene._pxColliderMap[nativeShape.ptr]?._id;
      const cctId = this._scene._pxControllerMap[cct.ptr]._id;

      this._scene._onCharacterControllerHit?.(this._id, {
        colliderId: shape,
        controllerId: cctId,
        normal: fromPxVec3Like(hit.worldNormal, this._tempVec31),
        point: fromPxVec3Like(hit.worldPos, this._tempVec32),
        direction: fromPxVec3Like(hit.dir, this._tempVec33),
        length: hit.length,
      });
    };

    reportCallback.onControllerHit = (hitPointer: PhysX.PxControllerHit) => {};

    reportCallback.onObstacleHit = (hitPointer: PhysX.PxControllerHit) => {};

    desc.reportCallback = reportCallback;

    return castPxObject(px, pxControllerManager.createController(desc), px.PxCapsuleController);
  }

  move(disp: IVector3, minDist: number, elapsedTime: number): number {
    const filters = this._filters;
    if (!this._pxController) return PhysicsControllerCollisionFlag.COLLISION_SIDES;
    const flag = this._pxController.move(toPxVec3(disp, this._tempVec3), minDist, elapsedTime, filters, undefined);

    return this._toPhysicsControllerCollisionFlagsNumber(flag);
  }

  private _toPhysicsControllerCollisionFlagsNumber(flag: PhysX.PxControllerCollisionFlags): number {
    let mask = 0;
    const px = this._scene._px;
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

  private _tempVec31 = { x: 0, y: 0, z: 0 };
  private _tempVec32 = { x: 0, y: 0, z: 0 };
  private _tempVec33 = { x: 0, y: 0, z: 0 };
}
