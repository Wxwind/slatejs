import { Cutscene } from './Cutscene';
import { Signal } from '@/packages/signal';
import { IDirectable } from './IDirectable';
import { ActionClip } from './ActionClip';
import { PlayState } from './type';

export class CutsceneEditor {
  private _lastStartPlayTime = 0;

  readonly signals = {
    playStateUpdated: new Signal<[PlayState]>(),
    cutSceneEditorSettingsUpdated: new Signal(),
    selectedClipUpdated: new Signal(),
  };

  readonly cutscene = new Cutscene();

  private previousTime = 0;

  // max seconds could be displayed in timeline
  // will be replaced by viewTimeMin and Max if drawn by canvas in future
  // but for now it is almost useless.
  private _viewTimeMax = 500;

  private _selectedClip: ActionClip | undefined;

  public get selectedClip(): ActionClip | undefined {
    return this._selectedClip;
  }

  public set selectedClip(v: ActionClip | undefined) {
    this._selectedClip = v;
    this.signals.selectedClipUpdated.emit();
  }

  private _playState: PlayState = PlayState.Stop;

  public get playState(): PlayState {
    return this._playState;
  }

  public set playState(v: PlayState) {
    this._playState = v;
    this.signals.playStateUpdated.emit(v);
  }

  public get viewTimeMax(): number {
    return this._viewTimeMax;
  }
  public set viewTimeMax(v: number) {
    this._viewTimeMax = v;
    this.signals.cutSceneEditorSettingsUpdated.emit();
  }

  // refer to cutscene.length
  public set length(v: number) {
    this.cutscene.length = v;
  }

  public get length(): number {
    return this.cutscene.length;
  }

  constructor() {
    this.init();
  }

  private init = () => {
    const time = performance.now();
    this.previousTime = time;
    this.animate(time);
  };

  private animate = (time: number) => {
    const delta = ((time - this.previousTime) / 1000) * this.cutscene.playRate;
    this.tick(delta);
    this.previousTime = time;
    requestAnimationFrame(this.animate);
  };

  play = () => {
    this.playState = PlayState.PlayForward;
    this._lastStartPlayTime = this.cutscene.currentTime;
  };

  playReverse = () => {
    this.playState = PlayState.PlayBackward;

    if (this.cutscene.currentTime === 0) {
      this.cutscene.currentTime = this.length;
      this._lastStartPlayTime = 0;
    } else {
      this._lastStartPlayTime = this.cutscene.currentTime;
    }
  };

  pause = () => {
    this.playState = PlayState.Stop;
  };

  stop = (isForceRewind = false) => {
    const t = this.playState !== PlayState.Stop && !isForceRewind ? this._lastStartPlayTime : 0;
    this.cutscene.sample(t);
    this.playState = PlayState.Stop;
  };

  tick = (delta: number) => {
    // support to preview when change time by editor panel if cutsceneEditor is stopped
    this.cutscene.sample();

    if (this.playState === PlayState.Stop) return;

    if (this.playState === PlayState.PlayForward && this.cutscene.currentTime >= this.length) {
      this.stop();
      return;
    }

    if (this.playState === PlayState.PlayBackward && this.cutscene.currentTime <= 0) {
      this.stop();
      return;
    }

    this.cutscene.currentTime += this.playState === PlayState.PlayForward ? delta : -delta;
    this.cutscene.sample(this.cutscene.currentTime);
    this.previousTime = this.cutscene.currentTime;
  };

  setTime = (time: number) => {
    this.cutscene.currentTime = time;
  };

  toJson = () => {
    return this.cutscene.toJson();
  };

  parseJson = (json: string) => {
    this.cutscene.loadFromJson(json);
  };
}

export const cutsceneEditor = new CutsceneEditor();
