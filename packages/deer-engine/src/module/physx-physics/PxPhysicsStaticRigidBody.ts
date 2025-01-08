import PhysX from 'physx-js-webidl';
import { PxPhysicsRigidBody } from './PxPhysicsRigidBody';
import { Quaternion } from 'three';
import { IStaticRigidBody } from '@/core/physics/interface';
import { IVector3 } from '@/type';

/** wrapper of PhysX.PxRigidStatic */
export class PxPhysicsStaticRigidBody extends PxPhysicsRigidBody implements IStaticRigidBody {
  _pxRigidBody: PhysX.PxRigidStatic;

  constructor(
    px: typeof PhysX & typeof PhysX.PxTopLevelFunctions,
    pxPhysics: PhysX.PxPhysics,
    position: IVector3,
    rotation: Quaternion
  ) {
    super(px);

    const pos = new px.PxVec3(position.x, position.y, position.z);
    const rot = new px.PxQuat(rotation.x, rotation.y, rotation.z, rotation.w);
    const pose = new px.PxTransform(pos, rot);
    const rigidBody = pxPhysics.createRigidStatic(pose);

    this._pxRigidBody = rigidBody;
  }
}
