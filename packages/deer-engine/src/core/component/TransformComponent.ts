import { ComponentBase } from './ComponentBase';
import { accessor, egclass } from '../decorator';
import { FVector3 } from '@/math';
import { TransformComponentJson } from './type';
import { FVector4 } from '@/math/Vector4';
import { IVector3, IVector4 } from '@/type';
import { deg2rad, rad2deg } from '@/util';

@egclass()
export class TransformComponent extends ComponentBase<'TransformComponent'> {
  type = 'TransformComponent' as const;

  _updateFlag = true;

  @accessor({ type: FVector3 })
  public get position(): FVector3 {
    return new FVector3().copyFrom(this.sceneObject.position);
  }

  @accessor({ type: FVector3 })
  public set position(v: IVector3) {
    this.sceneObject.position.set(v.x, v.y, v.z);
    this.signals.componentUpdated.emit();
    this._updateFlag = true;
  }

  @accessor({ type: FVector3 })
  public get rotation(): FVector3 {
    const euler = this.sceneObject.rotation;
    return new FVector3().set(rad2deg(euler.x), rad2deg(euler.y), rad2deg(euler.z));
  }

  @accessor({ type: FVector3 })
  public set rotation(v: IVector3) {
    this.sceneObject.rotation.set(deg2rad(v.x), deg2rad(v.y), deg2rad(v.z));
    this.signals.componentUpdated.emit();
    this._updateFlag = true;
  }

  @accessor({ type: FVector4 })
  public set quaternion(v: IVector4) {
    this.sceneObject.quaternion.set(v.x, v.y, v.z, v.w);
    this.signals.componentUpdated.emit();
    this._updateFlag = true;
  }

  @accessor({ type: FVector4 })
  public get quaternion(): FVector4 {
    return new FVector4().copyFrom(this.sceneObject.quaternion);
  }

  @accessor({ type: FVector3 })
  public get scale(): FVector3 {
    return new FVector3().copyFrom(this.sceneObject.scale);
  }

  @accessor({ type: FVector3 })
  public set scale(v: IVector3) {
    this.sceneObject.scale.set(v.x, v.y, v.z);
    this.signals.componentUpdated.emit();
    this._updateFlag = true;
  }

  _onAwake() {}

  _onEnable() {}

  _onDisable() {}

  update(dt: number) {}

  _onDestroy() {}

  updateByJson(data: TransformComponentJson, sync: boolean) {
    this.sceneObject.position.set(data.position.x, data.position.y, data.position.z);
    this.sceneObject.rotation.set(deg2rad(data.rotation.x), deg2rad(data.rotation.y), deg2rad(data.rotation.z));
    this.sceneObject.scale.set(data.scale.x, data.scale.y, data.scale.z);
    this._updateFlag = true;
    sync && this.signals.componentUpdated.emit();
  }

  onSerialize: () => TransformComponentJson = () => {
    return {
      position: this.sceneObject.position.clone(),
      rotation: {
        x: this.sceneObject.rotation.x,
        y: this.sceneObject.rotation.y,
        z: this.sceneObject.rotation.z,
      },
      scale: this.sceneObject.scale.clone(),
    };
  };

  onDeserialize: (data: TransformComponentJson) => void = (data) => {
    this.sceneObject.position.set(data.position.x, data.position.y, data.position.z);
    this.sceneObject.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
    this.sceneObject.scale.set(data.scale.x, data.scale.y, data.scale.z);
  };
}
