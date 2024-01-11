import { PlayState, Cutscene } from './Cutscene';
import { Signal } from '@/packages/signal';
import { IDirectable } from './IDirectable';
import { isNil } from '@/util';

export class CutsceneEditor {
  // bridge between cutscene core and cutscene ui.
  // TODO: may replace with external store.
  readonly signals = {
    editorCleared: new Signal(),

    // events
    groupChanged: new Signal(),
  };

  readonly director = new Cutscene();

  private prevTime = 0;

  // export to SelectedResouceStore
  selectedObject: IDirectable | undefined;

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
    this.prevTime = time;
    requestAnimationFrame(this.animate);
  };

  isPlaying = () => {
    return this.director.playState;
  };

  play = () => {
    this.director.play();
  };

  playReverse = () => {
    this.director.playReverse();
  };

  pause = () => {
    this.director.pause();
  };

  stop = () => {
    this.director.stop();
  };

  setTime = (time: number) => {
    this.director.currentTime = time;
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

export const cutsceneEditor = new CutsceneEditor();
