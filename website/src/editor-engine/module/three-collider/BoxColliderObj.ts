import { BoxCollider, Component, IVector3, THREE } from 'deer-engine';
import { ColliderObj } from './ColliderObj';

export class BoxColliderObj extends ColliderObj {
  _collider: BoxCollider = new BoxCollider();

  private _geo: THREE.BoxGeometry = new THREE.BoxGeometry();
  private _mesh: THREE.LineSegments = new THREE.LineSegments();

  constructor(comp: Component, userId: string) {
    super(comp, userId);
    this._comp.sceneObject.add(this);
    this._renderSceneObject();
  }

  public get size(): IVector3 {
    return this._collider.size;
  }
  public set size(v: IVector3) {
    this._collider.size = v;
    this._renderSceneObject();
  }

  private _renderSceneObject() {
    this._geo = new THREE.BoxGeometry(this._collider.size.x, this._collider.size.y, this._collider.size.z);
    const edges = new THREE.EdgesGeometry(this._geo);
    const material = new THREE.LineBasicMaterial({ color: '#FAF65C' });
    this._comp.sceneObject.add(this);

    this.remove(this._mesh);
    this._mesh = new THREE.LineSegments(edges, material);
    this.add(this._mesh);
  }

  protected onTransformUpdated() {
    this._renderSceneObject();
  }

  destroy() {
    this._comp.sceneObject.remove(this);
    this._collider.destroy();
  }
}
