import { IDirectable } from './IDirectable';
import { ClipType, UpdateActionClipDto } from './type';
import { IKeyable } from './IKeyable';
import { AnimatedParameterCollection } from './AnimatedParameterCollection';
import { Signal } from '@/packages/signal';
import { Entity, property } from '@/core';

export type ActionClipBaseInitParam = {
  start: number;
  end: number;
  name: string;
};
export abstract class ActionClip implements IDirectable, IKeyable {
  @property({ type: Number })
  protected _startTime: number;
  @property({ type: Number })
  protected _endTime: number;
  protected _parent: IDirectable;
  @property({ type: String })
  protected _id: string;
  @property({ type: String })
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

  abstract get animatedData(): AnimatedParameterCollection;

  abstract get animatedParametersTarget(): Entity | ActionClip | undefined;

  readonly signals = {
    clipUpdated: new Signal(),
    keysChanged: new Signal(),
  };

  constructor(parent: IDirectable, id: string, name: string, start: number, end: number) {
    this._parent = parent;
    this._id = id;
    this._startTime = start;
    this._endTime = end;
    this._name = name;
  }

  abstract updateData: (data: UpdateActionClipDto) => void;

  initialize: () => boolean = () => {
    return true;
  };

  update: (curTime: number, previousTime: number) => void = (curTime, previousTime) => {
    this.updateAnimatedData(curTime, previousTime);
    this.onUpdate();
  };

  private updateAnimatedData(time: number, previousTime: number) {
    this.animatedData.evaluate(time, previousTime);
  }

  enter: () => void = () => {
    this.setAnimParamsSnapshot();
    this.onEnter();
  };

  exit: () => void = () => {
    this.onExit();
  };

  reverseEnter: () => void = () => {
    this.onReverseEnter();
  };

  reverseExit: () => void = () => {
    this.restoreAnimParamsSnapshot();
    this.onReverseExit();
  };

  private get hasParameters() {
    return !!this.animatedData && this.animatedData.isValid;
  }

  private setAnimParamsSnapshot() {
    if (this.hasParameters) {
      this.animatedData.saveSnapshot();
    }
  }

  private restoreAnimParamsSnapshot() {
    if (this.hasParameters) {
      this.animatedData.restoreSnapshot();
    }
  }

  protected abstract onInitialize(): boolean;
  protected abstract onEnter(): void;
  protected abstract onUpdate(): void;
  protected abstract onExit(): void;
  protected abstract onReverseEnter(): void;
  protected abstract onReverseExit(): void;
}
