import { MathUtil } from '@/util';
import { MetadataProp } from '@/core';
import { IVector3 } from '@/type';

export type AnimatedParameterType = number | boolean | IVector3;

export interface IAnimatedParameterModel<T extends AnimatedParameterType = AnimatedParameterType> {
  readonly requiredCurveCount: number;
  readonly isBool: boolean;
  convertToNumbers: (value: T) => number[];
  convertToObject: (numbers: number[]) => T;
  setDirect: (target: object, metadataProp: MetadataProp, numbers: number[]) => void;
  getDirect: (target: object, metadataProp: MetadataProp) => number[];
}

export class AnimatedNumberModel implements IAnimatedParameterModel<number> {
  requiredCurveCount: number = 1;
  isBool: boolean = false;

  convertToNumbers: (value: number) => number[] = (value) => {
    return [value];
  };

  convertToObject: (numbers: number[]) => number = (numbers: number[]) => {
    return numbers[0];
  };

  setDirect: (target: object, metadataProp: MetadataProp, numbers: number[]) => void = (
    target,
    metadataProp,
    numbers
  ) => {
    const v = this.convertToObject(numbers);
    metadataProp.set?.(target, v);
  };

  getDirect: (target: object, metadataProp: MetadataProp) => number[] = (target, metadataProp) => {
    const v = metadataProp.get?.(target) as number;
    return this.convertToNumbers(v);
  };
}

export class AnimatedBoolModel implements IAnimatedParameterModel<boolean> {
  requiredCurveCount: number = 1;
  isBool: boolean = true;

  convertToNumbers: (value: boolean) => number[] = (value) => {
    const v = value ? 1 : 0;
    return [v];
  };

  convertToObject: (numbers: number[]) => boolean = (numbers: number[]) => {
    return MathUtil.isNearly(numbers[0], 0) ? false : true;
  };

  setDirect: (target: object, metadataProp: MetadataProp, numbers: number[]) => void = (
    target,
    metadataProp,
    numbers
  ) => {
    metadataProp.set?.(target, numbers[0] >= 1);
  };

  getDirect: (target: object, metadataProp: MetadataProp) => number[] = (target, metadataProp) => {
    const v = metadataProp.get?.(target) as boolean;
    return this.convertToNumbers(v);
  };
}

export class AnimatedVector3Model implements IAnimatedParameterModel<IVector3> {
  requiredCurveCount: number = 3;
  isBool: boolean = false;

  convertToNumbers: (value: IVector3) => number[] = (value) => {
    return [value.x, value.y, value.z];
  };

  convertToObject: (numbers: number[]) => IVector3 = (numbers: number[]) => {
    return { x: numbers[0], y: numbers[1], z: numbers[2] };
  };

  setDirect: (target: object, metadataProp: MetadataProp, numbers: number[]) => void = (
    target,
    metadataProp,
    numbers
  ) => {
    metadataProp.set?.(target, { x: numbers[0], y: numbers[1], z: numbers[2] });
  };

  getDirect: (target: object, metadataProp: MetadataProp) => number[] = (target, metadataProp) => {
    const v = metadataProp.get?.(target) as IVector3;
    return this.convertToNumbers(v);
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TypeToAnimParamModelMapInstance: Record<string, new () => any> = {
  Number: AnimatedNumberModel,
  Bool: AnimatedBoolModel,
  IVector3: AnimatedVector3Model,
};
