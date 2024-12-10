import { RigidbodyComponent } from '../RigidbodyComponent';

import { PhysicsMaterial as PhysicsMaterial } from '../PhysicsMaterial';
import { ICollider } from '../interface';
import { IVector3 } from '@/type';
import { Quaternion, Vector3 } from 'three';

export abstract class Collider {
  abstract _nativeCollider: ICollider;
  _id: number;

  private static _idGenerator = 0;

  protected _material: PhysicsMaterial;

  private _isTrigger: boolean = false;
  public get isTrigger(): boolean {
    return this._isTrigger;
  }
  public set isTrigger(v: boolean) {
    this._isTrigger = v;
    this._nativeCollider.setIsTrigger(v);
  }

  private _position: Vector3 = new Vector3();
  public get position(): Vector3 {
    return this._position;
  }
  public set position(v: Vector3) {
    this._position = v;
    this._nativeCollider.setPosition(v);
  }

  private _rotation: Quaternion = new Quaternion();
  public get rotation(): Quaternion {
    return this._rotation;
  }
  public set rotation(v: Quaternion) {
    this._rotation = v;
    this._nativeCollider.setRotation(v);
  }

  public set worldScale(v: IVector3) {
    this._nativeCollider.setWorldScale(v);
  }

  /** @readonly */
  _attachedRigidbody: RigidbodyComponent | null = null;

  constructor() {
    this._id = Collider._idGenerator++;
    this._material = new PhysicsMaterial();
  }

  destroy() {
    this._material.destroy();
    this._nativeCollider.destroy();
  }
}
