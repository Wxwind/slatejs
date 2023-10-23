import { CutScene } from '../core';
import { AnimationClip, AnimationUpdatedJson, ResourceJson } from '../core/resourceClip';
import { deepClone, replaceEqualDeep } from '../utils';
import { StoreBase } from './StoreBase';

export class ResoucesStore extends StoreBase<ResourceJson[]> {
  constructor(private cutScene: CutScene) {
    super();
  }

  private oldData: ResourceJson[] | undefined;

  addAnimation = (anim: AnimationClip) => {
    this.cutScene.timeline.addAnimation(anim);
    this.refreshData();
  };

  updateAnimation = (id: string, anim: AnimationUpdatedJson) => {
    this.cutScene.timeline.updateAnimation(id, anim);
    this.refreshData();
  };

  removeAnimation = (anim: AnimationClip) => {
    this.cutScene.timeline.removeAnimation(anim);
    this.refreshData();
  };

  protected refreshData = () => {
    const newData = this.cutScene.timeline.animations.map((a) => deepClone(a.data));
    const resData = replaceEqualDeep(this.oldData, newData);
    this.oldData = this.data;
    this.data = resData;
    this.emit();
  };
}
