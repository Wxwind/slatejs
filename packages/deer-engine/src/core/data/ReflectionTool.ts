import { isNil } from '@/util';
import { globalTypeMap } from './GlobalTypeMap';
import { getClassStath, getClassStathFromMetadata, getMetadataFromCtor } from './decorators/util';

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

export function setValue<T extends Record<string, unknown>, K extends keyof T>(
  object: T,
  propertyPath: K,
  value: T[K]
) {
  object[propertyPath] = value;
}
