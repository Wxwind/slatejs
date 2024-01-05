import { isNil } from '@/util';
import { globalTypeMap } from './GlobalTypeMap';
import { getClassStathFromMetadata } from './decorators/util';

export const getRelativeProp = (rootType: string, propPath: string) => {
  const metadata = globalTypeMap.get(rootType);
  if (isNil(metadata)) {
    throw new Error(`cannot find metadata of class '${rootType}', must add @egclass for class`);
  }
  const stash = getClassStathFromMetadata(metadata);
  const metadataProp = stash[propPath];
  if (isNil(metadataProp)) {
    throw new Error(
      `cannot find metadata of propPath '${propPath}' in class '${rootType}', must add @property or @accessor for prop`
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
