import { ComponentBase } from '../component';
import { PxPhysicsRigidBody } from '../../module/physics/PxPhysicsRigidBody';
import { Collider } from './collider';
import { Quaternion, Vector3 } from 'three';

export abstract class RigidbodyComponent extends ComponentBase<any> {
  abstract _nativeRigidbody: PxPhysicsRigidBody;

  protected _colliders: Collider[] = [];

  /** @internal */
  _index = -1;

  override _onEnable(): void {
    const physics = this.scene.physicsScene;
    physics._addRigidbody(this);
  }

  override _onDisable(): void {
    const physics = this.scene.physicsScene;
    physics._removeRigidbody(this);
  }

  /** copy real scene to physical scene */
  _onColliderUpdate() {
    if (this._entity.transform._updateFlag) {
      const obj = this.sceneObject;
      this._nativeRigidbody.setTransform(obj.position, obj.quaternion);
      this._entity.transform._updateFlag = false;
    }
  }

  /** copy physical scene to real scene */
  _onColliderLateUpdate() {}

  addCollider(collider: Collider) {
    const rb = collider._attachedRigidbody;
    if (rb === this) return;

    if (rb) {
      rb.removeCollider(collider);
    }

    this._colliders.push(collider);
    collider._attachedRigidbody = this;
    this._nativeRigidbody.addCollider(collider._nativeCollider);
  }

  removeCollider(collider: Collider) {
    const index = this._colliders.indexOf(collider);
    if (index === -1) return;

    this._colliders.splice(index, 1);
    collider._attachedRigidbody = null;
    this._nativeRigidbody.removeCollider(collider._nativeCollider);
  }

  getTransform(outPosition: Vector3, outRotation: Quaternion): void {
    this._nativeRigidbody.getTransform(outPosition, outRotation);
  }

  setTransform(position: Vector3, rotation: Quaternion): void {
    this._nativeRigidbody.setTransform(position, rotation);
  }

  removeAllShapes() {
    for (let i = 0; i < this._colliders.length; i++) {
      const collider = this._colliders[i];
      collider.destroy();
      this._nativeRigidbody.removeCollider(collider._nativeCollider);
    }
    this._colliders.length = 0;
  }

  override _onDestroy() {
    this.removeAllShapes();
    this._nativeRigidbody.destroy();
  }
}
