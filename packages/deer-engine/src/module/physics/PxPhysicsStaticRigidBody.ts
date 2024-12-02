import PhysX from 'physx-js-webidl';
import { PxPhysicsRigidBody } from './PxPhysicsRigidBody';
import { Quaternion, Vector3 } from 'three';
import { IStaticRigidBody } from '@/core/physics/interface';

/** wrapper of PhysX.PxRigidStatic */
export class PxPhysicsStaticRigidBody extends PxPhysicsRigidBody implements IStaticRigidBody {
  _pxRigidBody: PhysX.PxRigidStatic;

  constructor(
    px: typeof PhysX & typeof PhysX.PxTopLevelFunctions,
    pxPhysics: PhysX.PxPhysics,
    position: Vector3,
    rotation: Quaternion
  ) {
    super();

    const pos = new px.PxVec3(position.x, position.y, position.z);
    const rot = new px.PxQuat(rotation.x, rotation.y, rotation.z, rotation.w);
    const pose = new px.PxTransform(pos, rot);
    const rigidBody = pxPhysics.createRigidStatic(pose);

    this._pxRigidBody = rigidBody;
  }
}
