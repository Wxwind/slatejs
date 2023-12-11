import { genUUID } from '@/util';
import { IDirectable } from './IDirectable';
import { ActionClipData, ActionClipTypeToKeyMap, ClipType, UpdateActionClipDto } from './type';

export abstract class ActionClipBase<T extends ClipType = ClipType> implements IDirectable {
  abstract data: ActionClipData<T>;
  private _startTime = 0;
  private _endTime = 0;
  private _parent: IDirectable;
  private _id: string;
  protected abstract readonly _type: T;

  get type(): T {
    return this._type;
  }

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

  get actor() {
    return this.parent?.actor;
  }

  constructor(parent: IDirectable) {
    this._parent = parent;
    this._id = genUUID('csc');
  }

  abstract updateData: (data: UpdateActionClipDto<T>) => void;
  abstract addKey: (key: ActionClipTypeToKeyMap[T]) => void;
  abstract updateKeys: (keyId: string, keyData: ActionClipTypeToKeyMap[T]) => void;
  abstract removeKey: (keyId: string) => void;

  onInitialize: () => boolean = () => {
    return false;
  };
  onUpdate: (curTime: number) => void = () => {};
  onEnter: () => void = () => {};
  onExit: () => void = () => {};
  onReverseEnter: () => void = () => {};
  onReverseExit: () => void = () => {};
}
