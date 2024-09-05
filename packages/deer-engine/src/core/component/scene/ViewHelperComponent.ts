import { WebGLRenderer } from 'three';
import { ComponentBase } from '../ComponentBase';
import { ViewHelperComponentJson } from '../type';
import { egclass } from '../../decorator';
import { ViewHelper } from 'three/examples/jsm/helpers/ViewHelper.js';

@egclass()
export class ViewHelperComponent extends ComponentBase<'ViewHelperComponent'> {
  type = 'ViewHelperComponent' as const;

  public get isCanBeRemoved(): boolean {
    return false;
  }

  private viewHelper: ViewHelper | undefined;

  onAwake = () => {
    const deerScene = this.scene;
    if (deerScene.mode !== 'editor') return;
    const container = this.scene.parentEl;
    this.viewHelper = new ViewHelper(this.scene.mainCamera, container);
  };

  render = (renderer: WebGLRenderer) => {
    this.viewHelper?.render(renderer);
  };

  onDestroy: () => void = () => {
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
