import { Timeline } from './Timeline';

export enum PlayState {
  Stop = 'Stop',
  PlayForward = 'PlayForward',
  PlayBackward = 'PlayBackward',
}

/**
 * Mangage time and the play of timeline
 */
export class CutSceneDirector {
  private _playState: PlayState = PlayState.Stop;

  private _currentTime = 0;
  private _previousTime = 0;

  private _playRate = 1;

  private _playTimeMin = 0;
  private _playTimeMax = 32;

  public get playState(): PlayState {
    return this._playState;
  }

  public set playState(v: PlayState) {
    this._playState = v;
  }

  public get currentTime(): number {
    return this._currentTime;
  }

  public set currentTime(v: number) {
    this._currentTime = v;
  }

  public get previousTime(): number {
    return this._previousTime;
  }

  public set previousTime(v: number) {
    this._previousTime = v;
  }

  public get playRate(): number {
    return this._playRate;
  }

  public set playRate(v: number) {
    this._playRate = v;
  }

  public get playTimeMin(): number {
    return this._playTimeMin;
  }

  public set playTimeMin(v: number) {
    this._playTimeMin = v;
  }

  public get playTimeMax(): number {
    return this._playTimeMax;
  }

  public set playTimeMax(v: number) {
    this._playTimeMax = v;
  }

  public get playTimeLength() {
    return this.playTimeMax - this.playTimeMin;
  }

  constructor(private timeline: Timeline) {}

  play = () => {
    this.playState = PlayState.PlayForward;
  };

  playReverse = () => {
    this.playState = PlayState.PlayBackward;
  };

  pause = () => {
    this.playState = PlayState.Stop;
  };

  stop = () => {
    this.playState = PlayState.Stop;
  };

  tick = (deltaTime: number) => {
    if (this.playState === PlayState.Stop) return;

    const delta = (deltaTime / 1000) * this.playRate;
    this.previousTime = this._currentTime;
    this.currentTime += this.playState === PlayState.PlayForward ? delta : -delta;
    this.timeline.sample(this.currentTime, this.previousTime);
  };
}
