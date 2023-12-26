/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNil } from '@/util';
import { GroupOptions } from '../type';

export const CACHE_KEY = Symbol('__egclassCache__');
export const CLASS_NAME_KEY = Symbol('__classname__');

export type DecoratorMetadataObjectForRF = {
  CACHE_KEY: MetadataClass | undefined;
  CLASS_NAME_KEY: string | undefined;
};

export type MetadataClass = Record<string | symbol, MetadataProp | undefined>;

export type MetadataProp = {
  type: string | undefined;
  set: ((object: any, value: any) => void) | undefined;
  get: ((object: any) => unknown) | undefined;
  uiOptions: {
    group?: string | GroupOptions;
    displayName?: string;
    tooltip?: string;
    min?: number;
    max?: number;
  };
};
export type AnyCtor = new (...args: any[]) => unknown;

export function getMetadataFromCtor(ctor: AnyCtor) {
  return ctor[Symbol.metadata] as DecoratorMetadataObjectForRF;
}

export function getClassStath(ctor: new (...args: any[]) => any): MetadataClass {
  const metadata = ctor[Symbol.metadata];
  if (isNil(metadata)) {
    ctor[Symbol.metadata] = {};
  }
  return getClassStathFromMetadata(metadata!);
}

export function getClassStathFromMetadata(metadata: DecoratorMetadataObject): MetadataClass {
  return (
    (metadata as DecoratorMetadataObjectForRF).CACHE_KEY ?? ((metadata as DecoratorMetadataObjectForRF).CACHE_KEY = {})
  );
}

/**
 * @reference
 * Cocos/core/utils/js-typed.ts
 * @en
 * Gets class name of the object, if object is just a {} (and which class named 'Object'), it will return "".
 * (modified from <a href="http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class">the code of stackoverflow post</a>)
 * @zh
 * 获取对象的类型名称，如果对象是 {} 字面量，将会返回 ""。参考了 stackoverflow 的代码实现：
 * <a href="http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class">stackoverflow 的实现</a>
 * @param objOrCtor @en An object instance or constructor. @zh 类实例或者构造函数。
 * @returns @en The class name. @zh 类名。
 */
export function getClassName(objOrCtor: AnyCtor | Record<string, unknown>): string {
  if (typeof objOrCtor === 'function') {
    // is ctor
    const metadata = getMetadataFromCtor(objOrCtor);
    if (metadata && metadata.CLASS_NAME_KEY) {
      return metadata.CLASS_NAME_KEY;
    }

    let ret = '';
    //  for browsers which have name property in the constructor of the object, such as chrome
    if (objOrCtor.name) {
      ret = objOrCtor.name;
    }
    if (objOrCtor.toString) {
      let arr;
      const str = objOrCtor.toString();
      if (str.charAt(0) === '[') {
        // str is "[object objectClass]"
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        arr = /\[\w+\s*(\w+)\]/.exec(str);
      } else {
        // str is function objectClass () {} for IE Firefox
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        arr = /function\s*(\w+)/.exec(str);
      }
      if (arr && arr.length === 2) {
        ret = arr[1];
      }
    }
    return ret !== 'Object' ? ret : '';
  } else if (objOrCtor && objOrCtor.constructor) {
    // is obj instance
    return getClassName(objOrCtor.constructor as AnyCtor);
  }
  return '';
}
