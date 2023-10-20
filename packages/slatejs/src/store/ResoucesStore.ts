import { CutScene } from '../core';
import { AnimationClip, ResourceClipBase } from '../core/resourceClip';
import { StoreBase } from './StoreBase';

export class ResoucesStore extends StoreBase<ResourceClipBase[]> {
  constructor(private cutScene: CutScene) {
    super();
  }

  addAnimation = (anim: AnimationClip) => {
    this.cutScene.timeline.addAnimation(anim);
    this.refreshData();
  };

  removeAnimation = (anim: AnimationClip) => {
    this.cutScene.timeline.removeAnimation(anim);
    this.refreshData();
  };

  refreshData = () => {
    this.data = [...this.cutScene.timeline.animations];
    this.emit();
  };
}
