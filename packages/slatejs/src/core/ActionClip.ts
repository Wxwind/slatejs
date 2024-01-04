import { IDirectable } from './IDirectable';
import { ClipType, UpdateActionClipDto } from './type';
import { IKeyable } from './IKeyable';
import { AnimatedParameterCollection } from './AnimatedParameterCollection';
import { Signal } from '@/signal';

export type ActionClipBaseInitParam = {
  start: number;
  end: number;
  name: string;
};
export abstract class ActionClip implements IDirectable, IKeyable {
  protected _startTime;
  protected _endTime;
  protected _parent: IDirectable;
  protected _id: string;
  protected _name: string;
  protected abstract readonly _type: ClipType;

  get type(): ClipType {
    return this._type;
  }

  get name(): string {
    return this._name;
  }

  get id(): string {
    return this._id;
  }

  get children(): IDirectable[] {
    return [];
  }

  get isActive(): boolean {
    return true;
  }

  get root() {
    return this._parent.root;
  }

  get parent() {
    return this._parent;
  }

  get startTime(): number {
    return this._startTime;
  }

  get endTime(): number {
    return this._endTime;
  }

  get actor() {
    return this.parent?.actor;
  }

  abstract get animatedData(): AnimatedParameterCollection | undefined;

  abstract get animatedParameterTarget(): any;

  readonly signals = {
    clipUpdated: new Signal(),
    keysChanged: new Signal(),
  };

  protected constructor(parent: IDirectable, id: string, name: string, start: number, end: number) {
    this._parent = parent;
    this._id = id;
    this._startTime = start;
    this._endTime = end;
    this._name = name;
  }

  abstract updateData: (data: UpdateActionClipDto) => void;

  onInitialize: () => boolean = () => {
    return false;
  };
  onUpdate: (curTime: number) => void = () => {};
  onEnter: () => void = () => {};
  onExit: () => void = () => {};
  onReverseEnter: () => void = () => {};
  onReverseExit: () => void = () => {};
}
