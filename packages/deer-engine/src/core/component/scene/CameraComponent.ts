import { PerspectiveCamera, Vector3 } from 'three';
import { ComponentBase } from '../ComponentBase';
import { FVector3, CameraComponentJson } from '../type';
import { accessor, egclass } from '../../decorator';
import { DeerScene } from '../../DeerScene';

@egclass()
export class CameraComponent extends ComponentBase<'CameraComponent'> {
  type = 'CameraComponent' as const;

  public get isCanBeRemoved(): boolean {
    return false;
  }

  private _camera!: PerspectiveCamera;

  public get camera() {
    return this._camera;
  }

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

  constructor() {
    super();
  }

  awake = () => {
    const container = (this.owner as DeerScene).parentEl;
    const camera = new PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 10000);
    camera.position.set(20, 20, 0);

    this._camera = camera;
  };

  resize = (width: number, height: number) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  update: (dt: number) => void = () => {};

  destroy: () => void = () => {};

  updateByJson: (data: CameraComponentJson) => void = (data) => {
    this._camera.position.set(data.position.x, data.position.y, data.position.z);
    this._camera.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
    this._camera.scale.set(data.scale.x, data.scale.y, data.scale.z);
    this.signals.componentUpdated.emit();
  };

  onSerialize: () => CameraComponentJson = () => {
    return {
      position: this._camera.position.clone(),
      rotation: this._camera.rotation.clone(),
      scale: this._camera.scale.clone(),
      fov: this._camera.fov,
      near: this._camera.near,
      far: this.camera.far,
    };
  };

  onDeserialize: (data: CameraComponentJson) => void = (data) => {
    this._camera.position.set(data.position.x, data.position.y, data.position.z);
    this._camera.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
    this._camera.scale.set(data.scale.x, data.scale.y, data.scale.z);
  };
}
