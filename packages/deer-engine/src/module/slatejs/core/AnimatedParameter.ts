import {
  AnimationCurve,
  AnimationCurveJson,
  Component,
  Entity,
  InterpMode,
  Keyframe,
  MetadataProp,
  TransformComponent,
  egclass,
  getClassName,
  getRelativeProp,
  property,
} from '@/core';
import { IAnimatable } from './IAnimatable';
import { IKeyable } from './IKeyable';
import { isNil, isValidKey } from '@/util';
import {
  IAnimatedParameterModel,
  TypeToAnimParamModelMapInstance,
  AnimatedParameterType,
} from './AnimatedParameterModel';
import { ActionClip } from './ActionClip';
import { FVector3, MathUtils } from '@/math';

export type AnimatedParameterJson = {
  keyableId: string;
  type: string;
  paramType: string;
  paramPath: string;
  curves: AnimationCurveJson[];
};

@egclass()
export class AnimatedParameter<T extends AnimatedParameterType = AnimatedParameterType> implements IAnimatable {
  @property({ type: [AnimationCurve] })
  curves!: AnimationCurve[];

  // TODO: type can also be ActionClip's type name when target is ActionClip.
  @property({ type: String })
  type!: string; // name of Component or ActionClip

  // TODO: support nested proppath like 'a/b/c'
  @property({ type: String })
  paramPath!: string; // key of type

  paramType!: string;

  private keyable!: IKeyable;

  private parameterModel!: IAnimatedParameterModel<T>;

  private get target() {
    return this.keyable.animatedParametersTarget;
  }

  @property({ type: Boolean })
  disabled = false;

  get enabled() {
    return !this.disabled;
  }

  metadataProp!: MetadataProp;

  private snapshot: number[] | undefined;

  get isValid(): boolean {
    return !!this.paramPath && !!this.metadataProp;
  }

  static constructFromJson(clip: ActionClip, data: AnimatedParameterJson) {
    const { type, paramPath, keyableId, curves } = data;
    const c: AnimationCurve[] = curves.map((curve) => AnimationCurve.fromJSON(curve));

    const a = new AnimatedParameter();
    // FIXME read from keyableId
    a.keyable = clip;
    a.type = type;

    const metadataProp = getRelativeProp(type, paramPath);
    const paramType = metadataProp.typeName;
    if (isNil(paramType)) {
      throw new Error(`cannot not read name of '${paramPath} in '${type}''`);
    }
    a.paramType = paramType;
    a.paramPath = paramPath;
    a.metadataProp = getRelativeProp(type, paramPath);

    if (data.paramType in TypeToAnimParamModelMapInstance) {
      a.parameterModel = new TypeToAnimParamModelMapInstance[data.paramType]();
      a.curves = c;
    } else {
      throw new Error(`type ${data.paramType} is not surpported in animatedParameter.`);
    }
    return a;
  }

  static construct(keyable: IKeyable, type: string, paramPath: string) {
    const metadataProp = getRelativeProp(type, paramPath);
    const paramType = metadataProp.typeName;
    if (isNil(paramType)) {
      throw new Error(`cannot not read name of '${paramPath} in '${type}''`);
    }

    const a = new AnimatedParameter();
    a.keyable = keyable;
    a.type = type;
    a.paramType = paramType;
    a.paramPath = paramPath;
    a.metadataProp = getRelativeProp(type, paramPath);

    if (paramType in TypeToAnimParamModelMapInstance) {
      a.parameterModel = new TypeToAnimParamModelMapInstance[paramType]();

      const c = [];
      const n = a.parameterModel.requiredCurveCount;
      for (let i = 0; i < n; i++) {
        c.push(new AnimationCurve());
      }
      a.curves = c;
    } else {
      throw new Error(`type ${paramType} is not surpported in animatedParameter.`);
    }
    return a;
  }

  setEnabled = (value: boolean, time: number) => {
    if (this.enabled === value) {
      this.disabled = !value;
      if (time > 0 && this.snapshot) {
        if (value) this.evaluate(time, 0);
        else this.setCurrentValue(this.snapshot);
      }
    }
  };

  private setCurrentValue = (values: number[]) => {
    if (!this.isValid) return;

    const obj = this.getAnimatedObject();
    if (!obj) return;

    if (obj instanceof TransformComponent && this.paramType === getClassName(FVector3)) {
      // TODO: suport local pos,rotate,scale.
    }

    this.parameterModel.setDirect(obj, this.metadataProp, values);
  };

  hasAnyKey: () => boolean = () => {
    for (const curve of this.curves) {
      if (curve.length > 0) {
        return true;
      }
    }

    return false;
  };

  addKey = (time: number, value: number) => {
    if (!this.disabled) {
      for (let i = 0; i < this.curves.length; i++) {
        const keyframe = new Keyframe();
        keyframe.time = time;
        keyframe.value = value;
        this.curves[i].addKey(keyframe);
      }
    }
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
        const keyframe = new Keyframe();
        keyframe.time = time;
        keyframe.value = nums[i];
        this.curves[i].addKey(keyframe);
      }
    }
  };

  removeKey: (time: number) => boolean = (time) => {
    let isAdded = false;
    for (const curve of this.curves) {
      const keys = curve.keys;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (MathUtils.isNearly(key.time, time)) {
          curve.removeKey(i);
          isAdded = true;
        }
      }
    }

    return isAdded;
  };

  private _cachedAnimatedObject: Component | ActionClip | undefined;
  // get Component or ActionClip from this.keyable.animatedParameterTarget
  private getAnimatedObject = () => {
    if (this.target === undefined) {
      return undefined;
    }

    if (this._cachedAnimatedObject !== undefined) {
      return this._cachedAnimatedObject;
    }

    if (this.target instanceof Entity) {
      const o = this.target.findComponentByType(this.type as Component['type']);
      if (isNil(o)) {
        throw new Error(
          `couldn't find component in target. (target= ${this.target.constructor.name}, type= ${this.type})`
        );
      }
      this._cachedAnimatedObject = o;
      return o;
    }

    if (isValidKey(this.paramPath, this.target)) {
      //  const o = this.target[this.paramPath];
      this._cachedAnimatedObject = this.target;
      return this.target;
    }

    throw new Error(
      `couldn't find cachedAnimatedObject. (target= ${this.target.constructor.name}, type= ${this.type}, parameterPath=${this.paramPath})`
    );
  };

  getValue: () => number[] = () => {
    if (!this.isValid) throw new Error('getValue() failed: Parameter is not valid.');

    const obj = this.getAnimatedObject();
    if (isNil(obj)) {
      throw new Error('getValue() failed: AnimatedObject is null.');
    }

    return this.parameterModel.getDirect(obj as ActionClip, this.metadataProp);
  };

  setValue = (numbers: number[]) => {
    const obj = this.getAnimatedObject();
    if (isNil(obj)) {
      return;
    }

    this.parameterModel.setDirect(obj, this.metadataProp, numbers);
  };

  // TODO: support weight from IDirectable.blendin / IDirectable.blendout
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

  saveSnapshot: () => void = () => {
    if (!this.isValid) return;

    this.snapshot = this.getValue();
  };

  restoreSnapshot: () => void = () => {
    if (!this.isValid || this.disabled) return;

    if (this.snapshot !== undefined) this.setCurrentValue(this.snapshot);

    this.snapshot = undefined;
  };
}

function addKeyInCurve(curve: AnimationCurve, time: number, value: number, mode: InterpMode) {
  const keys = curve.keys;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (MathUtils.isNearly(key.time, time)) {
      key.time = time;
      key.value = value;
      return false;
    }
  }

  const keyframe = new Keyframe();
  keyframe.time = time;
  keyframe.value = value;

  const index = curve.addKey(keyframe);
  const newKey = curve.getKey(index);
  newKey.interpMode = mode;
  // try set tangentMode from neighbors
  const nextIndex = index + 1;
  const previousIndex = index - 1;
  if (nextIndex < curve.length) {
    newKey.tangentMode = curve.getKey(nextIndex).tangentMode;
  } else if (previousIndex >= 0) {
    newKey.tangentMode = curve.getKey(previousIndex).tangentMode;
  }
  return true;
}
