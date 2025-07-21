import { Collider, Component, THREE } from 'deer-engine';
import { meshMaterialSettings } from '../collider-editor/constants';

export abstract class ColliderObj extends THREE.Object3D {
  protected _worldScale = new THREE.Vector3();

  protected _comp: Component;
  abstract _collider: Collider;

  public get isTrigger(): boolean {
    return this._collider.isTrigger;
  }
  public set isTrigger(v: boolean) {
    this._collider.isTrigger = v;
  }

  userId: string;

  private _material: THREE.MeshPhongMaterial;

  get material() {
    return this._material;
  }

  get comp() {
    return this._comp;
  }

  constructor(comp: Component, userId: string) {
    super();
    this._comp = comp;
    this.userId = userId;
    const material = new THREE.MeshPhongMaterial(meshMaterialSettings);
    this._material = material;
  }

  protected abstract onTransformUpdated(): void;

  _setLocalPose() {
    const scale = this.getWorldScale(this._worldScale);
    const position = this.position;
    const quaternion = this.quaternion;
    console.log(
      `collider obj's world position: ${JSON.stringify(position)}, world rotation: ${JSON.stringify(
        scale
      )} world scale: ${JSON.stringify(scale)}`
    );
    this._collider.position = position;
    this._collider.rotation = quaternion;
    this._collider._nativeCollider.setWorldScale(scale);
    this.onTransformUpdated();
  }

  destroy() {
    return this._collider.destroy();
  }
}
