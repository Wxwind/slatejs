import { CutScene, AnimationClip, UpdateAnimationDataDto, CutSceneData } from '../core';
import { deepClone, replaceEqualDeep } from '../utils';
import { StoreBase } from './StoreBase';

export class ResoucesStore extends StoreBase<CutSceneData> {
  constructor(private cutScene: CutScene) {
    super();
  }

  private oldData: CutSceneData | undefined;

  addAnimation = (groupId: string, trackId: string, anim: AnimationClip) => {
    this.cutScene.timeline.addClip(groupId, trackId, anim);
    this.refreshData();
  };

  updateAnimation = (id: string, anim: UpdateAnimationDataDto) => {
    this.cutScene.timeline.updateClip(id, anim);
    this.refreshData();
  };

  removeAnimation = (anim: AnimationClip) => {
    this.cutScene.timeline.removeClip(anim);
    this.refreshData();
  };

  protected refreshData = () => {
    const newData = deepClone(this.cutScene.timeline.toJsonObject());
    const resData = replaceEqualDeep(this.oldData, newData);
    this.oldData = this.data;
    this.data = resData;
    this.emit();
  };
}
