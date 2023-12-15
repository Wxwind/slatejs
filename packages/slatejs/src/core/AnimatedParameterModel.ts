import { ReflectionTool, isNearly } from '@/util';
import { Vector3 } from 'deer-engine';
import { AnimatedParameter } from './AnimatedParameter';

export type AnimatedParameterType = number | boolean | Vector3;

export interface IAnimatedParameterModel<T extends AnimatedParameterType = AnimatedParameterType> {
  readonly requiredCurveCount: number;
  readonly isBool: boolean;
  convertToNumbers: (value: T) => number[];
  convertToObject: (numbers: number[]) => T;
  setDirect: (target: Record<string, unknown>, propPath: string, numbers: number[]) => void;
  getDirect: (target: Record<string, unknown>, propPath: string) => number[];
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

  setDirect: (target: Record<string, unknown>, propPath: string, numbers: number[]) => void = (
    target,
    propPath,
    numbers
  ) => {
    const v = this.convertToObject(numbers);
    ReflectionTool.setValue(target, propPath, v);
  };

  getDirect: (target: Record<string, unknown>, propPath: string) => number[] = (target, propPath) => {
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

  setDirect: (target: Record<string, unknown>, propPath: string, numbers: number[]) => void = (
    target,
    propPath,
    numbers
  ) => {
    ReflectionTool.setValue(target, propPath, numbers[0]);
  };

  getDirect: (target: Record<string, unknown>, propPath: string) => number[] = (target, propPath) => {
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

  setDirect: (target: Record<string, unknown>, propPath: string, numbers: number[]) => void = (
    target,
    propPath,
    numbers
  ) => {
    ReflectionTool.setValue(target, propPath, numbers[0]);
  };

  getDirect: (target: Record<string, unknown>, propPath: string) => number[] = (target, propPath) => {
    const v = ReflectionTool.getValue(target, propPath) as Vector3;
    return this.convertToNumbers(v);
  };
}

export const TypeToAnimParamModelMapInstance: Record<string, IAnimatedParameterModel<any>> = {
  number: new AnimatedNumberModel(),
  bool: new AnimatedBoolModel(),
  Vector3: new AnimatedVector3Model(),
};
