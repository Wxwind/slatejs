import { AnimationCurve } from 'deer-engine';
import { IAnimatable } from './IAnimatable';
import { IKeyable } from './IKeyable';
import { AnimationParameterData } from './AnimationParameterData';

export class AnimatedParameter implements IAnimatable {
  private curves: AnimationCurve[] = [];

  private data: AnimationParameterData;

  constructor(keyable: IKeyable, rootType: string, propType: string, propPath: string) {
    this.data = {
      rootType,
      parameterType: propType,
      parameterPath: propPath,
    };
  }

  hasAnyKey: () => boolean = () => {
    for (const curve of this.curves) {
      if (curve.length > 0) {
        return true;
      }
    }

    return false;
  };

  // add key at time with value from curves or current property value if no curves.
  tryAddKey: (time: number) => boolean = (time) => {
    if (!this.hasAnyKey()) {
      return true;
    }
    // TODO:
    let isKeyAdded = false;
    for (const curve of this.curves) {
      curve.addKey(time, curve.evaluate(time));
    }
  };

  removeKey: (time: number) => void = (time) => {};

  evaluate: (curTime: number, prevTime: number) => void = () => {};
}
