import { ClassFieldDecorator, IPropertyOptions } from '../type';
import { DecoratorMetadataObjectForRF, MetadataProp, getClassName, getClassStashFromMetadata } from './util';
import { merge } from 'lodash-es';

// @property({})
export function property<This, Value>(options: IPropertyOptions): ClassFieldDecorator<This, Value> {
  const decorator = (target: undefined, context: ClassFieldDecoratorContext<This, Value>) => {
    const metadata = context.metadata as DecoratorMetadataObjectForRF;
    const classStash = getClassStashFromMetadata(metadata);

    const { type, animatable } = options;
    const typeName = type ? getClassName(type) : undefined;

    const originStash = classStash[context.name] ?? (classStash[context.name] = {});
    const newStash: MetadataProp = {
      type,
      typeName,
      animatable,
      set: context.access.set,
      get: context.access.get,
    };

    // FIXME must clone metadata.__propertyCache__ before modified, otherwise metadata will be mixed by inheritance. May it be the babel's bug?
    metadata.__propertyCache__ = { ...metadata.__propertyCache__ };
    metadata.__propertyCache__[context.name] = merge(originStash || {}, newStash);

    return;
  };

  return decorator;
}

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
    const classStash = getClassStashFromMetadata(metadata);
    const originStash = classStash[context.name];
    const { type, animatable } = options;
    const typeName = type ? getClassName(type) : undefined;

    let newStash: MetadataProp;
    switch (context.kind) {
      case 'accessor':
        newStash = {
          type,
          typeName,
          animatable,
          get: context.access.get,
          set: context.access.set,
        };
        break;
      case 'setter':
        newStash = {
          type,
          typeName,
          animatable,
          get: undefined,
          set: context.access.set,
        };
        break;
      case 'getter':
        newStash = {
          type,
          typeName,
          animatable,
          get: context.access.get,
          set: undefined,
        };
        break;
      default:
        return;
    }

    console.log(typeName, context.name, metadata);

    // must clone metadata.__propertyCache__ before modified, otherwise metadata will be mixed by inheritance.
    metadata.__propertyCache__ = { ...metadata.__propertyCache__ };
    metadata.__propertyCache__[context.name] = merge(originStash || {}, newStash);

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
