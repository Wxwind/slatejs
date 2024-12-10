import { Component, PlaneCollider, THREE } from '@/index';
import { ColliderObj } from './ColliderObj';

export class PlaneColliderObj extends ColliderObj {
  _collider: PlaneCollider = new PlaneCollider();

  private _geo: THREE.PlaneGeometry = new THREE.PlaneGeometry();
  private _mesh: THREE.LineSegments = new THREE.LineSegments();

  constructor(comp: Component) {
    super(comp);
    this._comp.sceneObject.add(this);
    this._renderSceneObject();
  }

  private _renderSceneObject() {
    this._geo = new THREE.PlaneGeometry(1000, 1000);
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
