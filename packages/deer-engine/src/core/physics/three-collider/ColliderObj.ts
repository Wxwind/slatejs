import { Collider, Component, THREE } from '@/index';
import { Object3D } from 'three';

export abstract class ColliderObj extends Object3D {
  protected _worldScale = new THREE.Vector3();
  protected _worldPosition = new THREE.Vector3();
  protected _worldQuaternion = new THREE.Quaternion();

  protected _comp: Component;
  abstract _collider: Collider;

  public get isTrigger(): boolean {
    return this._collider.isTrigger;
  }
  public set isTrigger(v: boolean) {
    this._collider.isTrigger = v;
  }

  constructor(comp: Component) {
    super();
    this._comp = comp;
  }

  protected abstract onTransformUpdated(): void;

  _setLocalPose() {
    const scale = this.getWorldScale(this._worldScale);
    const position = this.getWorldPosition(this._worldPosition);
    const quaternion = this.getWorldQuaternion(this._worldQuaternion);
    console.log('碰撞体的世界位置为', JSON.stringify(this.position), '世界缩放为', JSON.stringify(scale));
    this._collider.position = position;
    this._collider.rotation = quaternion;
    this._collider._nativeCollider.setWorldScale(scale);
    this.onTransformUpdated();
  }

  destroy() {
    return this._collider.destroy();
  }
}
