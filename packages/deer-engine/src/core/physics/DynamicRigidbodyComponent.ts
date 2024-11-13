import { IVector3 } from '@/type';
import { PhysicsScene } from './PhysicsScene';
import { Entity } from '../entity';
import { PxPhysicsDynamicRigidBody } from '../../module/physics/PxPhysicsDynamicRigidBody';
import { RigidbodyComponent } from './RigidbodyComponent';
import { Vector3, Quaternion } from 'three';
import { objectToLocalPosition, objectToLocalQuaternion } from '@/util';

export class DynamicRigidbodyComponent extends RigidbodyComponent {
  type = 'DynamicRigidbodyComponent' as const;

  _nativeRigidbody: PxPhysicsDynamicRigidBody;

  constructor(entity: Entity) {
    super(entity);

    this._nativeRigidbody = PhysicsScene._physics.createDynamicRigidBody(
      this.sceneObject.position,
      this.sceneObject.quaternion
    );
  }

  _tempPosition = new Vector3();
  _tempRotation = new Quaternion();

  override _onColliderLateUpdate(): void {
    const obj = this._entity.sceneObject;

    this.getTransform(this._tempPosition, this._tempRotation);
    const pos = objectToLocalPosition(obj, this._tempPosition);
    const rot = objectToLocalQuaternion(obj, this._tempRotation);
    this.entity.transform.position = pos;
    this.entity.transform.quaternion = rot;
    this.entity.transform._updateFlag = false;
  }

  addForce(force: IVector3) {
    this._nativeRigidbody.addForce(force);
  }

  addTorque(torque: IVector3) {
    this._nativeRigidbody.addTorque(torque);
  }

  _onDestroy(): void {
    this._nativeRigidbody.destroy();
  }

  updateByJson(data: any, sync: boolean): void {}

  onSerialize() {}

  onDeserialize(data: any): void {}
}
