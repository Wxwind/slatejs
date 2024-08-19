import { ComponentBase } from '../ComponentBase';
import { RendererComponentJson } from '../type';
import { egclass } from '../../decorator';
import { CameraComponent, RendererComponent } from '.';
import { isNil } from 'lodash';
import { Control } from '@/core/Control';

@egclass()
export class ControlComponent extends ComponentBase<'ControlComponent'> {
  type = 'ControlComponent' as const;

  public get isCanBeRemoved(): boolean {
    return false;
  }

  private _control!: Control;

  public get control() {
    return this._control;
  }

  awake = () => {
    const cameraComp = this._owner.findComponentByType<CameraComponent>('CameraComponent');
    if (isNil(cameraComp)) {
      throw new Error('ControlComponent initialize failed, Camera Component is invalid.');
    }

    const rendererComp = this._owner.findComponentByType<RendererComponent>('RendererComponent');
    if (isNil(rendererComp)) {
      throw new Error('ControlComponent initialize failed, Camera Component is invalid.');
    }

    const controls = new Control(cameraComp.camera, rendererComp.renderer.domElement);
    this._control = controls;
  };

  update = (dt: number) => {
    this._control.update(dt);
  };

  destroy: () => void = () => {};

  updateByJson: (data: RendererComponentJson) => void = (data) => {
    this.signals.componentUpdated.emit();
  };

  onSerialize: () => RendererComponentJson = () => {
    return {};
  };

  onDeserialize: (data: RendererComponentJson) => void = (data) => {};
}
