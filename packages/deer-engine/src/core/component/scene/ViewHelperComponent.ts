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
    this.viewHelper = new ViewHelper(this._owner.root?.mainCamera, container);
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
