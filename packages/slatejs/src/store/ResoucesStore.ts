import { Cutscene, AnimationClip, UpdateAnimationDataDto, CutsceneData, ClipType, ActionClip } from '../core';
import { deepClone, isNil, replaceEqualDeep } from '../utils';
import { StoreBase } from './StoreBase';

export class CutsceneDataStore extends StoreBase<CutsceneData> {
  constructor(private cutscene: Cutscene) {
    super();
  }

  private oldData: CutsceneData | undefined;

  addClip = (groupId: string, trackId: string, clipType: ClipType) => {
    this.cutscene.director.findTrack(groupId, trackId)?.addClip(clipType);
    this.refreshData();
  };

  updateClip = <T extends ActionClip = ActionClip>(
    groupId: string,
    trackId: string,
    clipId: string,
    updateDataDto: Partial<Omit<T['data'], 'id'>>
  ) => {
    const clip = this.cutscene.director.findClip(groupId, trackId, clipId);
    if (isNil(clip)) return;

    clip.data = { ...updateDataDto, ...clip.data };
    this.refreshData();
  };

  removeClip = (groupId: string, trackId: string, clipId: string) => {
    this.cutscene.director.findTrack(groupId, trackId)?.removeClip(clipId);
    this.refreshData();
  };

  protected refreshData = () => {
    const newData = deepClone(this.cutscene.director.toJsonObject());
    const resData = replaceEqualDeep(this.oldData, newData);
    this.oldData = this.data;
    this.data = resData;
    this.emit();
  };
}
