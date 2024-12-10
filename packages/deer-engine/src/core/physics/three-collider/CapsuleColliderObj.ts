import { CapsuleCollider, Component, THREE } from '@/index';
import { ColliderObj } from './ColliderObj';

export class CapsuleColliderObj extends ColliderObj {
  _collider: CapsuleCollider = new CapsuleCollider();

  private _geo: THREE.CapsuleGeometry = new THREE.CapsuleGeometry();
  private _mesh: THREE.LineSegments = new THREE.LineSegments();

  constructor(comp: Component) {
    super(comp);
    this._comp.sceneObject.add(this);
    this._renderSceneObject();
  }

  public get radius(): number {
    return this._collider.radius;
  }
  public set radius(v: number) {
    this._collider.radius = v;
    this._renderSceneObject();
  }

  public get height(): number {
    return this._collider.height;
  }
  public set height(v: number) {
    this._collider.height = v;
    this._renderSceneObject();
  }

  private _renderSceneObject() {
    this._geo = new THREE.CapsuleGeometry(this.radius, this.height);
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
