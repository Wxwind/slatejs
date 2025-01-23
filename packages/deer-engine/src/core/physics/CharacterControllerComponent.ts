import { Entity } from '../entity';
import { IVector3 } from '@/type';
import { RigidbodyComponent } from './RigidbodyComponent';
import { ICharacterController } from './interface';
import { objectToLocalPosition } from '@/util';
import { Vector3 } from 'three';
import { PhysicsControllerNonWalkableModeEnum } from './enum';
import { Collider } from './collider';

export class CharacterControllerComponent extends RigidbodyComponent {
  public type = 'CharacterControllerComponent' as const;

  _nativeRigidbody: ICharacterController;
  private _tempPosition = new Vector3();

  private _radius: number = 1;
  public get radius(): number {
    return this._radius;
  }
  public set radius(v: number) {
    this._radius = v;
    this._nativeRigidbody.setRadius(v);
  }

  private _height: number = 2;
  public get height(): number {
    return this._height;
  }
  public set height(v: number) {
    this._height = v;
    this._nativeRigidbody.setHeight(v);
  }

  private _slopeLimit: number = 0.707;
  public get slopeLimit(): number {
    return this._slopeLimit;
  }
  public set slopeLimit(v: number) {
    this._slopeLimit = v;
    this._nativeRigidbody.setSlopeLimit(v);
  }

  private _stepOffset: number = 0.5;
  public get stepOffset(): number {
    return this._stepOffset;
  }
  public set stepOffset(v: number) {
    this._stepOffset = v;
    this._nativeRigidbody.setStepOffset(v);
  }

  private _upDirection: IVector3 = { x: 0, y: 1, z: 0 };
  public get upDirection(): IVector3 {
    return this._upDirection;
  }
  public set upDirection(v: IVector3) {
    this._upDirection = v;
    this._nativeRigidbody.setUpDirection(v);
  }

  private _nonWalkableMode: PhysicsControllerNonWalkableModeEnum =
    PhysicsControllerNonWalkableModeEnum.PREVENT_CLIMBING;
  public get nonWalkableMode(): PhysicsControllerNonWalkableModeEnum {
    return this._nonWalkableMode;
  }
  public set nonWalkableMode(v: PhysicsControllerNonWalkableModeEnum) {
    this._nonWalkableMode = v;
    this._nativeRigidbody.setNonWalkableMode(v);
  }

  constructor(entity: Entity) {
    super(entity);
    this._nativeRigidbody = this.scene.physicsScene._nativePhysicsScene.createCharacterController(this._id);
  }

  override _onEnable(): void {
    const physics = this.scene.physicsScene;
    physics._addCharacterController(this);
  }

  override _onDisable(): void {
    const physics = this.scene.physicsScene;
    physics._removeCharacterController(this);
  }

  _tempVec3 = new Vector3();
  override _onColliderUpdate(): void {
    if (this.entity.transform._updateFlag) {
      const obj = this.sceneObject;

      this._nativeRigidbody.setWorldPosition(obj.position);
      const scale = obj.getWorldScale(this._tempVec3);
      for (const collider of this._colliders) {
        collider._nativeCollider.setWorldScale(scale);
      }
      this.entity.transform._updateFlag = false;
    }
  }

  override _onColliderLateUpdate(): void {
    this._syncWorldPositionFromPhysicalPosition();
    this.entity.transform._updateFlag = false;
  }

  override addCollider(collider: Collider): void {
    super.addCollider(collider);
    this.scene.physicsScene._onColliderAdd;
  }

  override removeCollider(collider: Collider): void {}

  move(disp: IVector3, minDist: number, elapsedTime: number) {
    const flag = this._nativeRigidbody.move(disp, minDist, elapsedTime);
    //  this._syncWorldPositionFromPhysicalPosition();
    return flag;
  }

  private _syncWorldPositionFromPhysicalPosition() {
    const obj = this.entity.sceneObject;

    this._nativeRigidbody.getWorldPosition(this._tempPosition);
    const pos = objectToLocalPosition(obj, this._tempPosition);

    this.entity.transform.position = pos;
  }

  updateByJson(data: any, sync: boolean): void {}
  onSerialize() {}
  onDeserialize(data: any): void {}
}
