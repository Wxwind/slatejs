import { AnimatedParameter } from './AnimatedParameter';
import { IAnimatable } from './IAnimatable';

export class AnimatedParameterCollection implements IAnimatable {
  private animatedParamArray: AnimatedParameter[] = [];

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
