import { Entity } from '@/core';
import { Cutscene } from './Cutscene';
import { CutsceneTrack } from './CutsceneTrack';
import { IDirectable } from './IDirectable';
import { isNil } from '@/util';
import { ActionTrack } from './tracks';
import { Signal } from 'eventtool';
import { AnimationTrack } from './tracks/AnimationTrack';

export abstract class CutsceneGroup implements IDirectable {
  protected _tracks: CutsceneTrack[] = [];
  protected _root: Cutscene;
  protected _id: string;
  protected abstract _actor: Entity | undefined;

  readonly signals = {
    groupUpdated: new Signal(),
    trackCountChanged: new Signal(),
  };

  constructor(director: Cutscene, id: string, tracks: CutsceneTrack[]) {
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

  get root(): Cutscene {
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

  initialize: () => boolean = () => {
    return true;
  };
  enter: () => void = () => {};
  update: (time: number) => void = () => {};
  exit: () => void = () => {};
  reverseEnter: () => void = () => {};
  reverseExit: () => void = () => {};

  findTrack = (trackId: string) => {
    return this._tracks.find((a) => a.id === trackId);
  };

  addTrack = (type: string) => {
    let newTrack = null;
    switch (type) {
      case 'ActionTrack':
        newTrack = ActionTrack.construct(this, 'Action Track');
        break;
      case 'AnimationTrack':
        newTrack = AnimationTrack.construct(this, 'Aniamtion Track');
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
