import { EventEmitter } from 'eventtool';
import { DeerEngine } from '../DeerEngine';

export abstract class EngineObject extends EventEmitter {
  private static _idGenerator = 0;
  readonly _id: number = ++EngineObject._idGenerator;

  protected _isDestroyed = false;
  protected _engine: DeerEngine;

  public get engine(): DeerEngine {
    return this._engine;
  }

  constructor(engine: DeerEngine) {
    super();
    this._engine = engine;
  }

  // like unity's Destroy()
  destroy() {
    if (this._isDestroyed) return;
    this._onDestroy();
    this._isDestroyed = true;
  }

  protected _onDestroy() {}
}
