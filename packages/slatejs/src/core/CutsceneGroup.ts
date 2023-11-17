import { Entity } from 'deer-engine';
import { CutsceneDirector } from './CutsceneDirector';
import { CutsceneTrack } from './CutsceneTrack';
import { IDirectable } from './IDirectable';
import { genUUID, isNil } from '@/utils';
import { TransformTrack } from './tracks';
import { TrackType } from './type';

export abstract class CutsceneGroup implements IDirectable {
  private _tracks: CutsceneTrack[] = [];
  private _root: CutsceneDirector;
  private _id: string;
  protected abstract _actor: Entity | undefined;

  constructor(director: CutsceneDirector) {
    this._root = director;
    this._id = genUUID('csg');
  }

  abstract get name(): string;

  get id(): string {
    return this._id;
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

  get root(): CutsceneDirector {
    return this._root;
  }

  get startTime() {
    return this._root?.playTimeMin || 0;
  }

  get endTime() {
    return this._root?.playTimeMax || 0;
  }

  get actor() {
    return this._actor;
  }

  set actor(value: Entity | undefined) {
    this._actor = value;
  }

  onInitialize: () => boolean = () => {
    return true;
  };
  onEnter: () => void = () => {};
  onUpdate: (time: number) => void = () => {};
  onExit: () => void = () => {};
  onReverseEnter: () => void = () => {};
  onReverseExit: () => void = () => {};

  findTrack = (trackId: string) => {
    return this._tracks.find((a) => a.id === trackId);
  };

  addTrack = (type: TrackType) => {
    let newTrack = null;
    switch (type) {
      case 'Transform':
        newTrack = new TransformTrack(this);
        break;

      default:
        break;
    }

    if (isNil(newTrack)) {
      console.error(`can not add track of type ${type}`);
      return;
    }

    this._tracks.push(newTrack);
    return newTrack;
  };

  removeTrack = (trackId: string) => {
    const index = this._tracks.findIndex((a) => a.id === trackId);
    if (isNil(index)) {
      console.log(`can not remove track(id = '${trackId}') in ${this.name}(id = '${this.id}')`);
      return;
    }

    this._tracks.splice(index, 1);
  };
}
