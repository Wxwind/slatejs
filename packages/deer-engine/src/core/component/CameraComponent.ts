import { Vector3 } from 'three';
import { Component } from './Component';

import { accessor, egclass, property } from '../decorator';
import { FVector3 } from '@/math';
import { CameraComponentJson } from './type';

@egclass()
export class CameraComponent extends Component {
  type = 'CameraComponent' as const;

  @property({ type: Number })
  fov = 90;

  @property({ type: Number })
  near = 0.1;

  @property({ type: Number })
  far = 1000;

  @accessor({ type: FVector3 })
  public get position(): Vector3 {
    return this.sceneObject.position;
  }

  @accessor({ type: FVector3 })
  public set position(v: Vector3) {
    this.sceneObject.position.set(v.x, v.y, v.z);
    this.signals.componentUpdated.emit();
  }

  @accessor({ type: FVector3 })
  public get rotation(): Vector3 {
    return new Vector3(this.sceneObject.rotation.x, this.sceneObject.rotation.y, this.sceneObject.rotation.z);
  }

  @accessor({ type: FVector3 })
  public set rotation(v: Vector3) {
    this.sceneObject.rotation.set(v.x, v.y, v.z);
    this.signals.componentUpdated.emit();
  }

  @accessor({ type: FVector3 })
  public get scale(): Vector3 {
    return this.sceneObject.scale;
  }

  @accessor({ type: FVector3 })
  public set scale(v: Vector3) {
    this.sceneObject.scale.set(v.x, v.y, v.z);
    this.signals.componentUpdated.emit();
  }

  updateByJson(data: CameraComponentJson, sync: boolean) {
    this.position.set(data.position.x, data.position.y, data.position.z);
    this.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
    this.scale.set(data.scale.x, data.scale.y, data.scale.z);
    this.signals.componentUpdated.emit();
  }

  onSerialize: () => CameraComponentJson = () => {
    return {
      position: this.position.clone(),
      rotation: this.rotation.clone(),
      scale: this.scale.clone(),
      fov: this.fov,
      near: this.near,
      far: this.far,
    };
  };

  onDeserialize: (data: CameraComponentJson) => void = (data) => {
    this.position.set(data.position.x, data.position.y, data.position.z);
    this.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
    this.scale.set(data.scale.x, data.scale.y, data.scale.z);
  };
}
