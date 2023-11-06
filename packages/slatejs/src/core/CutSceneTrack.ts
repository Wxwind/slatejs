import { ActionClip } from './ActionClip';
import { IDirectable } from './IDirectable';

export abstract class CutSceneTrack implements IDirectable {
  private _clips: ActionClip[] = [];
  private _parent: IDirectable;

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
  }

  onInitialize: () => boolean = () => {
    return false;
  };
  onEnter: () => void = () => {};
  onUpdate: (time: number) => void = () => {};
  onExit: () => void = () => {};
  onReverseEnter: () => void = () => {};
  onReverseExit: () => void = () => {};
}
