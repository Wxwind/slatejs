/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPropertyOptions } from '../type';
import { CACHE_KEY, DecoratorMetadataObjectForRF, getClassStathFromMetadata } from './util';

type ClassFieldDecorator<This = unknown, Value = unknown> = (
  target: undefined,
  context: ClassFieldDecoratorContext<This, Value>
) => ((initialValue: Value) => Value) | void;

type ClassGetterDecorator<This, Value> = (
  target: () => Value,
  context: ClassGetterDecoratorContext<This, Value>
) => (() => Value) | void;

type ClassSetterDecorator<This, Value> = (
  target: (value: Value) => void,
  context: ClassSetterDecoratorContext<This, Value>
) => ((value: Value) => void) | void;

type ClassAutoAccessorDecrator<This, Value> = (
  target: ClassAccessorDecoratorTarget<This, Value>,
  context: ClassAccessorDecoratorContext<This, Value>
) => ClassAccessorDecoratorResult<This, Value> | void;

type ClassMethodDecorator<This, Args extends any[], Return> = (
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext
) => ((this: This, ...args: Args) => Return) | void;

// support and @property({})
export function property<This, Value>(options: IPropertyOptions): ClassFieldDecorator<This, Value> {
  const decorator = (target: undefined, context: ClassFieldDecoratorContext<This, Value>) => {
    const metadata = context.metadata as DecoratorMetadataObjectForRF;
    const stash = getClassStathFromMetadata(metadata);
    stash[context.name] = {
      type: options.type,
      set: context.access.set,
      get: context.access.get,
      uiOptions: {
        ...options,
      },
    };
    return;
  };

  return decorator;
}

// TODO: support @property
export const property3 = <This, Value>(target: This, context: ClassFieldDecoratorContext<This, Value>) => {
  return (initialValue: Value) => {
    return initialValue;
  };
};

export function accessor<This, Value>(
  options: IPropertyOptions
): (
  target: unknown,
  context:
    | ClassGetterDecoratorContext<This, Value>
    | ClassSetterDecoratorContext<This, Value>
    | ClassAccessorDecoratorContext<This, Value>
) => void {
  const decorator = (
    target: unknown,
    context:
      | ClassGetterDecoratorContext<This, Value>
      | ClassSetterDecoratorContext<This, Value>
      | ClassAccessorDecoratorContext<This, Value>
  ) => {
    const metadata = context.metadata as DecoratorMetadataObjectForRF;
    const stash = getClassStathFromMetadata(metadata);
    const originStash = stash[context.name];
    switch (context.kind) {
      case 'accessor':
        stash[context.name] = {
          type: options.type,
          get: context.access.get,
          set: context.access.set,
          uiOptions: {
            ...options,
          },
          ...originStash,
        };
        break;
      case 'setter':
        stash[context.name] = {
          type: options.type,
          get: undefined,
          set: context.access.set,
          uiOptions: {
            ...options,
          },
          ...originStash,
        };
        break;
      case 'getter':
        stash[context.name] = {
          type: options.type,
          get: context.access.get,
          set: undefined,
          uiOptions: {
            ...options,
          },
          ...originStash,
        };
        break;
      default:
        break;
    }

    return;
  };

  return decorator;
}

export function getter<This, Value>(options: IPropertyOptions): ClassGetterDecorator<This, Value> {
  const decorator = (target: () => Value, context: ClassGetterDecoratorContext<This, Value>) => {
    const metadata = context.metadata as DecoratorMetadataObjectForRF;
    const stash = getClassStathFromMetadata(metadata);
    const originStash = stash[context.name];
    stash[context.name] = {
      ...originStash,
      type: options.type,
      get: context.access.get,
      set: undefined,
      uiOptions: {
        ...options,
      },
    };
    return;
  };

  return decorator;
}

export function setter<This, Value>(options: IPropertyOptions): ClassSetterDecorator<This, Value> {
  const decorator = (target: (value: Value) => void, context: ClassSetterDecoratorContext<This, Value>) => {
    const metadata = context.metadata as DecoratorMetadataObjectForRF;
    const stash = getClassStathFromMetadata(metadata);
    const originStash = stash[context.name];
    stash[context.name] = {
      ...originStash,
      type: options.type,
      get: undefined,
      set: context.access.set,
      uiOptions: {
        ...options,
      },
    };
    return;
  };

  return decorator;
}

export function autoAccessor<This, Value>(options: IPropertyOptions): ClassAutoAccessorDecrator<This, Value> {
  const decorator = (
    target: ClassAccessorDecoratorTarget<This, Value>,
    context: ClassAccessorDecoratorContext<This, Value>
  ) => {
    const metadata = context.metadata as DecoratorMetadataObjectForRF;
    const stash = getClassStathFromMetadata(metadata);
    stash[context.name] = {
      type: options.type,
      set: context.access.set,
      get: context.access.get,
      uiOptions: {
        ...options,
      },
    };
    return;
  };

  return decorator;
}

function testFuncDecorator<This, Args extends any[], Return>(
  options: unknown
): ClassMethodDecorator<This, Args, Return> {
  const decorator = (
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
  ) => {
    return;
  };

  return decorator;
}

class Controller {
  private _pos = 0;

  constructor(p: number) {
    this._pos = p;
  }

  @accessor({})
  get pos() {
    return this._pos;
  }

  @accessor({})
  set pos(value: number) {
    this._pos = value;
  }
}
