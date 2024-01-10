import { Entity } from '@/core';
import { CutsceneDirector } from './CutsceneDirector';
import { CutsceneTrack } from './CutsceneTrack';
import { IDirectable } from './IDirectable';
import { isNil } from '@/util';
import { PropertyTrack } from './tracks';
import { CutsceneTrackType } from './type';
import { Signal } from '@/packages/signal';
import { TransformTrack } from './tracks/TransformTrack';

export abstract class CutsceneGroup implements IDirectable {
  protected _tracks: CutsceneTrack[] = [];
  protected _root: CutsceneDirector;
  protected _id: string;
  protected abstract _actor: Entity | undefined;

  readonly signals = {
    groupUpdated: new Signal(),
    trackCountChanged: new Signal(),
  };

  protected constructor(director: CutsceneDirector, id: string, tracks: CutsceneTrack[]) {
    this._root = director;
    this._id = id;
    this._tracks = tracks;
  }

  abstract get name(): string;

  get id(): string {
    return this._id;
  }

  get children(): CutsceneTrack[] {
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

  addTrack = (type: CutsceneTrackType) => {
    let newTrack = null;
    switch (type) {
      case 'Property':
        newTrack = PropertyTrack.construct(this, 'Property Track');
        break;
      case 'Transform':
        newTrack = TransformTrack.construct(this, 'Transform Track');
        break;
      default:
        break;
    }

    if (isNil(newTrack)) {
      throw new Error(`add track: track of type '${type}' is not suppored`);
    }

    this._tracks.push(newTrack);
    this.signals.trackCountChanged.emit();
    return newTrack;
  };

  removeTrack = (trackId: string) => {
    const index = this._tracks.findIndex((a) => a.id === trackId);
    if (isNil(index)) {
      console.log(`can not remove track(id = '${trackId}') in ${this.name}(id = '${this.id}')`);
      return;
    }

    this._tracks.splice(index, 1);
    this.signals.trackCountChanged.emit();
  };
}
