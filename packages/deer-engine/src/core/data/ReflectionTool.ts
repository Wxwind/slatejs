/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNil, isPlainObject } from '@/util';
import { globalTypeMap } from './GlobalTypeMap';
import { getClassStath } from './decorators/util';

export const getRelativeProp = (compType: string, propPath: string) => {
  const classCtor = globalTypeMap.get(compType);
  if (isNil(classCtor)) {
    throw new Error(`cannot find metadata of class '${compType}', must add @egclass for class to register class type`);
  }
  const stash = getClassStath(classCtor);
  const metadataProp = stash[propPath];
  if (isNil(metadataProp)) {
    throw new Error(
      `cannot find metadata of propPath '${propPath}' in class '${compType}', must add @property or @accessor for prop`
    );
  }
  return metadataProp;
};

function toJson(obj: any): string {
  if (isPlainObject(obj)) {
    return JSON.stringify(obj);
  }

  if ('toJsonObject' in obj) {
    const jsonObj = obj.toJsonObject();
    return JSON.stringify(jsonObj);
  }

  console.error("toJsonObject() function is not existed in obj %o, are you missing '@egclass'?", obj);

  return '<missing metadata>';
}

function fromJson<T extends object>(json: string, classType: new () => T) {
  const jsonObj = JSON.parse(json);
  const obj = new classType() as any;
  if ('fromJsonObject' in obj) {
    obj.fromJsonObject(jsonObj);
  } else {
    console.error("fromJsonObject() function is not existed in obj %o, are you missing '@egclass'?", obj);
  }
  return obj as T;
}

export const JsonModule = {
  toJson,
  fromJson,
};
