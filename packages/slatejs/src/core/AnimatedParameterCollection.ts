import { ActionClip } from './ActionClip';
import { AnimatedParameter, AnimatedParameterJson } from './AnimatedParameter';
import { IAnimatable } from './IAnimatable';

export type AnimatedParameterCollectionJson = {
  animatedParamArray: AnimatedParameterJson[];
};
export class AnimatedParameterCollection implements IAnimatable {
  animatedParamArray: AnimatedParameter[];

  private constructor(animatedParamArray: AnimatedParameter[]) {
    this.animatedParamArray = animatedParamArray;
  }

  static constructFromJson = (clip: ActionClip, data: AnimatedParameterCollectionJson) => {
    const array = data.animatedParamArray.map((a) => AnimatedParameter.constructFromJson(clip, a));
    return new AnimatedParameterCollection(array);
  };

  static construct = () => {
    return new AnimatedParameterCollection([]);
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

    return isKeyAdded;
  };

  removeKey: (time: number) => void = (time) => {
    for (const animatedParam of this.animatedParamArray) {
      animatedParam.removeKey(time);
    }
  };

  evaluate: (curTime: number, prevTime: number) => void = (curTime, prevTime) => {
    for (const animatedParam of this.animatedParamArray) {
      animatedParam.evaluate(curTime, prevTime);
    }
  };
}
