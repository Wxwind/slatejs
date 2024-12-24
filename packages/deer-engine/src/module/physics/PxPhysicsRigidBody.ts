import PhysX from 'physx-js-webidl';
import { Quaternion, Vector3 } from 'three';
import { toPxTransform } from './utils';
import { PxPhysicsCollider } from './collider';
import { IRigidbody } from '@/core/physics/interface';
import { PxPhysicsScene } from './PxPhysicsScene';

/** wrapper of PhysX.PxRigidActor */
export abstract class PxPhysicsRigidBody implements IRigidbody {
  abstract _pxRigidBody: PhysX.PxRigidActor;
  protected _tempPxTransform: PhysX.PxTransform;

  protected _colliders: PxPhysicsCollider[] = [];

  _scene: PxPhysicsScene | null = null;
  private _activeInScene: boolean = false;

  set activeInScene(v: boolean) {
    if (this._activeInScene === v) return;
    this._activeInScene = v;
    if (v) {
      for (const collider of this._colliders) {
        this._scene?._onColliderAdd(collider);
      }
    } else {
      for (const collider of this._colliders) {
        this._scene?._onColliderRemove(collider);
      }
    }
  }

  get activeInScene(): boolean {
    return this._activeInScene;
  }

  constructor(protected px: typeof PhysX & typeof PhysX.PxTopLevelFunctions) {
    this._tempPxTransform = new px.PxTransform();
  }

  getWorldTransform(outPosition: Vector3, outRotation: Quaternion): void {
    const pose = this._pxRigidBody.getGlobalPose();
    outPosition.set(pose.p.x, pose.p.y, pose.p.z);
    outRotation.set(pose.q.x, pose.q.y, pose.q.z, pose.q.w);
  }

  setWorldTransform(position: Vector3, rotation: Quaternion): void {
    this._pxRigidBody.setGlobalPose(toPxTransform(position, rotation, this._tempPxTransform));
  }

  /**
   *
   * @param collider the collider to attach
   * @returns True if success
   */
  addCollider(collider: PxPhysicsCollider) {
    const ok = this._pxRigidBody.attachShape(collider._pxShape);
    this._activeInScene && this._scene?._onColliderAdd(collider);
    this._colliders.push(collider);
    return ok;
  }

  /**
   *
   * @param collider the collider to detach
   * @param wakeOnLostTouch Specifies whether touching objects from the previous frame should get woken up in the next frame. Only applies to PxArticulationReducedCoordinate and PxRigidActor types.
   */
  removeCollider(collider: PxPhysicsCollider, wakeOnLostTouch = true) {
    const index = this._colliders.indexOf(collider);
    if (index === -1) return;

    this._pxRigidBody.detachShape(collider._pxShape, wakeOnLostTouch);
    this._activeInScene && this._scene?._onColliderRemove(collider);
    this._colliders.splice(index, 1);
  }

  destroy() {
    this._pxRigidBody.release();
  }
}
