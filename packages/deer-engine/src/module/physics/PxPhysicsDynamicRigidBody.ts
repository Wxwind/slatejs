import PhysX from 'physx-js-webidl';
import { PxPhysicsRigidBody } from './PxPhysicsRigidBody';
import { Quaternion, Vector3 } from 'three';
import { toPxTransform, toPxVec3 } from './utils';
import { IVector3 } from '@/type';
import { IDynamicRigidbody } from '@/core/physics/interface';
import { CollisionDetectionMode } from '@/core';

/** wrapper of PhysX.PxRigidDynamic */
export class PxPhysicsDynamicRigidBody extends PxPhysicsRigidBody implements IDynamicRigidbody {
  _pxRigidBody: PhysX.PxRigidDynamic;

  private static _tempPosition = new Vector3();
  private static _tempRotation = new Quaternion();
  private _tempVec1: PhysX.PxVec3;

  constructor(
    private px: typeof PhysX & typeof PhysX.PxTopLevelFunctions,
    private pxPhysics: PhysX.PxPhysics,
    position: IVector3,
    rotation: Quaternion
  ) {
    super();
    const pos = new px.PxVec3(position.x, position.y, position.z);
    const rot = new px.PxQuat(rotation.x, rotation.y, rotation.z, rotation.w);
    const pose = new px.PxTransform(pos, rot);
    const rigidBody = pxPhysics.createRigidDynamic(pose);
    this._pxRigidBody = rigidBody;
    this._tempVec1 = new px.PxVec3();
  }

  setLinearDamping(value: number): void {
    this._pxRigidBody.setLinearDamping(value);
  }

  setAngularDamping(value: number): void {
    this._pxRigidBody.setAngularDamping(value);
  }

  setLinearVelocity(value: Vector3): void {
    this._pxRigidBody.setLinearVelocity(toPxVec3(value, this._tempVec1));
  }

  setAngularVelocity(value: Vector3): void {
    this._pxRigidBody.setAngularVelocity(toPxVec3(value, this._tempVec1));
  }

  setCenterOfMass(position: Vector3, rotation: Quaternion): void {
    this._pxRigidBody.setCMassLocalPose(toPxTransform(position, rotation));
  }

  setInertiaTensor(value: Vector3): void {
    this._pxRigidBody.setMassSpaceInertiaTensor(toPxVec3(value, this._tempVec1));
  }

  setMaxAngularVelocity(value: number): void {
    this._pxRigidBody.setMaxAngularVelocity(value);
  }

  setMaxDepenetrationVelocity(value: number): void {
    this._pxRigidBody.setMaxDepenetrationVelocity(value);
  }

  setSleepThreshold(value: number): void {
    this._pxRigidBody.setSleepThreshold(value);
  }

  setSolverIterations(value: number): void {
    this._pxRigidBody.setSolverIterationCounts(value, 1);
  }

  setCollisionDetectionMode(value: CollisionDetectionMode): void {
    const px = this.px;
    switch (value) {
      case CollisionDetectionMode.Continuous:
        this._pxRigidBody.setRigidBodyFlag(px.PxRigidBodyFlagEnum.eENABLE_CCD, true);
        break;
      case CollisionDetectionMode.ContinuousDynamic:
        this._pxRigidBody.setRigidBodyFlag(px.PxRigidBodyFlagEnum.eENABLE_CCD_FRICTION, true);
        break;
      case CollisionDetectionMode.ContinuousSpeculative:
        this._pxRigidBody.setRigidBodyFlag(px.PxRigidBodyFlagEnum.eENABLE_SPECULATIVE_CCD, true);
        break;
      case CollisionDetectionMode.Discrete:
        this._pxRigidBody.setRigidBodyFlag(px.PxRigidBodyFlagEnum.eENABLE_CCD, false);
        this._pxRigidBody.setRigidBodyFlag(px.PxRigidBodyFlagEnum.eENABLE_CCD_FRICTION, false);
        this._pxRigidBody.setRigidBodyFlag(px.PxRigidBodyFlagEnum.eENABLE_SPECULATIVE_CCD, false);
        break;
    }
  }

  setIsKinematic(value: boolean): void {
    if (value) {
      this._pxRigidBody.setRigidBodyFlag(this.px.PxRigidBodyFlagEnum.eKINEMATIC, true);
    } else {
      this._pxRigidBody.setRigidBodyFlag(this.px.PxRigidBodyFlagEnum.eKINEMATIC, false);
    }
  }

  setLockFlags(flags: number): void {
    //  this._pxRigidBody.setRigidDynamicLockFlags();
    throw new Error("setLockFlags hasn't been implemented yet.");
  }

  sleep(): void {
    this._pxRigidBody.putToSleep();
  }

  wakeUp(): void {
    this._pxRigidBody.wakeUp();
  }

  setMass(mass: number) {
    this._pxRigidBody.setMass(mass);
  }

  move(positionOrRotation: IVector3 | Quaternion, rotation?: Quaternion) {
    if (rotation) {
      this._pxRigidBody.setKinematicTarget(toPxTransform(positionOrRotation, rotation));
      return;
    }

    const tempPosition = PxPhysicsDynamicRigidBody._tempPosition;
    const tempRotation = PxPhysicsDynamicRigidBody._tempRotation;
    this.getWorldTransform(tempPosition, tempRotation);
    if (positionOrRotation instanceof Vector3) {
      this._pxRigidBody.setKinematicTarget(toPxTransform(positionOrRotation, tempRotation));
    } else {
      this._pxRigidBody.setKinematicTarget(toPxTransform(tempPosition, tempRotation));
    }
  }

  addForce(force: IVector3) {
    const tempVec1 = this._tempVec1;
    tempVec1.x = force.x;
    tempVec1.y = force.y;
    tempVec1.z = force.z;
    this._pxRigidBody.addForce(tempVec1);
  }

  addTorque(torque: IVector3) {
    const tempVec1 = this._tempVec1;
    tempVec1.x = torque.x;
    tempVec1.y = torque.y;
    tempVec1.z = torque.z;
    this._pxRigidBody.addTorque(tempVec1);
  }
}
