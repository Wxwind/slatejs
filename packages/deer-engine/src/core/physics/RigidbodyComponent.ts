import { ComponentBase } from '../component';
import { Collider } from './collider';
import { Quaternion, Vector3 } from 'three';
import { IRigidbody } from './interface';
import { Entity } from '../entity';

export abstract class RigidbodyComponent extends ComponentBase<any> {
  abstract _nativeRigidbody: IRigidbody;

  readonly _colliders: Collider[] = [];

  /** @internal */
  _index = -1;

  constructor(entity: Entity) {
    super(entity);
  }

  override _onEnable(): void {
    const physics = this.scene.physicsScene;
    physics._addRigidbody(this);
  }

  override _onDisable(): void {
    const physics = this.scene.physicsScene;
    physics._removeRigidbody(this);
  }

  _tempVec3 = new Vector3();

  /** copy real scene to physical scene */
  _onColliderUpdate() {
    if (this.entity.transform._updateFlag) {
      const obj = this.sceneObject;
      this._nativeRigidbody.setWorldTransform(obj.position, obj.quaternion);
      const scale = obj.getWorldScale(this._tempVec3);
      for (const collider of this._colliders) {
        collider._nativeCollider.setWorldScale(scale);
      }
      this.entity.transform._updateFlag = false;
    }
  }

  /** copy physical scene to real scene */
  _onColliderLateUpdate() {}

  addCollider(collider: Collider) {
    const rb = collider.rigidbody;
    if (rb === this) return;

    if (rb) {
      rb.removeCollider(collider);
    }

    this._colliders.push(collider);
    collider._rigidbody = this;
    this._nativeRigidbody.addCollider(collider._nativeCollider);
    this._active && this.scene.physicsScene._onColliderAdd(collider);
  }

  removeCollider(collider: Collider) {
    const index = this._colliders.indexOf(collider);
    if (index === -1) return;

    this._colliders.splice(index, 1);
    collider._rigidbody = null;
    this._nativeRigidbody.removeCollider(collider._nativeCollider);
    this._active && this.scene.physicsScene._onColliderRemove(collider);
  }

  getTransform(outPosition: Vector3, outRotation: Quaternion): void {
    this._nativeRigidbody.getWorldTransform(outPosition, outRotation);
  }

  setTransform(position: Vector3, rotation: Quaternion): void {
    this._nativeRigidbody.setWorldTransform(position, rotation);
  }

  removeAllColliders() {
    for (let i = 0; i < this._colliders.length; i++) {
      const collider = this._colliders[i];
      collider.destroy();
      collider._rigidbody = null;
      this._nativeRigidbody.removeCollider(collider._nativeCollider);
      this.scene.physicsScene._onColliderRemove(collider);
    }
    this._colliders.length = 0;
  }

  override _onDestroy() {
    super._onDestroy();
    this.removeAllColliders();
    this._nativeRigidbody.destroy();
  }
}
