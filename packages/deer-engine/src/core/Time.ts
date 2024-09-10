/**
 * Provide time related information.
 */
export class Time {
  private _frameCount: number = 0;
  private _deltaTime: number = 0;
  private _actualDeltaTime: number = 0;
  private _elapsedTime: number = 0;
  private _actualElapsedTime: number = 0;
  private _lastSystemTime: number;

  /** Maximum delta time allowed per frame in seconds. */
  maximumDeltaTime: number = 0.333333;

  /** The scale of time. */
  timeScale: number = 1.0;

  /*
   * The total number of frames since the start of the engine.
   */
  get frameCount(): number {
    return this._frameCount;
  }

  /**
   * The delta time in seconds from the last frame to the current frame.
   *
   * @remarks When the frame rate is low or stutter occurs, `deltaTime` will not exceed the value of `maximumDeltaTime` * `timeScale`.
   */
  get deltaTime(): number {
    return this._deltaTime;
  }

  /**
   * The amount of elapsed time in seconds since the start of the engine.
   */
  get elapsedTime(): number {
    return this._elapsedTime;
  }

  /**
   * The actual delta time in seconds from the last frame to the current frame.
   *
   * @remarks The actual delta time is not affected by `maximumDeltaTime` and `timeScale`.
   */
  get actualDeltaTime(): number {
    return this._actualDeltaTime;
  }

  /**
   * The amount of actual elapsed time in seconds since the start of the engine.
   */
  get actualElapsedTime(): number {
    return this._actualElapsedTime;
  }

  /**
   * Constructor of the Time.
   */
  constructor() {
    this._lastSystemTime = performance.now() / 1000;
  }

  reset() {
    this._lastSystemTime = performance.now() / 1000;
  }

  update(): void {
    const currentSystemTime = performance.now() / 1000;

    const actualDeltaTime = currentSystemTime - this._lastSystemTime;
    this._actualDeltaTime = actualDeltaTime;
    this._actualElapsedTime += actualDeltaTime;

    const deltaTime = Math.min(actualDeltaTime, this.maximumDeltaTime) * this.timeScale;
    this._deltaTime = deltaTime;
    this._elapsedTime += deltaTime;
    this._frameCount++;

    this._lastSystemTime = currentSystemTime;
  }
}
