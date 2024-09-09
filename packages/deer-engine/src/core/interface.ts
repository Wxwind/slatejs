import { DeerEngine } from './DeerEngine';

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
