import { Entity } from '../entity';
import { IVector3 } from '@/type';
import { RigidbodyComponent } from './RigidbodyComponent';
import { ICharacterController } from './interface';
import { objectToLocalPosition } from '@/util';
import { Vector3 } from 'three';

export class CharacterControllerComponent extends RigidbodyComponent {
  public type = 'CharacterControllerComponent' as const;

  _nativeRigidbody: ICharacterController;
  private _tempPosition = new Vector3();

  constructor(entity: Entity) {
    super(entity);
    this._nativeRigidbody = this.scene.physicsScene._nativePhysicsScene.createCharacterController();
  }

  override _onEnable(): void {
    const physics = this.scene.physicsScene;
    physics._addCharacterController(this);
  }

  override _onDisable(): void {
    const physics = this.scene.physicsScene;
    physics._removeCharacterController(this);
  }

  override _onColliderUpdate(): void {
    if (this.entity.transform._updateFlag) {
      const obj = this.sceneObject;
      this._nativeRigidbody.setWorldPosition(obj.position);
      this.entity.transform._updateFlag = false;
    }
  }

  override _onColliderLateUpdate(): void {
    this._syncWorldPositionFromPhysicalPosition();
    this.entity.transform._updateFlag = false;
  }

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
