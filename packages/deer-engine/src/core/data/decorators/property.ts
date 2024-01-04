/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassFieldDecorator, IPropertyOptions } from '../type';
import { DecoratorMetadataObjectForRF, MetadataProp, getClassName, getClassStathFromMetadata } from './util';
import { merge } from 'lodash';

// @property({})
export function property<This, Value>(options: IPropertyOptions): ClassFieldDecorator<This, Value> {
  const decorator = (target: undefined, context: ClassFieldDecoratorContext<This, Value>) => {
    const metadata = context.metadata as DecoratorMetadataObjectForRF;
    const stash = getClassStathFromMetadata(metadata);
    const { type, ...uiOptions } = options;
    const typeName = type ? getClassName(type) : undefined;
    const originStash = stash[context.name];

    const newStash = {
      type,
      typeName,
      set: context.access.set,
      get: context.access.get,
      uiOptions: {
        ...uiOptions,
      },
    };

    merge(originStash, newStash);
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

// used for decorate get, set and autoAccessor
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
    const { type, ...uiOptions } = options;
    const typeName = type ? getClassName(type) : undefined;

    let newStash: MetadataProp;
    switch (context.kind) {
      case 'accessor':
        newStash = {
          type,
          typeName,
          get: context.access.get,
          set: context.access.set,
          uiOptions: {
            ...uiOptions,
          },
        };
        break;
      case 'setter':
        newStash = {
          type,
          typeName,
          get: undefined,
          set: context.access.set,
          uiOptions: {
            ...uiOptions,
          },
        };
        break;
      case 'getter':
        newStash = {
          type,
          typeName,
          get: context.access.get,
          set: undefined,
          uiOptions: {
            ...uiOptions,
          },
        };
        break;
      default:
        return;
    }

    merge(originStash, newStash);
    return;
  };

  return decorator;
}

// function testFuncDecorator<This, Args extends any[], Return>(
//   options: unknown
// ): ClassMethodDecorator<This, Args, Return> {
//   const decorator = (
//     target: (this: This, ...args: Args) => Return,
//     context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
//   ) => {
//     return;
//   };

//   return decorator;
// }
