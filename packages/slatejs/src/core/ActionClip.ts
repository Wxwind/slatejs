import { CutSceneDirector } from './CutSceneDirector';
import { IDirectable } from './IDirectable';

export type ActionClipJson = {
  start: number;
  end: number;
  id: string;
  layerId: number;
  name: string;
};

export abstract class ActionClip implements IDirectable {
  abstract data: ActionClipJson;
  private _startTime = 0;
  private _endTime = 0;
  private _parent: IDirectable;

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
  }

  onInitialize: () => boolean = () => {
    return false;
  };
  onUpdate: (curTime: number) => void = () => {};
  onEnter: () => void = () => {};
  onExit: () => void = () => {};
  onReverseEnter: () => void = () => {};
  onReverseExit: () => void = () => {};

  abstract serialize(): Record<string, unknown>;
}
