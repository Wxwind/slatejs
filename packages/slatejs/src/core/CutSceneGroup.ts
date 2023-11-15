import { Entity } from 'deer-engine';
import { CutSceneDirector } from './CutSceneDirector';
import { CutSceneTrack } from './CutSceneTrack';
import { IDirectable } from './IDirectable';

export abstract class CutSceneGroup implements IDirectable {
  private _tracks: CutSceneTrack[] = [];
  private _root: CutSceneDirector;
  protected abstract actor: Entity | null;

  constructor(director: CutSceneDirector) {
    this._root = director;
  }

  get children(): IDirectable[] {
    return this._tracks;
  }

  get isActive(): boolean {
    return true;
  }

  get parent() {
    return null;
  }

  get root(): CutSceneDirector {
    return this._root;
  }

  get startTime() {
    return this._root?.playTimeMin || 0;
  }

  get endTime() {
    return this._root?.playTimeMax || 0;
  }

  onInitialize: () => boolean = () => {
    return true;
  };
  onEnter: () => void = () => {};
  onUpdate: (time: number) => void = () => {};
  onExit: () => void = () => {};
  onReverseEnter: () => void = () => {};
  onReverseExit: () => void = () => {};
}
