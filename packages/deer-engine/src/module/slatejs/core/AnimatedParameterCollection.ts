import { egclass, property } from '@/core';
import { ActionClip } from './ActionClip';
import { AnimatedParameter, AnimatedParameterJson } from './AnimatedParameter';
import { IAnimatable } from './IAnimatable';
import { IKeyable } from './IKeyable';
import { Signal } from '@/packages/signal';

export type AnimatedParameterCollectionJson = {
  animatedParamArray: AnimatedParameterJson[];
};

@egclass()
export class AnimatedParameterCollection implements IAnimatable {
  @property({ type: [AnimatedParameter] })
  animatedParamArray: AnimatedParameter[] = [];

  constructor() {}

  get isValid(): boolean {
    return !!this.animatedParamArray && this.animatedParamArray.length > 0;
  }

  signals = {
    updated: new Signal<[]>(),
  };

  static constructFromJson = (clip: ActionClip, data: AnimatedParameterCollectionJson) => {
    const array = data.animatedParamArray.map((a) => AnimatedParameter.constructFromJson(clip, a));
    const a = new AnimatedParameterCollection();
    a.animatedParamArray = array;
    return a;
  };

  static construct = () => {
    return new AnimatedParameterCollection();
  };

  addParameter = (keyable: IKeyable, type: string, paramPath: string) => {
    const animatedParam = AnimatedParameter.construct(keyable, type, paramPath);
    this.animatedParamArray.push(animatedParam);
    this.signals.updated.emit();
    return animatedParam;
  };

  hasAnyKey: () => boolean = () => {
    for (const a of this.animatedParamArray) {
      if (a.hasAnyKey()) {
        return true;
      }
    }
    return false;
  };

  tryAddKey: (time: number) => boolean = (time) => {
    let isKeyAdded = false;
    for (const animatedParam of this.animatedParamArray) {
      if (animatedParam.tryAddKey(time)) {
        isKeyAdded = true;
      }
    }
    if (isKeyAdded) this.signals.updated.emit();
    return isKeyAdded;
  };

  removeKey: (time: number) => void = (time) => {
    for (const animatedParam of this.animatedParamArray) {
      animatedParam.removeKey(time);
    }
    this.signals.updated.emit();
  };

  evaluate: (curTime: number, prevTime: number) => void = (curTime, prevTime) => {
    for (const animatedParam of this.animatedParamArray) {
      animatedParam.evaluate(curTime, prevTime);
    }
  };

  saveSnapshot: () => void = () => {
    for (const a of this.animatedParamArray) {
      a.saveSnapshot();
    }
  };

  restoreSnapshot: () => void = () => {
    for (const a of this.animatedParamArray) {
      a.restoreSnapshot();
    }
  };
}
