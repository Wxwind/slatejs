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

    this._nativeRigidbody = PhysicsScene._nativePhysics.createDynamicRigidBody(
      this.sceneObject.position,
      this.sceneObject.quaternion
    );
  }

  _tempPosition = new Vector3();
  _tempRotation = new Quaternion();

  private _mass: number = 1.0;
  public get mass(): number {
    return this._mass;
  }
  public set mass(v: number) {
    this._nativeRigidbody.setMass(v);
    this._mass = v;
  }

  override _onColliderLateUpdate(): void {
    const obj = this.entity.sceneObject;

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
