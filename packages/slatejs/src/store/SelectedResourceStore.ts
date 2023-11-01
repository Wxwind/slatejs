import { CutScene } from '../core';
import { AnimationClip, ActionClip, ActionClipJson } from '../core/actionClip';
import { deepClone } from '../utils';
import { StoreBase } from './StoreBase';

export class SelectedResouceStore extends StoreBase<ActionClipJson> {
  constructor(private cutScene: CutScene) {
    super();
  }

  selectResourceClip = (id: string) => {
    this.cutScene.selectAnimation(id);
    this.refreshData();
  };

  protected refreshData = () => {
    this.data = deepClone(this.cutScene.selectedAnim?.data);
    this.emit();
  };
}
