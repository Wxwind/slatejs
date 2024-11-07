import { Vector3 } from 'three';
import { ComponentBase } from './ComponentBase';
import { TransformComponentJson, FVector3 } from './type';
import { accessor, egclass } from '../decorator';

@egclass()
export class TransformComponent extends ComponentBase<'TransformComponent'> {
  type = 'TransformComponent' as const;

  @accessor({ type: FVector3 })
  public get position(): FVector3 {
    return this.sceneObject.position;
  }

  @accessor({ type: FVector3 })
  public set position(v: FVector3) {
    this.sceneObject.position.set(v.x, v.y, v.z);
    this.signals.componentUpdated.emit();
  }

  @accessor({ type: FVector3 })
  public get rotation(): FVector3 {
    return new Vector3(this.sceneObject.rotation.x, this.sceneObject.rotation.y, this.sceneObject.rotation.z);
  }

  @accessor({ type: FVector3 })
  public set rotation(v: FVector3) {
    console.log('set rotation');
    this.sceneObject.rotation.set(v.x, v.y, v.z);
    this.signals.componentUpdated.emit();
  }

  @accessor({ type: FVector3 })
  public get scale(): FVector3 {
    return this.sceneObject.scale;
  }

  @accessor({ type: FVector3 })
  public set scale(v: FVector3) {
    this.sceneObject.scale.set(v.x, v.y, v.z);
    this.signals.componentUpdated.emit();
  }

  _onAwake() {}

  _onEnable() {}

  _onDisable() {}

  update(dt: number) {}

  _onDestroy() {}

  updateByJson(data: TransformComponentJson, sync: boolean) {
    this.sceneObject.position.set(data.position.x, data.position.y, data.position.z);
    this.sceneObject.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
    this.sceneObject.scale.set(data.scale.x, data.scale.y, data.scale.z);
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
