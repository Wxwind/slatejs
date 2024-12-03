import { ComponentBase } from '../component';
import { Collider } from './collider';
import { Quaternion, Vector3 } from 'three';
import { IRigidbody } from './interface';

export abstract class RigidbodyComponent extends ComponentBase<any> {
  abstract _nativeRigidbody: IRigidbody;

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
    if (this.entity.transform._updateFlag) {
      const obj = this.sceneObject;
      this._nativeRigidbody.setWorldTransform(obj.position, obj.quaternion);
      this.entity.transform._updateFlag = false;
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
    this._nativeRigidbody.getWorldTransform(outPosition, outRotation);
  }

  setTransform(position: Vector3, rotation: Quaternion): void {
    this._nativeRigidbody.setWorldTransform(position, rotation);
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
