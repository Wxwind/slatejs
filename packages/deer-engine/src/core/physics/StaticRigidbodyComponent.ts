import { PhysicsScene } from './PhysicsScene';
import { Entity } from '../entity';
import { RigidbodyComponent } from './RigidbodyComponent';
import { IStaticRigidBody } from './interface';
import { Quaternion, Vector3 } from 'three';

export class StaticRigidbodyComponent extends RigidbodyComponent {
  type = 'StaticRigidbodyComponent' as const;

  _nativeRigidbody: IStaticRigidBody;

  constructor(entity: Entity) {
    super(entity);

    this._nativeRigidbody = PhysicsScene._nativePhysics.createStaticRigidBody(
      this.sceneObject.getWorldPosition(new Vector3()),
      this.sceneObject.getWorldQuaternion(new Quaternion())
    );
  }

  updateByJson(data: any, sync: boolean): void {}

  onSerialize() {}

  onDeserialize(data: any): void {}
}
