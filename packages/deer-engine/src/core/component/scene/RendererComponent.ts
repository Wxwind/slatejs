import { WebGLRenderer } from 'three';
import { ComponentBase } from '../ComponentBase';
import { RendererComponentJson } from '../type';
import { egclass } from '../../decorator';
import { DeerScene } from '../../DeerScene';
import { CameraComponent } from '.';
import { isNil } from 'lodash';
import { ViewHelperComponent } from './ViewHelperComponent';

@egclass()
export class RendererComponent extends ComponentBase<'RendererComponent'> {
  type = 'RendererComponent' as const;

  public get isCanBeRemoved(): boolean {
    return false;
  }

  private _renderer!: WebGLRenderer;

  public get renderer() {
    return this._renderer;
  }

  constructor() {
    super();
  }

  awake = () => {
    const scene = this.owner as DeerScene;
    const container = scene.parentEl;

    const renderer = new WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    this._renderer = renderer;
  };

  update = (dt: number) => {
    const deerScene = this.owner as DeerScene;
    const cameraComp = deerScene.findComponentByType<CameraComponent>('CameraComponent');
    if (isNil(cameraComp)) {
      throw new Error('RendererComponent initialize failed: Camera component is invalid');
    }
    this._renderer.clear();
    this._renderer.render(deerScene.scene, cameraComp.camera);

    const viewHelperComponent = deerScene.findComponentByType<ViewHelperComponent>('ViewHelperComponent');
    if (!isNil(viewHelperComponent)) {
      this._renderer.autoClear = false;
      viewHelperComponent.render(this._renderer);
      this._renderer.autoClear = true;
    }
  };

  resize = (width: number, height: number) => {};

  destory: () => void = () => {
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    const scene = this.owner as DeerScene;
    const container = scene.parentEl;
    container.removeChild(this.renderer.domElement);
  };

  updateByJson: (data: RendererComponentJson) => void = (data) => {
    this.signals.componentUpdated.emit();
  };

  onSerialize: () => RendererComponentJson = () => {
    return {};
  };

  onDeserialize: (data: RendererComponentJson) => void = (data) => {};
}
