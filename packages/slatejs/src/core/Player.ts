/**
 * Mangage time and the play of timeline
 */
export class Player {
  private _audio: HTMLAudioElement | null = null;
  private _isPlaying: boolean = false;
  private _currentTime: number = 0;

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
}
