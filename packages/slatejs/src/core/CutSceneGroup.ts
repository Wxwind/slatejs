import { Entity } from 'deer-engine';
import { CutSceneDirector } from './CutSceneDirector';
import { CutSceneTrack } from './CutSceneTrack';
import { IDirectable } from './IDirectable';
import { genUUID, isNil } from '@/utils';
import { TransformTrack } from './tracks';
import { TrackType } from './type';

export abstract class CutSceneGroup implements IDirectable {
  private _tracks: CutSceneTrack[] = [];
  private _root: CutSceneDirector;
  private _id: string;
  protected abstract _actor: Entity | null;

  constructor(director: CutSceneDirector) {
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

  get root(): CutSceneDirector {
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
