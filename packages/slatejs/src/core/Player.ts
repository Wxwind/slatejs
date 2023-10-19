/**
 * Mangage time and the play of timeline
 */
export class Player {
  private _audio: HTMLAudioElement | null = null;
  private _isPlaying: boolean = false;
  private _currentTime: number = 0;
  private _playRate: number = 1;

  public get isPlaying(): boolean {
    return this._isPlaying;
  }
  public set isPlaying(v: boolean) {
    this._isPlaying = v;
  }

  public get currentTime(): number {
    return this._currentTime;
  }

  public set currentTime(v: number) {
    this._currentTime = v;
  }

  public get playRate(): number {
    return this._playRate;
  }

  public set playRate(v: number) {
    this._playRate = v;
  }

  play = () => {
    this.isPlaying = true;
  };

  pause = () => {
    this.isPlaying = false;
  };

  tick = (deltaTime: number) => {
    if (this.isPlaying) {
      this.currentTime += (deltaTime / 1000) * this.playRate;
    }
  };
}
