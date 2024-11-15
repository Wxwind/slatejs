import { PhysicsScene } from './PhysicsScene';
import { Entity } from '../entity';
import { PxPhysicsStaticRigidBody } from '../../module/physics/PxPhysicsStaticRigidBody';
import { RigidbodyComponent } from './RigidbodyComponent';

export class StaticRigidbodyComponent extends RigidbodyComponent {
  type = 'StaticRigidbodyComponent' as const;

  _nativeRigidbody: PxPhysicsStaticRigidBody;

  constructor(entity: Entity) {
    super(entity);

    this._nativeRigidbody = PhysicsScene._nativePhysics.createStaticRigidBody(
      this.sceneObject.position,
      this.sceneObject.quaternion
    );
  }

  updateByJson(data: any, sync: boolean): void {}

  onSerialize() {}

  onDeserialize(data: any): void {}
}
