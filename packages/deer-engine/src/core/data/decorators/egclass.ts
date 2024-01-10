/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { globalTypeMap } from '../GlobalTypeMap';
import { ClassClassDecorator } from '../type';
import { getClassName } from './util';

export function egclass<Class extends abstract new (...args: any[]) => any>(name?: string): ClassClassDecorator<Class> {
  return (target: Class, context: ClassDecoratorContext<Class>) => {
    globalTypeMap.set(name || getClassName(target), target);
  };
}
