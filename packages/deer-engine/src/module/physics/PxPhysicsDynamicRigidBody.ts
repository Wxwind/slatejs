import PhysX from 'physx-js-webidl';
import { PxPhysics } from './PxPhysics';
import { PxPhysicsRigidBody } from './PxPhysicsRigidBody';
import { Quaternion, Vector3 } from 'three';
import { toPxTransform } from './utils';
import { IVector3 } from '@/type';

/** wrapper of PhysX.PxRigidDynamic */
export class PxPhysicsDynamicRigidBody extends PxPhysicsRigidBody {
  _pxRigidBody: PhysX.PxRigidDynamic;

  private static _tempPosition = new Vector3();
  private static _tempRotation = new Quaternion();
  private _tempVec1: PhysX.PxVec3;

  constructor(pxPhysics: PxPhysics, position: IVector3, rotation: Quaternion) {
    super();
    const px = pxPhysics._physX;
    const pos = new px.PxVec3(position.x, position.y, position.z);
    const rot = new px.PxQuat(rotation.x, rotation.y, rotation.z, rotation.w);
    const pose = new px.PxTransform(pos, rot);
    const rigidBody = pxPhysics._pxPhysics.createRigidDynamic(pose);

    this._pxRigidBody = rigidBody;
    this._tempVec1 = new px.PxVec3();
  }

  move(positionOrRotation: IVector3 | Quaternion, rotation?: Quaternion) {
    if (rotation) {
      this._pxRigidBody.setKinematicTarget(toPxTransform(positionOrRotation, rotation));
      return;
    }

    const tempPosition = PxPhysicsDynamicRigidBody._tempPosition;
    const tempRotation = PxPhysicsDynamicRigidBody._tempRotation;
    this.getTransform(tempPosition, tempRotation);
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
