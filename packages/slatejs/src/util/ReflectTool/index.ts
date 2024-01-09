import { isValidKey } from '../typeGuard';

export const getValue = (object: object, propertyPath: string) => {
  if (isValidKey(propertyPath, object)) {
    return object[propertyPath] as unknown;
  }
};

export function setValue(object: object, propertyPath: string, value: unknown) {
  if (isValidKey(propertyPath, object)) {
    (object[propertyPath] as unknown) = value;
  }
}
