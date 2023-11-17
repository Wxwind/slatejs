import { genUUID, isNil } from '@/utils';
import { ActionClip } from './ActionClip';
import { IDirectable } from './IDirectable';
import { ClipType } from './type';
import { AnimationClip } from './clips';

export abstract class CutsceneTrack implements IDirectable {
  private _clips: ActionClip[] = [];
  private _parent: IDirectable;
  private _id: string;

  abstract get name(): string;

  get id(): string {
    return this._id;
  }

  get children(): IDirectable[] {
    return this._clips;
  }

  get isActive(): boolean {
    return true;
  }

  get parent() {
    return this._parent;
  }

  get root() {
    return this._parent.root;
  }

  get startTime() {
    return this.parent.startTime;
  }

  get endTime() {
    return this.parent?.endTime || 0;
  }

  constructor(parent: IDirectable) {
    this._parent = parent;
    this._id = genUUID('cst');
  }

  onInitialize: () => boolean = () => {
    return false;
  };
  onEnter: () => void = () => {};
  onUpdate: (time: number) => void = () => {};
  onExit: () => void = () => {};
  onReverseEnter: () => void = () => {};
  onReverseExit: () => void = () => {};

  findClip = (clipId: string) => {
    return this._clips.find((a) => a.id === clipId);
  };

  addClip = (type: ClipType, start = 0, end = 20) => {
    let newClip = null;
    switch (type) {
      case 'Animation':
        newClip = AnimationClip.construct(this, 'animation clip', start, end, this._id);
        break;
      default:
        break;
    }

    if (isNil(newClip)) {
      console.error(`can not add clip of type ${type}`);
      return;
    }

    this._clips.push(newClip);
    return newClip;
  };

  removeClip = (ClipId: string) => {
    const index = this._clips.findIndex((a) => a.id === ClipId);
    if (isNil(index)) {
      console.log(`can not remove Clip(id = '${ClipId}') in ${this.name}(id = '${this.id}')`);
      return;
    }

    this._clips.splice(index, 1);
  };
}
