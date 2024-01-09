import { PlayState, CutsceneDirector } from './CutsceneDirector';
import { CutsceneDataStore, SelectedIDirectableStore } from '../store';
import { Signal } from 'deer-engine';
import { IDirectable } from './IDirectable';
import { isNil } from '@/util';

export class Cutscene {
  // bridge between cutscene core and cutscene ui.
  // TODO: may replace with external store.
  readonly signals = {
    editorCleared: new Signal(),

    // events
    playingChanged: new Signal<[boolean]>(),
    timeChanged: new Signal<[number]>(),
    groupChanged: new Signal(),
  };

  readonly director = new CutsceneDirector();

  private prevTime = 0;

  // export to SelectedResouceStore
  selectedObject: IDirectable | undefined;

  // store used only by react, expose internal (= cutscene core) apis and datas (sync data from core to store itself)
  readonly cutsceneDataStore = new CutsceneDataStore(this);
  readonly selectedIDirectableStore = new SelectedIDirectableStore(this);

  public get viewTimeMax(): number {
    return this.director.viewTimeMax;
  }

  constructor() {
    this.init();
  }

  private init = () => {
    const time = performance.now();
    this.prevTime = time;
    this.animate(time);
  };

  private animate = (time: number) => {
    this.director.tick(time - this.prevTime);
    if (this.director.playState !== PlayState.Stop) {
      this.signals.timeChanged.emit(this.director.currentTime);
    }

    this.prevTime = time;
    requestAnimationFrame(this.animate);
  };

  isPlaying = () => {
    return this.director.playState;
  };

  play = () => {
    this.director.play();
    this.signals.playingChanged.emit(true);
  };

  playReverse = () => {
    this.director.playReverse();
    this.signals.playingChanged.emit(true);
  };

  pause = () => {
    this.director.pause();
    this.signals.playingChanged.emit(false);
  };

  stop = () => {
    this.director.stop();
    this.signals.playingChanged.emit(false);
  };

  setTime = (time: number) => {
    this.director.currentTime = time;
    this.signals.timeChanged.emit(this.director.currentTime);
  };

  selectObject = (groupId: string | undefined, trackId?: string, clipId?: string) => {
    // FIXME
    if (isNil(groupId)) {
      this.selectedObject = undefined;
      return;
    }

    const group = this.director.findGroup(groupId);
    if (group === this.selectedObject) return;
    this.selectedObject = group;
    if (isNil(trackId) || isNil(group)) {
      return;
    }

    const track = group.findTrack(trackId);
    if (track === this.selectedObject) return;
    this.selectedObject = track;
    if (isNil(clipId) || isNil(track)) {
      return;
    }

    const clip = track.findClip(clipId);
    if (clip === this.selectedObject) return;
    this.selectedObject = clip;
  };

  toJson = () => {
    return this.director.toJson();
  };

  parseJson = (json: string) => {
    this.director.loadFromJson(json);
  };
}

export const cutscene = new Cutscene();
