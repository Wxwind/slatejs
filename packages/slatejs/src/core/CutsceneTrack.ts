import { isNil } from '@/util';
import { IDirectable } from './IDirectable';
import { ClipType, CreateActionClipDto, CutsceneTrackType } from './type';
import { AnimationClip, TransformClip } from './clips';
import { ActionClip } from './ActionClip';
import { Signal } from '@/signal';

export abstract class CutsceneTrack<T extends CutsceneTrackType = CutsceneTrackType> implements IDirectable {
  protected _clips: ActionClip[];
  private _parent: IDirectable;
  private _id: string;
  private _name: string;
  protected abstract readonly _type: T;

  readonly signals = {
    trackUpdated: new Signal(),
    clipCountChanged: new Signal(),
  };

  get name(): string {
    return this._name;
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

  get type() {
    return this._type;
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

  addClip = (type: ClipType, { name, startTime, endTime }: CreateActionClipDto) => {
    let newClip: ActionClip | null = null;
    switch (type) {
      case 'Transform':
        newClip = TransformClip.construct(this, {
          name: name,
          startTime: startTime,
          endTime: endTime,
        });
        break;
      case 'Animation':
        newClip = AnimationClip.construct(this, {
          name: name,
          startTime: startTime,
          endTime: endTime,
        });
        break;

      default:
        break;
    }

    if (isNil(newClip)) {
      console.error(`can't add clip of type ${type}`);
      return;
    }

    this._clips.push(newClip);
    this.signals.clipCountChanged.emit();
    return newClip;
  };

  removeClip = (ClipId: string) => {
    const index = this._clips.findIndex((a) => a.id === ClipId);
    if (isNil(index)) {
      console.log(`can't remove Clip(id = '${ClipId}') in ${this.name}(id = '${this.id}')`);
      return;
    }

    this._clips.splice(index, 1);
    this.signals.clipCountChanged.emit();
  };
}
