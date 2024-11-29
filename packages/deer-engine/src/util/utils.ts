import { v4 as uuid } from 'uuid';

export const genUUID = (prefix: string = '') => {
  return prefix + uuid();
};
