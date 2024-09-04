/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyCtor } from './decorators/util';

/* eslint-disable @typescript-eslint/ban-types */
export type ClassFieldDecorator<This = unknown, Value = unknown> = (
  target: undefined,
  context: ClassFieldDecoratorContext<This, Value>
) => ((initialValue: Value) => Value) | void;

export type ClassClassDecorator<Class extends abstract new (...args: any[]) => any> = (
  target: Class,
  context: ClassDecoratorContext<Class>
) => Class | void;

export type ClassGetterDecorator<This, Value> = (
  target: () => Value,
  context: ClassGetterDecoratorContext<This, Value>
) => (() => Value) | void;

export type ClassSetterDecorator<This, Value> = (
  target: (value: Value) => void,
  context: ClassSetterDecoratorContext<This, Value>
) => ((value: Value) => void) | void;

export type ClassAutoAccessorDecrator<This, Value> = (
  target: ClassAccessorDecoratorTarget<This, Value>,
  context: ClassAccessorDecoratorContext<This, Value>
) => ClassAccessorDecoratorResult<This, Value> | void;

export type ClassMethodDecorator<This, Args extends unknown[], Return> = (
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext
) => ((this: This, ...args: Args) => Return) | void;

export type GroupOptions = { name: string } & Partial<{
  id: string;
  name: string;
  displayOrder: number;
  style: string;
}>;

export type IPropertyOptions = Partial<{
  type: (new () => unknown) | Array<new () => unknown>;
  group: string | GroupOptions;
  displayName: string;
  tooltip: string;
  min: number;
  max: number;
  animatable: boolean;
}>;
