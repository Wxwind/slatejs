/* eslint-disable @typescript-eslint/no-explicit-any */
import { isPlainObject } from '@/util';
import { getClassName } from './decorators';
import { globalTypeMap } from './GlobalTypeMap';

export interface ISerializationCallbackReceiver {
  onBeforeSerialize(): void;
  onAfterDeserialize(): void;
}

function toJson(obj: any): string {
  if (isPlainObject(obj)) {
    return JSON.stringify(obj);
  }

  if ('onBeforeSerialize' in obj) {
    obj.onBeforeSerialize();
  }

  if ('toJsonObject' in obj) {
    const jsonObj = obj.toJsonObject();
    jsonObj['metadata'] = {
      typeName: getClassName(obj),
    };
    return JSON.stringify(jsonObj);
  }

  console.error("toJsonObject() function is not existed in obj %o, are you missing '@egclass'?", obj);

  return '<missing metadata>';
}

function toJsonObject(obj: any) {
  if (isPlainObject(obj)) {
    return JSON.parse(JSON.stringify(obj));
  }

  if ('onBeforeSerialize' in obj) {
    obj.onBeforeSerialize();
  }

  if ('toJsonObject' in obj) {
    const jsonObj = obj.toJsonObject();
    return jsonObj;
  }

  console.error("toJsonObject() function is not existed in obj %o, are you missing '@egclass'?", obj);

  return undefined;
}

function fromJson(json: string) {
  const jsonObj = JSON.parse(json);

  const classType = globalTypeMap.get(jsonObj['metadata']);

  // if not have metadata, treated as plain object
  if (!classType) {
    return jsonObj;
  }

  const obj = new classType();
  if ('fromJsonObject' in obj && typeof obj.fromJsonObject === 'function') {
    obj.fromJsonObject(jsonObj);

    if ('onAfterDeserialize' in obj && typeof obj.onAfterDeserialize === 'function') {
      obj.onAfterDeserialize();
    }
  } else {
    console.error("fromJsonObject() function is not existed in obj %o, are you missing '@egclass'?", obj);
  }
  return obj;
}

function fromJsonObject<T extends object>(jsonObj: any, classType: new () => T) {
  const obj = new classType();
  if ('fromJsonObject' in obj && typeof obj.fromJsonObject === 'function') {
    obj.fromJsonObject(jsonObj);

    if ('onAfterDeserialize' in obj && typeof obj.onAfterDeserialize === 'function') {
      obj.onAfterDeserialize();
    }
  } else {
    console.error("fromJsonObject() function is not existed in obj %o, are you missing '@egclass'?", obj);
  }
  return obj;
}

export const JsonModule = {
  /** serialize plain object or class decorated by egclass */
  toJson,
  /** serialize plain object or class decorated by egclass */
  toJsonObject,
  /** deserialize json to class decorated by egclass */
  fromJson,
  /** deserialize json object to class decorated by egclass */
  fromJsonObject,
};
