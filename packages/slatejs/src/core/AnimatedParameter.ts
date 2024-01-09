import {
  AnimationCurve,
  AnimationCurveJson,
  Component,
  ComponentBase,
  Entity,
  InterpMode,
  getRelativeProp,
  isNearly,
} from 'deer-engine';
import { IAnimatable } from './IAnimatable';
import { IKeyable } from './IKeyable';
import { isNil, isValidKey } from '@/util';
import {
  IAnimatedParameterModel,
  TypeToAnimParamModelMapInstance,
  AnimatedParameterType,
} from './AnimatedParameterModel';
import { ActionClip } from './ActionClip';

export type AnimatedParameterJson = {
  keyableId: string;
  compType: string;
  propType: string;
  propPath: string;
  curves: AnimationCurveJson[];
};

export class AnimatedParameter<T extends AnimatedParameterType = AnimatedParameterType> implements IAnimatable {
  curves: AnimationCurve[];

  compType: string;
  parameterPath: string; // key of compType
  parameterType: string;

  private keyable: IKeyable;

  private parameterModel: IAnimatedParameterModel<T>;

  private get target() {
    return this.keyable.animatedParameterTarget;
  }

  disabled = false;

  private constructor(
    keyable: IKeyable,
    compType: string,
    paramType: string,
    paramPath: string,
    curves: AnimationCurve[] | undefined
  ) {
    this.keyable = keyable;
    this.compType = compType;
    this.parameterType = paramType;
    this.parameterPath = paramPath;

    if (paramType in TypeToAnimParamModelMapInstance) {
      this.parameterModel = new TypeToAnimParamModelMapInstance[paramType]();
      if (isNil(curves)) {
        const c = [];
        const n = this.parameterModel.requiredCurveCount;
        for (let i = 0; i <= n; i++) {
          c.push(new AnimationCurve());
        }
        this.curves = c;
      } else {
        this.curves = curves;
      }
    } else {
      throw new Error(`type ${paramType} is not surpported in animatedParameter.`);
    }
  }

  static constructFromJson = (clip: ActionClip, data: AnimatedParameterJson) => {
    const curves: AnimationCurve[] = data.curves.map((curve) => AnimationCurve.from(curve.keys));
    return new AnimatedParameter(clip, data.compType, data.propPath, data.propType, curves);
  };

  static construct = (keyable: IKeyable, compType: string, paramPath: string) => {
    const metadataProp = getRelativeProp(compType, paramPath);
    const paramType = metadataProp.typeName;
    if (isNil(paramType)) {
      throw new Error(`cannot not read name of '${paramPath} in '${compType}''`);
    }
    return new AnimatedParameter(keyable, compType, paramType, paramPath, undefined);
  };

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

  private _cachedAnimatedObject: any | undefined;
  // get Component or ActionClip from this.keyable.animatedParameterTarget
  private getAnimatedObject = () => {
    if (this._cachedAnimatedObject !== undefined) {
      return this._cachedAnimatedObject;
    }
    if (this.target instanceof Entity) {
      const o = this.target.findComponentByType(this.compType as Component['type']);
      this._cachedAnimatedObject = 0;
      return o;
    }

    if (isValidKey(this.parameterPath, this.target)) {
      const o = this.target[this.parameterPath];
      this._cachedAnimatedObject = o;
      return o;
    }

    throw new Error(
      `couldn't find cachedAnimatedObject. (target= ${this.target}, compType= ${this.compType}, parameterPath=${this.parameterPath})`
    );
  };

  getValue: () => number[] = () => {
    const obj = this.getAnimatedObject();
    return this.parameterModel.getDirect(obj, this.parameterPath);
  };

  setValue = (numbers: number[]) => {
    const obj = this.getAnimatedObject();
    if (isNil(obj)) {
      return;
    }
    const propPath = this.parameterPath;
    this.parameterModel.setDirect(obj, propPath, numbers);
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

  saveSnapshot: () => void = () => {};
  restoreSnapshot: () => void = () => {};
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
  // TODO
  const index = curve.addKey(time, value);
}
