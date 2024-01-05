/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { globalTypeMap } from '../GlobalTypeMap';
import { ClassClassDecorator } from '../type';
import { getClassName, getClassStath } from './util';

export function egclass<Class extends abstract new (...args: any[]) => any>(name?: string): ClassClassDecorator<Class> {
  return (target: Class, context: ClassDecoratorContext<Class>) => {
    const metadata = getClassStath(target);
    globalTypeMap.set(name || getClassName(target), metadata);
  };
}
