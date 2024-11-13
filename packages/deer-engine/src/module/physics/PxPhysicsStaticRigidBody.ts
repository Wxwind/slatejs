import PhysX from 'physx-js-webidl';
import { PxPhysics } from './PxPhysics';
import { PxPhysicsRigidBody } from './PxPhysicsRigidBody';
import { Quaternion, Vector3 } from 'three';

/** wrapper of PhysX.PxRigidStatic */
export class PxPhysicsStaticRigidBody extends PxPhysicsRigidBody {
  _pxRigidBody: PhysX.PxRigidStatic;

  constructor(pxPhysics: PxPhysics, position: Vector3, rotation: Quaternion) {
    super();
    const px = pxPhysics._physX;
    const pos = new px.PxVec3(position.x, position.y, position.z);
    const rot = new px.PxQuat(rotation.x, rotation.y, rotation.z, rotation.w);
    const pose = new px.PxTransform(pos, rot);
    const rigidBody = pxPhysics._pxPhysics.createRigidStatic(pose);

    this._pxRigidBody = rigidBody;
  }
}
