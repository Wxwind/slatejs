import { WebGLRenderer } from 'three';
import { ComponentBase } from '../ComponentBase';
import { ViewHelperComponentJson } from '../type';
import { egclass } from '../../decorator';
import { DeerScene } from '../../DeerScene';
import { ViewHelper } from 'three/examples/jsm/helpers/ViewHelper.js';
import { CameraComponent } from '.';
import { isNil } from '@/util';

@egclass()
export class ViewHelperComponent extends ComponentBase<'ViewHelperComponent'> {
  type = 'ViewHelperComponent' as const;

  public get isCanBeRemoved(): boolean {
    return false;
  }

  private viewHelper: ViewHelper | undefined;

  awake = () => {
    const deerScene = this.owner as DeerScene;
    if (deerScene.mode !== 'editor') return;
    const container = (this.owner as DeerScene).parentEl;
    const cameraComp = this._owner.findComponentByType<CameraComponent>('CameraComponent');
    if (isNil(cameraComp)) {
      throw new Error('ViewHelperComponent initialize failed, Camera Component is invalid.');
    }
    this.viewHelper = new ViewHelper(cameraComp.camera, container);
  };

  constructor() {
    super();
  }

  render = (renderer: WebGLRenderer) => {
    this.viewHelper?.render(renderer);
  };

  update: (dt: number) => void = () => {};

  destroy: () => void = () => {
    this.viewHelper?.dispose();
  };

  updateByJson: (data: ViewHelperComponentJson) => void = (data) => {
    this.signals.componentUpdated.emit();
  };

  onSerialize: () => ViewHelperComponentJson = () => {
    return {};
  };

  onDeserialize: (data: ViewHelperComponentJson) => void = (data) => {};
}
