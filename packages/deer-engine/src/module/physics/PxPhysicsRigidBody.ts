import PhysX from 'physx-js-webidl';
import { Quaternion, Vector3 } from 'three';
import { toPxTransform } from './utils';
import { PxPhysicsCollider } from './collider';

/** wrapper of PhysX.PxRigidActor */
export abstract class PxPhysicsRigidBody {
  abstract _pxRigidBody: PhysX.PxRigidActor;

  constructor() {}

  getTransform(outPosition: Vector3, outRotation: Quaternion): void {
    const pose = this._pxRigidBody.getGlobalPose();
    outPosition.set(pose.p.x, pose.p.y, pose.p.z);
    outRotation.set(pose.q.x, pose.q.y, pose.q.z, pose.q.w);
  }

  setTransform(position: Vector3, rotation: Quaternion): void {
    this._pxRigidBody.setGlobalPose(toPxTransform(position, rotation));
  }

  /**
   *
   * @param collider the collider to attach
   * @returns True if success
   */
  addCollider(collider: PxPhysicsCollider) {
    return this._pxRigidBody.attachShape(collider._pxShape);
  }

  /**
   *
   * @param collider the collider to detach
   * @param wakeOnLostTouch Specifies whether touching objects from the previous frame should get woken up in the next frame. Only applies to PxArticulationReducedCoordinate and PxRigidActor types.
   */
  removeCollider(collider: PxPhysicsCollider, wakeOnLostTouch = true) {
    this._pxRigidBody.detachShape(collider._pxShape, wakeOnLostTouch);
  }

  destroy() {
    this._pxRigidBody.release();
  }
}
