import { AnyCtor, MetadataProp } from '@/core';

export const getValue = (object: object, metadataProp: MetadataProp) => {
  return metadataProp.get?.(object);
  // if (isValidKey(propertyPath, object)) {
  //   return object[propertyPath] as unknown;
  // }
};

export function setValue(object: object, metadataProp: MetadataProp, value: unknown) {
  metadataProp.set?.(object, value);
  // if (isValidKey(propertyPath, object)) {
  //   (object[propertyPath] as unknown) = value;
  // }
}
