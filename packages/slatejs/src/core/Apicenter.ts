import { isNil } from '@/util';
import { Cutscene } from './Cutscene';
import { CutsceneDataStore, SelectedIDirectableStore } from '@/store';
import { ClipType, TrackType } from './type';
import { ActionClip } from './ActionClip';
import { deerEngine } from 'deer-engine';

export class ApiCenter {
  private cutsceneDataStore: CutsceneDataStore;
  private selectedIDirectableStore: SelectedIDirectableStore;

  constructor(public cutscene: Cutscene) {
    this.cutsceneDataStore = cutscene.cutsceneDataStore;
    this.selectedIDirectableStore = cutscene.selectedIDirectableStore;
  }

  addClip = (groupId: string, trackId: string, clipType: ClipType) => {
    this.cutscene.director.findTrack(groupId, trackId)?.addClip(clipType);
    this.cutsceneDataStore.refreshData();
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
}
