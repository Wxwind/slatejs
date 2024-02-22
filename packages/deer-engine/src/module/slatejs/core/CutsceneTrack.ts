import { isNil } from '@/util';
import { IDirectable } from './IDirectable';
import { ClipType, CreateActionClipDto } from './type';
import { AnimationClip, PropertiesClip, TransformClip } from './clips';
import { ActionClip } from './ActionClip';
import { Signal } from '@/packages/signal';
import { accessor } from '@/core';

export abstract class CutsceneTrack implements IDirectable {
  protected _clips: ActionClip[];
  private _parent: IDirectable;
  private _id: string;
  private _name: string;

  readonly signals = {
    trackUpdated: new Signal(),
    clipCountChanged: new Signal(),
  };

  @accessor({ type: String })
  get name(): string {
    return this._name;
  }

  @accessor({ type: String })
  set name(v: string) {
    this._name = v;
    this.signals.trackUpdated.emit();
  }

  get id(): string {
    return this._id;
  }

  get children(): ActionClip[] {
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

  get actor() {
    return this.parent?.actor;
  }

  constructor(parent: IDirectable, id: string, name: string, clips: ActionClip[]) {
    this._parent = parent;
    this._id = id;
    this._name = name;
    this._clips = clips;
  }

  initialize: () => boolean = () => {
    return true;
  };
  enter: () => void = () => {};
  update: (curTime: number, prevtime: number) => void = () => {};
  exit: () => void = () => {};
  reverseEnter: () => void = () => {};
  reverseExit: () => void = () => {};

  findClip = (clipId: string) => {
    return this._clips.find((a) => a.id === clipId);
  };

  addClip = (type: string, { name, startTime, endTime }: CreateActionClipDto) => {
    let newClip: ActionClip | null = null;
    switch (type) {
      case 'TransformClip':
        newClip = TransformClip.construct(this, {
          name: name,
          startTime: startTime,
          endTime: endTime,
        });
        break;
      case 'AnimationClip':
        newClip = AnimationClip.construct(this, {
          name: name,
          startTime: startTime,
          endTime: endTime,
        });
        break;
      case 'PropertiesClip':
        newClip = PropertiesClip.construct(this, {
          name: name,
          startTime: startTime,
          endTime: endTime,
        });
        break;

      default:
        break;
    }

    if (isNil(newClip)) {
      console.error(`can't add clip of type '${type}'`);
      return;
    }

    this._clips.push(newClip);
    this.signals.clipCountChanged.emit();
    return newClip;
  };

  removeClipById = (ClipId: string) => {
    const index = this._clips.findIndex((a) => a.id === ClipId);
    if (index === -1) {
      console.log(`can't remove Clip(id = '${ClipId}') in track '${this.name}'(id = '${this.id}')`);
      return;
    }

    this._clips.splice(index, 1);
    this.signals.clipCountChanged.emit();
  };

  removeClip = (clip: ActionClip) => {
    const index = this._clips.findIndex((a) => a === clip);
    if (index === -1) {
      console.log(`can't remove Clip(id = '${clip.id}') in track '${this.name}'(id = '${this.id}')`);
      return;
    }

    this._clips.splice(index, 1);
    this.signals.clipCountChanged.emit();
  };
}
