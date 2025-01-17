/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNil } from '@/util';

export type DecoratorMetadataObjectForRF = Partial<{
  __propertyCache__: MetadataClass;
  __classname__: string;
  __attachTracks__: string[];
}>;

export type MetadataClass = Record<string | symbol, MetadataProp | undefined>;

export type MetadataProp = Partial<{
  type: (new () => unknown) | (new () => unknown)[];
  typeName: string;
  set: (object: any, value: any) => void;
  get: (object: any) => unknown;
  allowEmpty: boolean; // allow null or undefined when parse from json
  animatable: boolean; // can be animated in slatejs.
}>;
9;
export type AnyCtor = (new (...args: any[]) => any) | (abstract new (...args: any[]) => any);

export type NoAbstractCtor = new (...args: any[]) => any;

export function getMetadataFromObj(obj: any) {
  return obj.constructor[Symbol.metadata] as DecoratorMetadataObjectForRF;
}

export function getMetadataFromCtor(ctor: AnyCtor) {
  return ctor[Symbol.metadata] as DecoratorMetadataObjectForRF;
}

export function getClassStash(ctor: abstract new (...args: any[]) => any): MetadataClass {
  const metadata = ctor[Symbol.metadata];
  if (isNil(metadata)) {
    ctor[Symbol.metadata] = {};
  }
  return getClassStashFromMetadata(ctor[Symbol.metadata]!);
}

export function hasClassStash(ctor: abstract new (...args: any[]) => any): boolean {
  const metadata = ctor[Symbol.metadata];
  let ok = !isNil(metadata);
  if (ok) {
    ok = !isNil((metadata as DecoratorMetadataObjectForRF).__propertyCache__);
  }
  return ok;
}

export function getClassStashFromMetadata(metadata: DecoratorMetadataObject): MetadataClass {
  const m = metadata as DecoratorMetadataObjectForRF;
  if (isNil(m.__propertyCache__)) {
    m.__propertyCache__ = {};
  }
  return m.__propertyCache__;
}

/**
 * reference from Cocos/core/utils/js-typed.ts
 */
export function getClassName(objOrCtor: AnyCtor | AnyCtor[] | Record<string, unknown>): string {
  if (typeof objOrCtor === 'function') {
    // is ctor
    const metadata = getMetadataFromCtor(objOrCtor);
    if (metadata && metadata.__classname__) {
      return metadata.__classname__;
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
        arr = /\[\w+\s*(\w+)\]/.exec(str);
      } else {
        // str is function objectClass () {} for IE Firefox
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
