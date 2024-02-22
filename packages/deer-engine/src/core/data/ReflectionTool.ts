import { isNil } from '@/util';
import { globalTypeMap } from './GlobalTypeMap';
import { AnyCtor, NoAbstractCtor, getClassStath } from './decorators/util';

export function getRelativeProp(type: string, propPath: string) {
  const classCtor = globalTypeMap.get(type);
  if (isNil(classCtor)) {
    throw new Error(`cannot find metadata of class '${type}', must add @egclass for class to register class type`);
  }
  const stash = getClassStath(classCtor);
  const metadataProp = stash[propPath];
  if (isNil(metadataProp)) {
    throw new Error(
      `cannot find metadata of propPath '${propPath}' in class '${type}', must add @property or @accessor for prop`
    );
  }
  return metadataProp;
}

// isSubclassOf(ClassA,ClassA) also returns true
export function isSubclassOf(ctor: AnyCtor, ancestor: AnyCtor): boolean {
  let c = ctor.prototype;
  while (c) {
    if (c.constructor === ancestor) return true;
    c = Object.getPrototypeOf(c);
  }
  return false;
}

const subclassMap = new Map<AnyCtor, NoAbstractCtor[]>();

export function getSubclassOf(ctor: AnyCtor): NoAbstractCtor[] {
  const cache = subclassMap.get(ctor);
  if (cache) return cache;

  const res: NoAbstractCtor[] = [];
  for (const c of globalTypeMap.values()) {
    if (isSubclassOf(c, ctor)) {
      res.push(c);
    }
  }

  subclassMap.set(ctor, res);
  return res;
}
