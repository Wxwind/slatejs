import { isNil } from '@/util';
import { Cutscene } from './Cutscene';
import { CutsceneDataStore, SelectedIDirectableStore } from '@/store';
import { ClipType, CreateActionClipDto, TrackType, UpdateActionClipDto } from './type';
import { ActionClip } from './ActionClip';
import { deerEngine } from 'deer-engine';

export class ApiCenter {
  private cutsceneDataStore: CutsceneDataStore;
  private selectedIDirectableStore: SelectedIDirectableStore;

  constructor(public cutscene: Cutscene) {
    this.cutsceneDataStore = cutscene.cutsceneDataStore;
    this.selectedIDirectableStore = cutscene.selectedIDirectableStore;
  }

  // IDirectable
  addClip = (groupId: string, trackId: string, clipType: ClipType, clipOptions: Omit<CreateActionClipDto, 'keys'>) => {
    this.cutscene.director.findTrack(groupId, trackId)?.addClip(clipType, clipOptions);
    this.cutsceneDataStore.refreshData();
  };

  updateClip = <T extends ClipType = ClipType>(
    groupId: string,
    trackId: string,
    clipId: string,
    type: T, // used to validate clip type
    updateDataDto: UpdateActionClipDto<T>
  ) => {
    const clip = this.cutscene.director.findClip(groupId, trackId, clipId);
    if (isNil(clip)) return;

    if (clip.type === type) {
      clip.updateData(updateDataDto);
    }
    this.cutsceneDataStore.refreshData();
  };

  removeClip = (groupId: string, trackId: string, clipId: string) => {
    this.cutscene.director.findTrack(groupId, trackId)?.removeClip(clipId);
    this.cutsceneDataStore.refreshData();
  };

  addGroup = (entityId: string) => {
    const entity = deerEngine.activeScene?.entityManager.findEntityById(entityId);
    if (isNil(entity)) return;

    const group = this.cutscene.director.addGroup('Actor');
    if (isNil(group)) return;

    group.actor = entity;
    this.cutsceneDataStore.refreshData();
  };

  removeGroup = (entityId: string) => {
    this.cutscene.director.removeGroup(entityId);
    this.cutsceneDataStore.refreshData();
  };

  addTrack = (entityId: string, type: TrackType) => {
    const group = this.cutscene.director.findGroup(entityId);
    if (isNil(group)) return;

    group.addTrack(type);
    this.cutsceneDataStore.refreshData();
  };

  selectIDirectable = (groupId: string | undefined, trackId?: string, clipId?: string) => {
    this.cutscene.selectObject(groupId, trackId, clipId);
    this.selectedIDirectableStore.refreshData();
  };

  // playsetteings

  // save and load
  export = () => {
    this.cutscene.director.toJson();
  };

  import = (json: string) => {
    this.cutscene.director.parseJson(json);
  };
}
