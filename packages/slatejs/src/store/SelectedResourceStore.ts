import { CutScene } from '../core';
import { AnimationClip, ResourceClipBase, ResourceJson } from '../core/resourceClip';
import { deepClone } from '../utils';
import { StoreBase } from './StoreBase';

export class SelectedResouceStore extends StoreBase<ResourceJson> {
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
