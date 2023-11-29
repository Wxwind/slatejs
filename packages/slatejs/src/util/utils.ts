import { v4 as uuid } from 'uuid';
export const deepClone = <T>(v: T) => {
  return JSON.parse(JSON.stringify(v)) as T;
};

export const genUUID = (prefix: string = '') => {
  return prefix + uuid();
};
