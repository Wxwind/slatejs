import { AnimationCurve, InterpMode, TangentMode } from 'deer-engine';
import { IAnimatable } from './IAnimatable';
import { IKeyable } from './IKeyable';
import { AnimationParameterData } from './AnimationParameterData';
import { isNearly, isNil } from '@/util';
import {
  IAnimatedParameterModel,
  TypeToAnimParamModelMapInstance,
  AnimatedParameterType,
} from './AnimatedParameterModel';

export class AnimatedParameter<T extends AnimatedParameterType = AnimatedParameterType> implements IAnimatable {
  private curves: AnimationCurve[];

  private data: AnimationParameterData;

  private keyable: IKeyable;

  private parameterModel: IAnimatedParameterModel<T>;

  private get target() {
    return this.keyable.animatedParameterTarget;
  }

  disabled = false;

  constructor(keyable: IKeyable, rootType: string, propType: string, propPath: string) {
    this.keyable = keyable;
    this.data = {
      rootType,
      parameterType: propType,
      parameterPath: propPath,
    };
    if (propType in TypeToAnimParamModelMapInstance) {
      this.parameterModel = TypeToAnimParamModelMapInstance[propType];
      const curves = [];
      const n = this.parameterModel.requiredCurveCount;
      for (let i = 0; i <= n; i++) {
        curves.push(new AnimationCurve());
      }
      this.curves = [];
    } else {
      throw new Error(`type ${propType} is not surpported in animatedParameter.`);
    }
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
      // Add key from current value since we haven't added any key before.
      this.addKeyFromCurrentValue(time);
      return true;
    }

    // Add key from curve.
    const mode = this.parameterModel.isBool ? InterpMode.Constant : InterpMode.Cubic;
    let isKeyAdded = false;
    for (const curve of this.curves) {
      if (addKeyInCurve(curve, time, curve.evaluate(time), mode)) {
        isKeyAdded = true;
      }
    }

    return isKeyAdded;
  };

  addKeyFromCurrentValue = (time: number) => {
    const nums = this.getValue();
    if (!this.disabled) {
      for (let i = 0; i < this.curves.length; i++) {
        this.curves[i].addKey(time, nums[i]);
      }
    }
  };

  removeKey: (time: number) => boolean = (time) => {
    let isAdded = false;
    for (const curve of this.curves) {
      const keys = curve.keys;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (isNearly(key.time, time)) {
          curve.removeKey(i);
          isAdded = true;
        }
      }
    }

    return isAdded;
  };

  getValue: () => number[] = () => {
    const propPath = this.data.parameterPath;
    const target = this.target;
    return this.parameterModel.getDirect(target, propPath);
  };

  setValue = (numbers: number[]) => {
    const propPath = this.data.parameterPath;
    const target = this.target;
    this.parameterModel.setDirect(target, propPath, numbers);
  };

  evaluate: (curTime: number, prevTime: number) => void = (curTime, prevTime) => {
    if (this.disabled || isNil(this.target)) {
      return;
    }

    const evals: number[] = [];
    for (const curve of this.curves) {
      if (!this.hasAnyKey()) {
        return;
      }

      const v = curve.evaluate(curTime);
      evals.push(v);
    }

    this.setValue(evals);
  };
}

function addKeyInCurve(curve: AnimationCurve, time: number, value: number, mode: InterpMode) {
  const keys = curve.keys;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (isNearly(key.time, time)) {
      key.time = time;
      key.value = value;
      return false;
    }
  }

  const index = curve.addKey(time, value);
}
