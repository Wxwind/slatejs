import { genUUID } from '@/utils';
import { IDirectable } from './IDirectable';
import { ActionClipData, ClipType } from './type';

export abstract class ActionClip implements IDirectable {
  abstract data: ActionClipData;
  private _startTime = 0;
  private _endTime = 0;
  private _parent: IDirectable;
  private _id: string;

  abstract get type(): ClipType;

  get name(): string {
    return this.data.name;
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

  constructor(parent: IDirectable) {
    this._parent = parent;
    this._id = genUUID('csc');
  }

  onInitialize: () => boolean = () => {
    return false;
  };
  onUpdate: (curTime: number) => void = () => {};
  onEnter: () => void = () => {};
  onExit: () => void = () => {};
  onReverseEnter: () => void = () => {};
  onReverseExit: () => void = () => {};
}
