import { ReflectionTool, isNearly } from '@/util';
import { FVector3, MetadataProp } from '@/core';

export type AnimatedParameterType = number | boolean | FVector3;

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
    ReflectionTool.setValue(target, metadataProp, v);
  };

  getDirect: (target: object, metadataProp: MetadataProp) => number[] = (target, metadataProp) => {
    const v = ReflectionTool.getValue(target, metadataProp) as number;
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
    return isNearly(numbers[0], 0) ? false : true;
  };

  setDirect: (target: object, metadataProp: MetadataProp, numbers: number[]) => void = (
    target,
    metadataProp,
    numbers
  ) => {
    ReflectionTool.setValue(target, metadataProp, numbers[0] >= 1);
  };

  getDirect: (target: object, metadataProp: MetadataProp) => number[] = (target, metadataProp) => {
    const v = ReflectionTool.getValue(target, metadataProp) as boolean;
    return this.convertToNumbers(v);
  };
}

export class AnimatedVector3Model implements IAnimatedParameterModel<FVector3> {
  requiredCurveCount: number = 3;
  isBool: boolean = false;

  convertToNumbers: (value: FVector3) => number[] = (value) => {
    return [value.x, value.y, value.z];
  };

  convertToObject: (numbers: number[]) => FVector3 = (numbers: number[]) => {
    return { x: numbers[0], y: numbers[1], z: numbers[2] };
  };

  setDirect: (target: object, metadataProp: MetadataProp, numbers: number[]) => void = (
    target,
    metadataProp,
    numbers
  ) => {
    ReflectionTool.setValue(target, metadataProp, { x: numbers[0], y: numbers[1], z: numbers[2] });
  };

  getDirect: (target: object, metadataProp: MetadataProp) => number[] = (target, metadataProp) => {
    const v = ReflectionTool.getValue(target, metadataProp) as FVector3;
    return this.convertToNumbers(v);
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TypeToAnimParamModelMapInstance: Record<string, new () => any> = {
  Number: AnimatedNumberModel,
  Bool: AnimatedBoolModel,
  FVector3: AnimatedVector3Model,
};
