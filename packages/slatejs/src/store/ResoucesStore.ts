import { ActionClipJson, CutScene, AnimationClip, AnimationUpdatedJson } from '../core';
import { deepClone, replaceEqualDeep } from '../utils';
import { StoreBase } from './StoreBase';

export class ResoucesStore extends StoreBase<ActionClipJson[]> {
  constructor(private cutScene: CutScene) {
    super();
  }

  private oldData: ActionClipJson[] | undefined;

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
    const newData = this.cutScene.timeline.groups.map((a) => deepClone(a));
    const resData = replaceEqualDeep(this.oldData, newData);
    this.oldData = this.data;
    this.data = resData;
    this.emit();
  };
}
