import { DeerEngine } from './DeerEngine';
import { DeerScene } from './DeerScene';

export interface ICanAccessEngine {
  get engine(): DeerEngine;
  set engine(value: DeerEngine);
}

export interface IManager extends ICanAccessEngine {
  init(): void;
  destroy(): void;
}

export abstract class AbstractManager implements IManager {
  private _engine!: DeerEngine;

  get engine(): DeerEngine {
    return this._engine;
  }

  set engine(value: DeerEngine) {
    this._engine = value;
  }

  abstract init(): void;
  abstract destroy(): void;
}

export abstract class AbstractSceneManager implements IManager {
  private _engine!: DeerEngine;

  get engine(): DeerEngine {
    return this._engine;
  }

  set engine(value: DeerEngine) {
    this._engine = value;
  }

  private _scene!: DeerScene;

  get scene(): DeerScene {
    return this._scene;
  }

  set scene(value: DeerScene) {
    this._scene = value;
  }

  abstract init(): void;

  abstract destroy(): void;

  update(dt: number): void {}
}
