/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNil } from '@/util';
import { GroupOptions } from '../type';

export const CACHE_KEY = Symbol('__propertyCache__');
export const CLASS_NAME_KEY = Symbol('__classname__');

export type DecoratorMetadataObjectForRF = Partial<{
  CACHE_KEY: MetadataClass;
  CLASS_NAME_KEY: string;
}>;

export type MetadataClass = Record<string | symbol, MetadataProp | undefined>;

export type MetadataProp = Partial<{
  type: (new () => unknown) | Array<new () => unknown>;
  typeName: string | undefined;
  set: (object: any, value: any) => void;
  get: (object: any) => unknown;
  uiOptions: Partial<{
    group: string | GroupOptions;
    displayName: string;
    tooltip: string;
    min: number;
    max: number;
  }>;
}>;
export type AnyCtor = abstract new (...args: any[]) => unknown;

export function getMetadataFromCtor(ctor: AnyCtor) {
  return ctor[Symbol.metadata] as DecoratorMetadataObjectForRF;
}

export function getClassStath(ctor: abstract new (...args: any[]) => any): MetadataClass {
  const metadata = ctor[Symbol.metadata];
  if (isNil(metadata)) {
    ctor[Symbol.metadata] = {};
  }
  return getClassStathFromMetadata(ctor[Symbol.metadata]!);
}

export function getClassStathFromMetadata(metadata: DecoratorMetadataObject): MetadataClass {
  return (
    (metadata as DecoratorMetadataObjectForRF).CACHE_KEY ?? ((metadata as DecoratorMetadataObjectForRF).CACHE_KEY = {})
  );
}

/**
 * reference from Cocos/core/utils/js-typed.ts
 */
export function getClassName(objOrCtor: AnyCtor | AnyCtor[] | Record<string, unknown>): string {
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
  } else if (Array.isArray(objOrCtor)) {
    if (objOrCtor.length === 0) {
      return '[]';
    }
    let name = '[';
    for (let i = 0; i < objOrCtor.length; i++) {
      if (i !== 0) {
        name += ',';
      }
      const ctor = objOrCtor[i];
      name += getClassName(ctor);
    }
    return name + ']';
  } else if (objOrCtor && objOrCtor.constructor) {
    // is obj instance
    return getClassName(objOrCtor.constructor as AnyCtor);
  }
  return '';
}
