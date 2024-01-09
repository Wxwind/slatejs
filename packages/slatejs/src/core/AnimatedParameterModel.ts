import { ReflectionTool, isValidKey } from '@/util';
import { Vector3, isNearly } from 'deer-engine';

export type AnimatedParameterType = number | boolean | Vector3;

export interface IAnimatedParameterModel<T extends AnimatedParameterType = AnimatedParameterType> {
  readonly requiredCurveCount: number;
  readonly isBool: boolean;
  convertToNumbers: (value: T) => number[];
  convertToObject: (numbers: number[]) => T;
  setDirect: (target: object, propPath: string, numbers: number[]) => void;
  getDirect: (target: object, propPath: string) => number[];
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

  setDirect: (target: object, propPath: string, numbers: number[]) => void = (target, propPath, numbers) => {
    const v = this.convertToObject(numbers);
    ReflectionTool.setValue(target, propPath, v);
  };

  getDirect: (target: object, propPath: string) => number[] = (target, propPath) => {
    const v = ReflectionTool.getValue(target, propPath) as number;
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

  setDirect: (target: object, propPath: string, numbers: number[]) => void = (target, propPath, numbers) => {
    ReflectionTool.setValue(target, propPath, numbers[0]);
  };

  getDirect: (target: object, propPath: string) => number[] = (target, propPath) => {
    const v = ReflectionTool.getValue(target, propPath) as boolean;
    return this.convertToNumbers(v);
  };
}

export class AnimatedVector3Model implements IAnimatedParameterModel<Vector3> {
  requiredCurveCount: number = 3;
  isBool: boolean = false;

  convertToNumbers: (value: Vector3) => number[] = (value) => {
    return [value.x, value.y, value.z];
  };

  convertToObject: (numbers: number[]) => Vector3 = (numbers: number[]) => {
    return { x: numbers[0], y: numbers[1], z: numbers[2] };
  };

  setDirect: (target: object, propPath: string, numbers: number[]) => void = (target, propPath, numbers) => {
    ReflectionTool.setValue(target, propPath, numbers[0]);
  };

  getDirect: (target: object, propPath: string) => number[] = (target, propPath) => {
    const v = ReflectionTool.getValue(target, propPath) as Vector3;
    return this.convertToNumbers(v);
  };
}

export const TypeToAnimParamModelMapInstance: Record<string, new () => any> = {
  number: AnimatedNumberModel,
  bool: AnimatedBoolModel,
  Vector3: AnimatedVector3Model,
};
